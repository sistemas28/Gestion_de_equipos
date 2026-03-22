import React, { useEffect, useState, useRef } from "react";
import './home.css';
import api from '../../api/axios.js';
import MaintenancePage from '../mantenimiento/MaintenancePage.jsx';
import LicenciamientoPage from '../licenciamiento/LicenciamientoPage.jsx';
import CopiasPage from '../copiasDeSeguridad/CopiasPage.jsx';
import ImpresorasPage from '../impresoras/ImpresorasPage.jsx';
import AgregarEquipoPage from './AgregarEquipoPage.jsx';
import HistorialEquiposPage from '../historialEquipos/HistorialEquiposPage.jsx';
import UserSettingsModal from './UserSettingsModal.jsx';
import AppSettingsModal from './AppSettingsModal.jsx';
import RemindersWidget from './RemindersWidget.jsx';
import { FaBars, FaUser, FaCog, FaSignOutAlt, FaCheck, FaTools, FaFileAlt, FaDatabase, FaPlus, FaTimes, FaUsers, FaLaptop, FaHistory, FaPrint } from 'react-icons/fa';
import logo from '../../assets/LOGO_INSTITUCIONAL.jpg';

// Importar nuevos componentes de notificaciones
import NotificationBell from '../../components/notifications/NotificationBell.jsx';
import NotificationPanel from '../../components/notifications/NotificationPanel.jsx';
import { useNotifications } from '../../context/NotificationContext';

// Importar componentes móviles
import useIsMobile from '../../hooks/useIsMobile';
import MobileLayout from '../../components/mobile/MobileLayout';

// Componente principal que decide qué renderizar
function Home({ onBack, username }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <MobileLayout
                username={username}
                onLogout={() => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('username');
                    onBack && onBack();
                }}
            />
        );
    }

    return <DesktopHome onBack={onBack} username={username} />;
}

