import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import './AdminHome.css';
import './home.css';
import { FaBars, FaSignOutAlt, FaUsers, FaTools, FaFileAlt, FaLaptop, FaPlus, FaEye, FaEyeSlash, FaCheck, FaDatabase, FaPrint, FaHistory } from 'react-icons/fa';
import logo from '../../assets/LOGO_INSTITUCIONAL.jpg';

// Importar componentes móviles
import useIsMobile from '../../hooks/useIsMobile.js';
import MobileLayout from '../../components/mobile/MobileLayout.jsx';

// Importar las páginas que se van a renderizar
import MaintenancePage from '../mantenimiento/MaintenancePage.jsx';
import LicenciamientoPage from '../licenciamiento/LicenciamientoPage.jsx';
import CopiasPage from '../copiasDeSeguridad/CopiasPage.jsx';
import ImpresorasPage from '../impresoras/ImpresorasPage.jsx';
import HistorialEquiposPage from '../historialEquipos/HistorialEquiposPage.jsx';
import AgregarEquipoPage from './AgregarEquipoPage.jsx';

// Importar nuevos componentes de notificaciones
import NotificationBell from '../../components/notifications/NotificationBell.jsx';
import NotificationPanel from '../../components/notifications/NotificationPanel.jsx';

// Componente principal que decide qué renderizar
function AdminHome({ onBack, username }) {
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

    return <DesktopAdminHome onBack={onBack} username={username} />;
}

