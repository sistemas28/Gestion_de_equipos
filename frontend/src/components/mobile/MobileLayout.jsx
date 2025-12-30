import React, { useState } from 'react';
import MobileNavigation from './MobileNavigation';
import './MobileNavigation.css';
import { FaUserCircle, FaSignOutAlt, FaLaptop, FaFileAlt, FaDatabase, FaPrint, FaShieldAlt, FaTools, FaHistory } from 'react-icons/fa';
import NotificationBell from '../notifications/NotificationBell';
import NotificationPanel from '../notifications/NotificationPanel';

// Importar las páginas existentes
import MaintenancePage from '../../pages/mantenimiento/MaintenancePage.jsx';
import LicenciamientoPage from '../../pages/licenciamiento/LicenciamientoPage.jsx';
import CopiasPage from '../../pages/copiasDeSeguridad/CopiasPage.jsx';
import ImpresorasPage from '../../pages/impresoras/ImpresorasPage.jsx';
import AgregarEquipoPage from '../../pages/home/AgregarEquipoPage.jsx';
import HistorialEquiposPage from '../../pages/historialEquipos/HistorialEquiposPage.jsx';
import api from '../../api/axios';

const MobileLayout = ({ username, onLogout }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [backupsData, setBackupsData] = useState([]);
    const [progressPeriod, setProgressPeriod] = useState('month');
    const [loading, setLoading] = useState(false);

    const fetchMaintenanceData = async () => {
        try {
            const response = await api.get('/mantenimiento');
            setMaintenanceData(response.data.body || []);
        } catch (err) {
            console.error("Error fetching maintenance:", err);
        }
    };

    const fetchBackupsData = async () => {
        try {
            const response = await api.get('/CopiasDeSeguridad');
            setBackupsData(response.data.body || []);
        } catch (err) {
            console.error("Error fetching backups:", err);
        }
    };

    React.useEffect(() => {
        if (currentView === 'dashboard') {
            fetchMaintenanceData();
            fetchBackupsData();
        }
    }, [currentView]);

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

    // Renderizar contenido basado en la vista actual
    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return (
                    <div className="mobile-dashboard">
                        <div className="mobile-header">
                            <div className="mobile-header-top">
                                <div className="mobile-brand">
                                    <span>GE</span> Gestión
                                </div>
                                <NotificationBell />
                            </div>
                            <div className="mobile-user-welcome">
                                <p>Bienvenido,</p>
                                <h2>{username || 'Usuario'}</h2>
                            </div>
                        </div>

                        <div className="mobile-section">
                            <div className="mobile-stats-header">
                                <h3 className="section-title">Resumen de Gestión</h3>
                                <select
                                    className="mobile-period-select"
                                    value={progressPeriod}
                                    onChange={(e) => setProgressPeriod(e.target.value)}
                                >
                                    <option value="month">Este Mes</option>
                                    <option value="quarter">Trimestre</option>
                                    <option value="year">Año</option>
                                </select>
                            </div>

                            <div className="mobile-stats-grid">
                                <div className="mobile-stat-card">
                                    <div className="stat-header">
                                        <h4>Mantenimientos</h4>
                                        <span className="stat-percentage">{getMaintenanceStats(maintenanceData, progressPeriod).percentage}%</span>
                                    </div>
                                    <div className="mobile-progress-bar">
                                        <div
                                            className="mobile-progress-fill maintenance"
                                            style={{ width: `${getMaintenanceStats(maintenanceData, progressPeriod).percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="stat-footer">
                                        <span>{getMaintenanceStats(maintenanceData, progressPeriod).completed} / {getMaintenanceStats(maintenanceData, progressPeriod).total} equipos</span>
                                    </div>
                                </div>

                                <div className="mobile-stat-card">
                                    <div className="stat-header">
                                        <h4>Backups</h4>
                                        <span className="stat-percentage">{getBackupsStats(backupsData, progressPeriod).percentage}%</span>
                                    </div>
                                    <div className="mobile-progress-bar">
                                        <div
                                            className="mobile-progress-fill backups"
                                            style={{ width: `${getBackupsStats(backupsData, progressPeriod).percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="stat-footer">
                                        <span>{getBackupsStats(backupsData, progressPeriod).completed} / {getBackupsStats(backupsData, progressPeriod).total} exitosos</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mobile-section">
                            <h3 className="section-title">Accesos Rápidos</h3>
                            <div className="mobile-menu-grid">
                                <button className="mobile-menu-item" onClick={() => setCurrentView('agregarEquipo')}>
                                    <span className="icon"><FaLaptop /></span>
                                    <span>Nuevo Equipo</span>
                                </button>
                                <button className="mobile-menu-item" onClick={() => setCurrentView('mantenimiento')}>
                                    <span className="icon"><FaTools /></span>
                                    <span>Mantenimiento</span>
                                </button>
                                <button className="mobile-menu-item" onClick={() => setCurrentView('historial')}>
                                    <span className="icon"><FaHistory /></span>
                                    <span>Historial</span>
                                </button>
                                <button className="mobile-menu-item" onClick={() => setCurrentView('licenciamiento')}>
                                    <span className="icon"><FaFileAlt /></span>
                                    <span>Licencias</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'menu':
                return (
                    <div className="mobile-menu-overlay">
                        <div className="mobile-menu-header">
                            <div className="mobile-avatar">
                                <FaUserCircle />
                            </div>
                            <div className="mobile-user-info">
                                <h3>{username}</h3>
                                <p>Administrador</p>
                            </div>
                        </div>

                        <h4 className="menu-group-title">Todas las aplicaciones</h4>
                        <div className="mobile-menu-grid">
                            <button className="mobile-menu-item" onClick={() => setCurrentView('copias')}>
                                <span className="icon"><FaDatabase /></span>
                                <span>Backups</span>
                            </button>
                            <button className="mobile-menu-item" onClick={() => setCurrentView('impresoras')}>
                                <span className="icon"><FaPrint /></span>
                                <span>Impresoras</span>
                            </button>
                            <button className="mobile-menu-item" onClick={() => setCurrentView('licenciamiento')}>
                                <span className="icon"><FaShieldAlt /></span>
                                <span>Licencias</span>
                            </button>
                        </div>

                        <button className="mobile-logout-btn" onClick={onLogout}>
                            <FaSignOutAlt /> Cerrar Sesión
                        </button>
                    </div>
                );
            case 'mantenimiento':
                return <div style={{ paddingTop: '20px' }}><MaintenancePage /></div>;
            case 'agregarEquipo':
                return <div style={{ paddingTop: '20px' }}><AgregarEquipoPage onEquipoAgregado={() => setCurrentView('dashboard')} /></div>;
            case 'historial':
                return <div style={{ paddingTop: '20px' }}><HistorialEquiposPage /></div>;
            case 'licenciamiento':
                return <div style={{ paddingTop: '20px' }}><LicenciamientoPage /></div>;
            case 'copias':
                return <div style={{ paddingTop: '20px' }}><CopiasPage /></div>;
            case 'impresoras':
                return <div style={{ paddingTop: '20px' }}><ImpresorasPage /></div>;
            default:
                return <div>Vista no encontrada</div>;
        }
    };

    return (
        <div className="mobile-layout">
            {renderContent()}
            <MobileNavigation currentView={currentView} onViewChange={setCurrentView} />
            <NotificationPanel />
        </div>
    );
};

export default MobileLayout;