// Lógica original de escritorio encapsulada
function DesktopHome({ onBack, username }) {
    const [now, setNow] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showUserSettings, setShowUserSettings] = useState(false);
    const [showAppSettings, setShowAppSettings] = useState(false);

    const [currentView, setCurrentView] = useState('dashboard');

    // Estados para datos de progreso
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [backupsData, setBackupsData] = useState([]);
    const [progressPeriod, setProgressPeriod] = useState('month');

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const { notifications } = useNotifications();


    useEffect(() => {
        fetchMaintenanceData();
        fetchBackupsData();
    }, []);

    // Refrescar datos al volver al dashboard para asegurar sincronización
    useEffect(() => {
        if (currentView === 'dashboard') {
            fetchMaintenanceData();
            fetchBackupsData();
        }
    }, [currentView]);

    const fetchMaintenanceData = async () => {
        try {
            const response = await api.get('/mantenimiento');
            setMaintenanceData(response.data.body || []);
        } catch (err) {
            console.error('Error fetching maintenance data:', err);
        }
    };

    const fetchBackupsData = async () => {
        try {
            const response = await api.get('/CopiasDeSeguridad');
            setBackupsData(response.data.body || []);
        } catch (err) {
            console.error('Error fetching backups data:', err);
        }
    };

    const getMaintenanceStats = (data, period) => {
        if (!data.length) return { percentage: 0, completed: 0, total: 0 };
        const now = new Date();
        let startDate, endDate;
        switch (period) {
            case 'month': startDate = new Date(now.getFullYear(), now.getMonth(), 1); endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); break;
            case 'quarter': const qs = Math.floor(now.getMonth() / 3) * 3; startDate = new Date(now.getFullYear(), qs, 1); endDate = new Date(now.getFullYear(), qs + 3, 0); break;
            case 'year': startDate = new Date(now.getFullYear(), 0, 1); endDate = new Date(now.getFullYear(), 11, 31); break;
            default: return { percentage: 0, completed: 0, total: 0 };
        }
        const periodData = data.filter(item => {
            const itemDate = new Date(item.fecha_actual_de_mantenimiento || item.fecha_de_ejecucion || item.fecha_de_elaboracion);
            return itemDate >= startDate && itemDate <= endDate;
        });
        const completed = periodData.filter(item => item.estado === 'Terminado').length;
        const total = periodData.length;
        return {
            percentage: total ? Math.round((completed / total) * 100) : 0,
            completed,
            total
        };
    };

    const getBackupsStats = (data, period) => {
        if (!data.length) return { percentage: 0, completed: 0, total: 0 };
        const now = new Date();
        let startDate, endDate;
        switch (period) {
            case 'month': startDate = new Date(now.getFullYear(), now.getMonth(), 1); endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); break;
            case 'quarter': const qs = Math.floor(now.getMonth() / 3) * 3; startDate = new Date(now.getFullYear(), qs, 1); endDate = new Date(now.getFullYear(), qs + 3, 0); break;
            case 'year': startDate = new Date(now.getFullYear(), 0, 1); endDate = new Date(now.getFullYear(), 11, 31); break;
            default: return { percentage: 0, completed: 0, total: 0 };
        }
        const periodData = data.filter(item => {
            const itemDate = new Date(item.fecha);
            return itemDate >= startDate && itemDate <= endDate;
        });
        const completed = periodData.filter(item => item.estado_copia === 'Exitosa').length;
        const total = periodData.length;
        return {
            percentage: total ? Math.round((completed / total) * 100) : 0,
            completed,
            total
        };
    };



    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    const day = now.toLocaleDateString([], { day: '2-digit' });
    const month = now.toLocaleDateString([], { month: 'long' }).toUpperCase();
    const year = now.getFullYear();

    return (
        <div className={`home-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <aside className="sidebar glass">
                <div className="sidebar-header">
                    <div className="sidebar-brand-container">
                        <div className="sidebar-brand-text">
                            GESTIÓN<span>CORE</span>
                        </div>
                    </div>
                </div>
                
                <nav className="side-nav">
                    {[
                        { id: 'dashboard', icon: <FaLaptop />, label: 'Dashboard' },
                        { id: 'mantenimiento', icon: <FaTools />, label: 'Mantenimiento' },
                        { id: 'licenciamiento', icon: <FaFileAlt />, label: 'Licencias' },
                        { id: 'copias', icon: <FaDatabase />, label: 'Copias' },
                        { id: 'impresoras', icon: <FaPrint />, label: 'Impresoras' },
                        { id: 'agregarEquipo', icon: <FaPlus />, label: 'Nuevo Equipo' },
                        { id: 'historial', icon: <FaHistory />, label: 'Historial' }
                    ].map(item => (
                        <button 
                            key={item.id} 
                            className={`nav-btn ${currentView === item.id ? 'active' : ''}`} 
                            onClick={() => setCurrentView(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                </div>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div className="topbar-left">
                        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <FaBars />
                        </button>
                        <div className="view-title">
                            {currentView === 'dashboard' ? 'PANEL DE CONTROL' : currentView.toUpperCase()}
                        </div>
                    </div>
                    
                    <div className="topbar-right">
                        <div className="topbar-brand-mark">
                            <img src={logo} alt="Corp Logo" className="topbar-logo-img" />
                        </div>
                        <div className="topbar-clock glass">
                            <span className="clock-time">{timeStr}</span>
                            <span className="clock-date">{now.toLocaleDateString([], { weekday: 'short' })}</span>
                        </div>
                        <NotificationBell />
                        <div className="topbar-actions">
                            <button className="top-action-btn" title="Ajustes de usuario" onClick={() => setShowUserSettings(true)}><FaUser /></button>
                            <button className="top-action-btn" title="Ajustes de la aplicación" onClick={() => setShowAppSettings(true)}><FaCog /></button>
                        </div>
                        <div className="user-profile-mini">
                            <div className="user-info">
                                <span className="user-name">{username || 'Usuario'}</span>
                                <span className="user-role">Personal Técnico</span>
                            </div>
                            <div className="user-avatar user-type-normal">
                                {username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <button className="profile-logout-btn" title="Cerrar Sesión" onClick={() => {
                                localStorage.removeItem('authToken');
                                localStorage.removeItem('username');
                                onBack && onBack();
                            }}><FaSignOutAlt /></button>
                        </div>
                    </div>
                </header>

                <div className="content-container animate-fade">
                    {currentView === 'dashboard' && (
                        <div className="dashboard-content">
                            <section className="welcome-banner user-banner">
                                <div className="banner-content">
                                    <h1>¡Hola, {username}!</h1>
                                    <p>Bienvenido a tu estación de trabajo. Gestiona tus tareas de mantenimiento y equipos de forma eficiente.</p>
                                    <div className="banner-actions">
                                        <button className="btn-banner" onClick={() => setCurrentView('mantenimiento')}>Gestionar Mantenimientos</button>
                                        <button className="btn-banner secondary" onClick={() => setCurrentView('agregarEquipo')}>Registrar Equipo</button>
                                    </div>
                                </div>
                                <div className="banner-illustration">
                                    <div className="circle circle-1"></div>
                                    <div className="circle circle-2"></div>
                                </div>
                            </section>

                            <section className="stats-row">
                                <div className="stat-card glass hover-lift">
                                    <div className="stat-header">
                                        <h3>Progreso Mantenimiento</h3>
                                        <span className={`stat-badge ${getMaintenanceStats(maintenanceData, progressPeriod).percentage > 50 ? 'success' : 'warning'}`}>
                                            {getMaintenanceStats(maintenanceData, progressPeriod).percentage}%
                                        </span>
                                    </div>
                                    <div className="stat-body">
                                        <div className="progress-track">
                                            <div className="progress-fill maintenance" style={{ width: `${getMaintenanceStats(maintenanceData, progressPeriod).percentage}%` }}></div>
                                        </div>
                                        <div className="stat-footer">
                                            <span>{getMaintenanceStats(maintenanceData, progressPeriod).completed} de {getMaintenanceStats(maintenanceData, progressPeriod).total} completados</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card glass hover-lift">
                                    <div className="stat-header">
                                        <h3>Estado de Backups</h3>
                                        <span className={`stat-badge ${getBackupsStats(backupsData, progressPeriod).percentage > 80 ? 'success' : 'warning'}`}>
                                            {getBackupsStats(backupsData, progressPeriod).percentage}%
                                        </span>
                                    </div>
                                    <div className="stat-body">
                                        <div className="progress-track">
                                            <div className="progress-fill backups" style={{ width: `${getBackupsStats(backupsData, progressPeriod).percentage}%` }}></div>
                                        </div>
                                        <div className="stat-footer">
                                            <span>{getBackupsStats(backupsData, progressPeriod).completed} backups verificados</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card date-stat user-date glass">
                                    <div className="calendar-day">{day}</div>
                                    <div className="calendar-meta">
                                        <span className="month">{month}</span>
                                        <span className="year">{year}</span>
                                    </div>
                                </div>
                            </section>

                            <section className="dashboard-lower">
                                <div className="dashboard-grid-footer">
                                    <RemindersWidget />
                                    <div className="period-selector-card glass">
                                        <h4>Vista de Estadísticas</h4>
                                        <p>Cambia el rango de tiempo de los indicadores.</p>
                                        <div className="custom-select-wrap">
                                            <select value={progressPeriod} onChange={(e) => setProgressPeriod(e.target.value)}>
                                                <option value="month">Este Mes</option>
                                                <option value="quarter">Este Trimestre</option>
                                                <option value="year">Este Año</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {currentView === 'mantenimiento' && <MaintenancePage />}
                    {currentView === 'licenciamiento' && <LicenciamientoPage />}
                    {currentView === 'copias' && <CopiasPage />}
                    {currentView === 'impresoras' && <ImpresorasPage />}
                    {currentView === 'agregarEquipo' && <AgregarEquipoPage onEquipoAgregado={() => setCurrentView('dashboard')} />}
                    {currentView === 'historial' && <HistorialEquiposPage />}
                </div>
            </main>

            {(showUserSettings || showAppSettings) && <div className="modal-overlay glass" onClick={() => { setShowUserSettings(false); setShowAppSettings(false); }} />}

            <NotificationPanel />

            {showUserSettings && <UserSettingsModal user={{ nombre: username }} onClose={() => setShowUserSettings(false)} />}
            {showAppSettings && <AppSettingsModal onClose={() => setShowAppSettings(false)} />}
        </div>
    );
}


export default Home;
