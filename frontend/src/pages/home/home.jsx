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
        <div className={`home-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <aside className="sidebar">
                <div className="sidebar-brand">GE<span>STIÓN</span></div>
                <nav className="side-nav">
                    <button className={currentView === 'dashboard' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('dashboard')}><FaUsers /> DASHBOARD</button>
                    <button className={currentView === 'mantenimiento' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('mantenimiento')}><FaTools /> MANTENIMIENTO</button>
                    <button className={currentView === 'licenciamiento' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('licenciamiento')}><FaFileAlt /> LICENCIAS</button>
                    <button className={currentView === 'copias' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('copias')}><FaDatabase /> COPIAS</button>
                    <button className={currentView === 'impresoras' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('impresoras')}><FaPrint /> IMPRESORAS</button>
                    <button className={currentView === 'agregarEquipo' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('agregarEquipo')}><FaLaptop /> AGREGAR EQUIPO</button>
                    <button className={currentView === 'historial' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('historial')}><FaHistory /> HISTORIAL</button>
                </nav>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div className="logo-row">
                        <button className="hamburger" onClick={() => setSidebarOpen(s => !s)} aria-label="Toggle menu"><FaBars /></button>
                        <img src={logo} alt="Logo Institucional" className="topbar-logo" />
                        <div className="org">GESTIÓN DE<br /><span>EQUIPOS</span></div>
                    </div>
                    <div className="topbar-time">{timeStr}</div>
                    <div className="top-actions">
                        <NotificationBell />
                        <button className="icon-btn" title="Ajustes de usuario" onClick={() => setShowUserSettings(true)}><FaUser /></button>
                        <button className="icon-btn" title="Ajustes de la aplicación" onClick={() => setShowAppSettings(true)}><FaCog /></button>
                        <button className="icon-btn" title="Cerrar sesión" onClick={() => {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('username');
                            onBack && onBack();
                        }}><FaSignOutAlt /></button>
                    </div>
                </header>

                {currentView === 'dashboard' && (
                    <>
                        <section className="dashboard-grid-layout">
                            <div className="hero-left big-card">
                                <div className="hero-content-flex">
                                    <div className="hero-greeting">
                                        <h2>BIENVENIDO,<br /><span className="username">{username || 'USUARIO'}</span></h2>
                                    </div>
                                    <div className="quick-actions-dashboard">
                                        <div className="quick-actions">
                                            <button className="action-btn" onClick={() => setCurrentView('mantenimiento')}>
                                                <span className="icon"><FaTools /></span> Mantenimiento
                                            </button>
                                            <button className="action-btn" onClick={() => setCurrentView('licenciamiento')}>
                                                <span className="icon"><FaFileAlt /></span> Licencias
                                            </button>
                                            <button className="action-btn" onClick={() => setCurrentView('copias')}>
                                                <span className="icon"><FaDatabase /></span> Copias
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard-widgets-col">
                                <div className="date-card-mini">
                                    <div className="day">{day}</div>
                                    <div>
                                        <div className="month">{month}</div>
                                        <div className="year">{year}</div>
                                    </div>
                                </div>
                                <RemindersWidget />
                            </div>
                        </section>
                        <section className="progress-section">
                            <div className="progress-header">
                                <h3>ESTADÍSTICAS</h3>
                                <div className="progress-selector">
                                    <select value={progressPeriod} onChange={(e) => setProgressPeriod(e.target.value)}>
                                        <option value="month">Mes</option>
                                        <option value="quarter">Trimestre</option>
                                        <option value="year">Año</option>
                                    </select>
                                </div>
                            </div>
                            <div className="progress-panels">
                                <div className="progress-card">
                                    <div className="progress-info">
                                        <div className="progress-card-header">
                                            <h4>Mantenimientos</h4>
                                            <span className="progress-percentage">{getMaintenanceStats(maintenanceData, progressPeriod).percentage}%</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div
                                                className="progress-bar-fill maintenance"
                                                style={{ width: `${getMaintenanceStats(maintenanceData, progressPeriod).percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="progress-footer">
                                            <p className="progress-label">Equipos gestionados este periodo</p>
                                            <span className="progress-count">{getMaintenanceStats(maintenanceData, progressPeriod).completed} / {getMaintenanceStats(maintenanceData, progressPeriod).total}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress-card">
                                    <div className="progress-info">
                                        <div className="progress-card-header">
                                            <h4>Copias Seguridad</h4>
                                            <span className="progress-percentage">{getBackupsStats(backupsData, progressPeriod).percentage}%</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div
                                                className="progress-bar-fill backups"
                                                style={{ width: `${getBackupsStats(backupsData, progressPeriod).percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="progress-footer">
                                            <p className="progress-label">Respaldos verificados</p>
                                            <span className="progress-count">{getBackupsStats(backupsData, progressPeriod).completed} / {getBackupsStats(backupsData, progressPeriod).total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {currentView === 'mantenimiento' && <MaintenancePage />}
                {currentView === 'licenciamiento' && <LicenciamientoPage />}
                {currentView === 'copias' && <CopiasPage />}
                {currentView === 'impresoras' && <ImpresorasPage />}
                {currentView === 'agregarEquipo' && <AgregarEquipoPage onEquipoAgregado={() => setCurrentView('dashboard')} />}
                {currentView === 'historial' && <HistorialEquiposPage />}
            </main>

            {(showUserSettings || showAppSettings) && <div className="backdrop" onClick={() => { setShowUserSettings(false); setShowAppSettings(false); }} />}

            <NotificationPanel />

            {showUserSettings && <UserSettingsModal user={{ nombre: username }} onClose={() => setShowUserSettings(false)} />}
            {showAppSettings && <AppSettingsModal onClose={() => setShowAppSettings(false)} />}
        </div>
    );
}

export default Home;
