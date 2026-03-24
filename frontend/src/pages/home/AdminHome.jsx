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
import RemindersWidget from './RemindersWidget.jsx';

// Importar nuevos componentes de notificaciones
import NotificationBell from '../../components/notifications/NotificationBell.jsx';
import NotificationPanel from '../../components/notifications/NotificationPanel.jsx';

// Componente principal que decide qué renderizar
function AdminHome({ onBack, username, token }) {
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

    return <DesktopAdminHome onBack={onBack} username={username} token={token} />;
}

function DesktopAdminHome({ onBack, username }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '', correo: '', usuario: '', password: '', confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [now, setNow] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentAdminView, setCurrentAdminView] = useState('dashboard');

    const [maintenanceData, setMaintenanceData] = useState([]);
    const [backupsData, setBackupsData] = useState([]);
    const [progressPeriod, setProgressPeriod] = useState('month');

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.allSettled([
                fetchUsers(),
                fetchMaintenanceData(),
                fetchBackupsData()
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const resp = await api.get('/usuarios');
            setUsers(resp.data.body || []);
        } catch (err) { setError('Error al cargar usuarios'); }
    };

    const fetchMaintenanceData = async () => {
        try {
            const resp = await api.get('/mantenimiento');
            setMaintenanceData(resp.data.body || []);
        } catch (err) { /* silent */ }
    };

    const fetchBackupsData = async () => {
        try {
            const resp = await api.get('/CopiasDeSeguridad');
            setBackupsData(resp.data.body || []);
        } catch (err) { /* silent */ }
    };

    useEffect(() => {
        if (currentAdminView === 'dashboard') {
            fetchMaintenanceData();
            fetchBackupsData();
        }
    }, [currentAdminView]);

    const getMaintenanceStats = (data, period) => {
        if (!data.length) return { percentage: 0, completed: 0, total: 0 };
        const now = new Date();
        let start, end;
        if (period === 'month') { start = new Date(now.getFullYear(), now.getMonth(), 1); end = new Date(now.getFullYear(), now.getMonth() + 1, 0); }
        else if (period === 'quarter') { start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1); end = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0); }
        else { start = new Date(now.getFullYear(), 0, 1); end = new Date(now.getFullYear(), 11, 31); }

        const filtered = data.filter(i => {
            const d = new Date(i.fecha_actual_de_mantenimiento || i.fecha_de_ejecucion || i.fecha_de_elaboracion);
            return d >= start && d <= end;
        });

        const completed = filtered.filter(i => i.estado === 'Terminado').length;
        const total = filtered.length;
        return { percentage: total ? Math.round((completed / total) * 100) : 0, completed, total };
    };

    const getBackupsStats = (data, period) => {
        if (!data.length) return { percentage: 0, completed: 0, total: 0 };
        const now = new Date();
        let start, end;
        if (period === 'month') { start = new Date(now.getFullYear(), now.getMonth(), 1); end = new Date(now.getFullYear(), now.getMonth() + 1, 0); }
        else if (period === 'quarter') { start = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1); end = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0); }
        else { start = new Date(now.getFullYear(), 0, 1); end = new Date(now.getFullYear(), 11, 31); }

        const filtered = data.filter(i => {
            const d = new Date(i.fecha);
            return d >= start && d <= end;
        });

        const completed = filtered.filter(i => i.estado_copia === 'Exitosa').length;
        const total = filtered.length;
        return { percentage: total ? Math.round((completed / total) * 100) : 0, completed, total };
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return setError('Las contraseñas no coinciden.');
        try {
            editingUser ? await api.put(`/usuarios/${editingUser.id}`, formData) : await api.post('/usuarios', formData);
            setSuccess(`Usuario ${editingUser ? 'actualizado' : 'creado'} con éxito.`);
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) { setError(err.response?.data?.body || 'Error al guardar.'); }
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
        onBack && onBack();
    };

    const mStats = getMaintenanceStats(maintenanceData, progressPeriod);
    const bStats = getBackupsStats(backupsData, progressPeriod);

    return (
        <div className={`home-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <aside className="sidebar glass">
                <div className="sidebar-header">
                    <div className="sidebar-brand-container">
                        <div className="sidebar-brand-text">
                            GESTION<span>ADMIN</span>
                        </div>
                    </div>
                </div>
                
                <nav className="side-nav">
                    {[
                        { id: 'dashboard', icon: <FaLaptop />, label: 'Dashboard' },
                        { id: 'userManagement', icon: <FaUsers />, label: 'Usuarios' },
                        { id: 'mantenimiento', icon: <FaTools />, label: 'Mantenimiento' },
                        { id: 'historialEquipos', icon: <FaHistory />, label: 'Historial' },
                        { id: 'licenciamiento', icon: <FaFileAlt />, label: 'Licencias' },
                        { id: 'copias', icon: <FaDatabase />, label: 'Backups' },
                        { id: 'impresoras', icon: <FaPrint />, label: 'Impresoras' },
                        { id: 'agregarEquipo', icon: <FaPlus />, label: 'Nuevo Equipo' }
                    ].map(item => (
                        <button 
                            key={item.id} 
                            className={`nav-btn ${currentAdminView === item.id ? 'active' : ''}`} 
                            onClick={() => setCurrentAdminView(item.id)}
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
                            {currentAdminView === 'dashboard' ? 'Resumen Principal' : currentAdminView.toUpperCase()}
                        </div>
                    </div>
                    
                    <div className="topbar-right">
                        <div className="topbar-brand-mark">
                            <img src={logo} alt="Corp Logo" className="topbar-logo-img" />
                        </div>
                        <div className="topbar-clock premium">
                            <div className="clock-container">
                                <div className="clock-time">{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
                                <div className="clock-date">{now.toLocaleDateString([], { weekday: 'short' }).toUpperCase()}</div>
                            </div>
                            <div className="clock-glow"></div>
                        </div>
                        <NotificationBell />
                        <div className="user-profile-mini">
                            <div className="user-info">
                                <span className="user-name">{username || 'Admin'}</span>
                                <span className="user-role">Super Administrador</span>
                            </div>
                            <div className="user-avatar user-type-normal">
                                {username?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <button className="profile-logout-btn" title="Cerrar Sesión" onClick={handleLogout}>
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="content-container animate-fade">
                    {currentAdminView === 'dashboard' && (
                        <div className="dashboard-view">
                            <section className="welcome-banner">
                                <div className="banner-content">
                                    <h1>¡Hola, {username}!</h1>
                                    <p>Aquí tienes el estado actual de tu infraestructura y equipos gestionados.</p>
                                    <div className="banner-actions">
                                        <button className="btn-banner" onClick={() => setCurrentAdminView('agregarEquipo')}>+ Agregar Equipo</button>
                                        <button className="btn-banner secondary" onClick={() => setCurrentAdminView('mantenimiento')}>Ver Mantenimientos</button>
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
                                        <h3>Mantenimientos</h3>
                                        <span className={`stat-badge ${mStats.percentage > 70 ? 'success' : 'warning'}`}>{mStats.percentage}%</span>
                                    </div>
                                    <div className="stat-body">
                                        <div className="progress-track">
                                            <div className="progress-fill maintenance" style={{ width: `${mStats.percentage}%` }}></div>
                                        </div>
                                        <div className="stat-footer">
                                            <span>{mStats.completed} completados de {mStats.total}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card glass hover-lift">
                                    <div className="stat-header">
                                        <h3>Copias de Seguridad</h3>
                                        <span className={`stat-badge ${bStats.percentage > 90 ? 'success' : 'warning'}`}>{bStats.percentage}%</span>
                                    </div>
                                    <div className="stat-body">
                                        <div className="progress-track">
                                            <div className="progress-fill backups" style={{ width: `${bStats.percentage}%` }}></div>
                                        </div>
                                        <div className="stat-footer">
                                            <span>{bStats.completed} exitosas de {bStats.total}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="stat-card date-stat glass">
                                    <div className="calendar-day">{now.getDate()}</div>
                                    <div className="calendar-meta">
                                        <span className="month">{now.toLocaleDateString([], { month: 'long' }).toUpperCase()}</span>
                                        <span className="year">{now.getFullYear()}</span>
                                    </div>
                                </div>
                            </section>

                            <section className="dashboard-lower">
                                <RemindersWidget />
                            </section>
                        </div>
                    )}

                    {currentAdminView === 'userManagement' && (
                        <div className="view-card card-premium">
                            <header className="view-card-header">
                                <div className="header-info">
                                    <h2>Gestión de Usuarios</h2>
                                    <p>Control de acceso y perfiles del sistema administrativo.</p>
                                </div>
                                <button className="btn-primary" onClick={() => { setEditingUser(null); setFormData({ nombre: '', correo: '', usuario: '', password: '', confirmPassword: '' }); setIsModalOpen(true); }}>
                                    <FaPlus /> Nuevo Usuario
                                </button>
                            </header>
                            
                            {success && (
                                <div className="alert success animate-slide-up">
                                    <FaCheck /> {success}
                                </div>
                            )}

                            <div className="table-wrapper">
                                <table className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre Completo</th>
                                            <th>Usuario</th>
                                            <th>Estado</th>
                                            <th className="actions-col">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id}>
                                                <td><span className="id-pill">#{u.id}</span></td>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-circle">{u.nombre.charAt(0)}</div>
                                                        <span className="user-name-text">{u.nombre}</span>
                                                    </div>
                                                </td>
                                                <td><code className="user-tag">@{u.usuario}</code></td>
                                                <td><span className="status-pill active">Activo</span></td>
                                                <td className="actions-col">
                                                    <div className="action-btns">
                                                        <button className="action-btn-mini edit" title="Editar" onClick={() => { setEditingUser(u); setFormData({ nombre: u.nombre, correo: u.correo, usuario: u.usuario, password: u.password || '', confirmPassword: u.password || '' }); setIsModalOpen(true); }}><FaEye /></button>
                                                        <button className="action-btn-mini delete" title="Eliminar" onClick={() => handleDeleteUser(u.id, u.nombre)}><FaSignOutAlt /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {currentAdminView === 'mantenimiento' && <MaintenancePage />}
                    {currentAdminView === 'historialEquipos' && <HistorialEquiposPage />}
                    {currentAdminView === 'licenciamiento' && <LicenciamientoPage />}
                    {currentAdminView === 'copias' && <CopiasPage />}
                    {currentAdminView === 'impresoras' && <ImpresorasPage />}
                    {currentAdminView === 'agregarEquipo' && <AgregarEquipoPage onEquipoAgregado={() => setCurrentAdminView('dashboard')} />}
                </div>
            </main>

            {isModalOpen && (
                <div className="modal-overlay glass">
                    <div className="modal-container card-premium animate-slide-up">
                        <header className="modal-header">
                            <h2>{editingUser ? 'Editar Perfil de Usuario' : 'Crear Nuevo Usuario'}</h2>
                            <button className="close-modal" onClick={() => setIsModalOpen(false)}>×</button>
                        </header>
                        <form onSubmit={handleModalSubmit} className="modal-form">
                            {error && <div className="alert error">{error}</div>}
                            <div className="form-grid-modern">
                                <div className="input-group">
                                    <label>Nombre Completo</label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Nombre Apellido" />
                                </div>
                                <div className="input-group">
                                    <label>Email Institucional</label>
                                    <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} required placeholder="usuario@institucion.com" />
                                </div>
                                <div className="input-group full-width">
                                    <label>Nombre de Usuario</label>
                                    <input type="text" name="usuario" value={formData.usuario} onChange={handleInputChange} required placeholder="ej. jdoe01" />
                                </div>
                                <div className="input-group">
                                    <label>Contraseña</label>
                                    <div className="input-icon-wrap">
                                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required={!editingUser} placeholder="••••••••" />
                                        <button type="button" className="icon-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Confirmar Contraseña</label>
                                    <div className="input-icon-wrap">
                                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required={!editingUser} placeholder="••••••••" />
                                        <button type="button" className="icon-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
                                    </div>
                                </div>
                            </div>
                            <footer className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary">Guardar Cambios</button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
            <NotificationPanel />
        </div>
    );
}


export default AdminHome;