import React, { useState } from 'react';
import MobileNavigation from './MobileNavigation';
import './MobileNavigation.css';
import { FaUserCircle, FaSignOutAlt, FaBell, FaLaptop, FaFileAlt, FaDatabase, FaPrint, FaShieldAlt, FaTools, FaHistory } from 'react-icons/fa';

// Importar las páginas existentes
import MaintenancePage from '../../pages/mantenimiento/MaintenancePage.jsx';
import LicenciamientoPage from '../../pages/licenciamiento/LicenciamientoPage.jsx';
import CopiasPage from '../../pages/copiasDeSeguridad/CopiasPage.jsx';
import ImpresorasPage from '../../pages/impresoras/ImpresorasPage.jsx';
import AgregarEquipoPage from '../../pages/home/AgregarEquipoPage.jsx';
import HistorialEquiposPage from '../../pages/historialEquipos/HistorialEquiposPage.jsx';

const MobileLayout = ({ username, onLogout }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [showNotifications, setShowNotifications] = useState(false);

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
                                <button className="icon-btn notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
                                    <FaBell />
                                </button>
                            </div>
                            <div className="mobile-user-welcome">
                                <p>Bienvenido,</p>
                                <h2>{username || 'Usuario'}</h2>
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
        </div>
    );
};

export default MobileLayout;