// Lógica original de escritorio encapsulada
function DesktopAdminHome({ onBack, username }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Estado para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        usuario: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Estados para el layout
    const [now, setNow] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentAdminView, setCurrentAdminView] = useState('dashboard');

    // Estados para datos de progreso
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [backupsData, setBackupsData] = useState([]);
    const [progressPeriod, setProgressPeriod] = useState('month');

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchMaintenanceData();
        fetchBackupsData();
    }, []);

    // Refrescar datos al volver al dashboard para asegurar sincronización
    useEffect(() => {
        if (currentAdminView === 'dashboard') {
            fetchMaintenanceData();
            fetchBackupsData();
        }
    }, [currentAdminView]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/usuarios');
            setUsers(response.data.body || []);
        } catch (err) {
            console.error("Error al obtener usuarios:", err);
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    };


    const fetchMaintenanceData = async () => {
        try {
            const response = await api.get('/mantenimiento');
            setMaintenanceData(response.data.body || []);
        } catch (err) { /* silent */ }
    };

    const fetchBackupsData = async () => {
        try {
            const response = await api.get('/CopiasDeSeguridad');
            setBackupsData(response.data.body || []);
        } catch (err) { /* silent */ }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) { setError('Las contraseñas no coinciden.'); return; }
        try {
            if (editingUser) {
                await api.put(`/usuarios/${editingUser.id}`, formData);
                setSuccess(`Usuario actualizado con éxito.`);
            } else {
                await api.post('/usuarios', formData);
                setSuccess(`Usuario creado con éxito.`);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.body || 'Error al guardar.');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`¿Eliminar al usuario "${userName}"?`)) {
            try {
                await api.delete(`/usuarios/${userId}`);
                setSuccess(`Usuario eliminado.`);
                fetchUsers();
            } catch (err) { setError('No se pudo eliminar.'); }
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        if (onBack) onBack();
    };

    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const day = now.toLocaleDateString([], { day: '2-digit' });
    const month = now.toLocaleDateString([], { month: 'long' }).toUpperCase();
    const year = now.getFullYear();

    return (
        <div className={`home-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <aside className="sidebar">
                <div className="sidebar-brand">AD<span>MIN</span></div>
                <nav className="side-nav">
                    <button className={currentAdminView === 'dashboard' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentAdminView('dashboard')}><FaLaptop /> DASHBOARD</button>
                    <button className={currentAdminView === 'userManagement' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentAdminView('userManagement')}><FaUsers /> USUARIOS</button>
                    <button className={currentAdminView === 'mantenimiento' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentAdminView('mantenimiento')}><FaTools /> MANTENIMIENTO</button>
                    <button className={currentAdminView === 'historialEquipos' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentAdminView('historialEquipos')}><FaHistory /> HISTORIAL</button>
                    <button className={currentAdminView === 'licenciamiento' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentAdminView('licenciamiento')}><FaFileAlt /> LICENCIAS</button>
                    <button className={currentAdminView === 'copias' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentAdminView('copias')}><FaDatabase /> COPIAS</button>
                    <button className={currentAdminView === 'impresoras' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentAdminView('impresoras')}><FaPrint /> IMPRESORAS</button>
                    <button className={currentAdminView === 'agregarEquipo' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentAdminView('agregarEquipo')}><FaPlus /> + EQUIPO</button>
                </nav>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div className="logo-row">
                        <button className="hamburger" onClick={() => setSidebarOpen(s => !s)} aria-label="Toggle menu"><FaBars /></button>
                        <img src={logo} alt="Logo Institucional" className="topbar-logo" />
                        <div className="org">ADMINISTRACIÓN<br /><span>EQUIPOS</span></div>
                    </div>
                    <div className="topbar-time">{timeStr}</div>
                    <div className="top-actions">
                        <NotificationBell />
                        <button className="icon-btn" title="Cerrar sesión" onClick={handleLogout}><FaSignOutAlt /></button>
                    </div>
                </header>

                {currentAdminView === 'dashboard' && (
                    <>
                        <section className="hero">
                            <div className="hero-left big-card">
                                <div className="hero-content-flex">
                                    <div className="hero-greeting">
                                        <h2>BIENVENIDO,<br /><span className="username">ADMIN</span></h2>
                                        <p>Centro de control para la infraestructura técnica.</p>
                                    </div>
                                    <div className="quick-actions-dashboard">
                                        <div className="quick-actions">
                                            <button className="action-btn" onClick={() => setCurrentAdminView('userManagement')}><FaUsers /> Usuarios</button>
                                            <button className="action-btn" onClick={() => setCurrentAdminView('mantenimiento')}><FaTools /> Mantenimiento</button>
                                            <button className="action-btn" onClick={() => setCurrentAdminView('licenciamiento')}><FaFileAlt /> Licencias</button>
                                            <button className="action-btn" onClick={() => setCurrentAdminView('agregarEquipo')}><FaPlus /> + Equipo</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <aside className="hero-right">
                                <div className="date-card">
                                    <div className="day">{day}</div>
                                    <div className="month">{month}</div>
                                    <div className="year">{year}</div>
                                </div>
                            </aside>
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

                {currentAdminView === 'userManagement' && (
                    <div className="admin-dashboard-content">
                        <header className="page-header">
                            <div>
                                <h1>Gestión de Usuarios</h1>
                                <p>Control de acceso y perfiles de sistema.</p>
                            </div>
                        </header>
                        <div className="toolbar">
                            <button className="btn primary" onClick={() => { setEditingUser(null); setFormData({ nombre: '', correo: '', usuario: '', password: '', confirmPassword: '' }); setIsModalOpen(true); }}>
                                <FaPlus /> Nuevo Usuario
                            </button>
                        </div>
                        {success && <div className="form-message success">{success}</div>}
                        <div className="users-list">
                            <div className="table-responsive">
                                <table>
                                    <thead><tr><th>ID</th><th>Nombre</th><th>Usuario</th><th>Acciones</th></tr></thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id}><td>{u.id}</td><td>{u.nombre}</td><td>{u.usuario}</td><td>
                                                <button className="action-btn-sm edit" onClick={() => { setEditingUser(u); setFormData({ nombre: u.nombre, correo: u.correo, usuario: u.usuario, password: '', confirmPassword: '' }); setIsModalOpen(true); }}>Editar</button>
                                                <button className="action-btn-sm delete" onClick={() => handleDeleteUser(u.id, u.nombre)}>Borrar</button>
                                            </td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {currentAdminView === 'mantenimiento' && <MaintenancePage />}
                {currentAdminView === 'historialEquipos' && <HistorialEquiposPage />}
                {currentAdminView === 'licenciamiento' && <LicenciamientoPage />}
                {currentAdminView === 'copias' && <CopiasPage />}
                {currentAdminView === 'impresoras' && <ImpresorasPage />}
                {currentAdminView === 'agregarEquipo' && <AgregarEquipoPage onEquipoAgregado={() => setCurrentAdminView('dashboard')} />}
            </main>

            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h2>{editingUser ? 'Editar' : 'Nuevo'} Usuario</h2>
                        <form onSubmit={handleModalSubmit}>
                            {error && <div className="form-message error">{error}</div>}
                            <div className="form-grid">
                                <label>Nombre<input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required /></label>
                                <label>Correo<input type="email" name="correo" value={formData.correo} onChange={handleInputChange} required /></label>
                                <label>Usuario<input type="text" name="usuario" value={formData.usuario} onChange={handleInputChange} required /></label>
                                <label>Contraseña<input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required={!editingUser} /></label>
                                <label>Confirmar<input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required={!editingUser} /></label>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="action-btn save">Guardar</button>
                                <button type="button" className="action-btn cancel" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <NotificationPanel />
        </div>
    );
}

export default AdminHome;