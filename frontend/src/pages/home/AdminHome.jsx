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
            <aside className="sidebar">
                <div className="sidebar-brand">AD<span>MIN</span></div>
                <nav className="side-nav">
                    {[
                        { id: 'dashboard', icon: <FaLaptop />, label: 'DASHBOARD' },
                        { id: 'userManagement', icon: <FaUsers />, label: 'USUARIOS' },
                        { id: 'mantenimiento', icon: <FaTools />, label: 'MANTENIMIENTO' },
                        { id: 'historialEquipos', icon: <FaHistory />, label: 'HISTORIAL' },
                        { id: 'licenciamiento', icon: <FaFileAlt />, label: 'LICENCIAMIENTO' },
                        { id: 'copias', icon: <FaDatabase />, label: 'COPIAS SEGURIDAD' },
                        { id: 'impresoras', icon: <FaPrint />, label: 'IMPRESORAS' },
                        { id: 'agregarEquipo', icon: <FaPlus />, label: 'AGREGAR EQUIPO' }
                    ].map(item => (
                        <button key={item.id} className={`nav-btn ${currentAdminView === item.id ? 'active' : ''}`} onClick={() => setCurrentAdminView(item.id)}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="main-area transition-all">
                <header className="topbar animate-in">
                    <div className="logo-row">
                        <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="Menu"><FaBars /></button>
                        <img src={logo} alt="Logo" className="topbar-logo" />
                        <div className="org">ADMINISTRACIÓN<br /><span>EQUIPOS</span></div>
                    </div>
                    <div className="top-actions">
                        <div className="topbar-time" style={{fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)'}}>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                        <NotificationBell />
                        <button className="icon-btn" title="Cerrar sesión" onClick={handleLogout}><FaSignOutAlt /></button>
                    </div>
                </header>

                <div className="animate-in" style={{ animationDelay: '0.1s' }}>
                    {currentAdminView === 'dashboard' && (
                        <>
                            <section className="dashboard-grid-layout">
                                <div className="hero-left hover-lift">
                                    <div className="hero-greeting">
                                        <h2>BIENVENIDO,<br /><span style={{color: 'var(--accent)'}}>ADMIN</span></h2>
                                        <p>Centro de control para la infraestructura técnica.</p>
                                        <div className="quick-actions">
                                            <button className="action-btn transition-all" onClick={() => setCurrentAdminView('userManagement')}>USUARIOS</button>
                                            <button className="action-btn transition-all" onClick={() => setCurrentAdminView('mantenimiento')}>MANTENIMIENTO</button>
                                            <button className="action-btn transition-all" onClick={() => setCurrentAdminView('licenciamiento')}>LICENCIAS</button>
                                            <button className="action-btn transition-all" onClick={() => setCurrentAdminView('agregarEquipo')}>+ EQUIPO</button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                                    <div className="progress-card" style={{background:'#0f172a', color:'white'}}>
                                        <span style={{fontSize:'12px', fontWeight:700, opacity:0.6}}>FECHA ACTUAL</span>
                                        <div style={{fontSize:'28px', fontWeight:800, color:'var(--accent)'}}>{now.getDate()}</div>
                                        <div style={{fontSize:'14px', fontWeight:700}}>{now.toLocaleDateString([], { month: 'long', year: 'numeric' }).toUpperCase()}</div>
                                    </div>
                                    <RemindersWidget />
                                </div>
                            </section>

                            <section className="progress-section">
                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', alignItems:'center'}}>
                                    <h3 style={{margin:0, fontSize:'14px', fontWeight: 800, letterSpacing: '1px'}}>ESTADÍSTICAS DEL PERIODO</h3>
                                    <select value={progressPeriod} onChange={(e) => setProgressPeriod(e.target.value)} style={{padding:'5px 10px', fontSize:'12px', fontWeight: 700, borderRadius: '8px'}}>
                                        <option value="month">ESTE MES</option>
                                        <option value="quarter">TRIMESTRE</option>
                                        <option value="year">AÑO COMPLETO</option>
                                    </select>
                                </div>
                                <div className="progress-panels">
                                    <div className="progress-card hover-lift">
                                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:800, marginBottom: '10px'}}>
                                            <span style={{fontSize:'13px'}}>MANTENIMIENTOS</span>
                                            <span style={{color:'var(--primary)'}}>{mStats.percentage}%</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div className="progress-bar-fill maintenance" style={{ width: `${mStats.percentage}%` }}></div>
                                        </div>
                                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', fontWeight: 600, color:'var(--text-muted)'}}>
                                            <span>EQUIPOS GESTIONADOS</span>
                                            <span>{mStats.completed} / {mStats.total}</span>
                                        </div>
                                    </div>
                                    <div className="progress-card hover-lift">
                                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:800, marginBottom: '10px'}}>
                                            <span style={{fontSize:'13px'}}>COPIAS SEGURIDAD</span>
                                            <span style={{color:'#10b981'}}>{bStats.percentage}%</span>
                                        </div>
                                        <div className="progress-bar-container">
                                            <div className="progress-bar-fill backups" style={{ width: `${bStats.percentage}%` }}></div>
                                        </div>
                                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', fontWeight: 600, color:'var(--text-muted)'}}>
                                            <span>RESPALDOS VERIFICADOS</span>
                                            <span>{bStats.completed} / {bStats.total}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {currentAdminView === 'userManagement' && (
                        <div className="users-list">
                            <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                                <div>
                                    <h2 style={{margin:0, fontSize:'20px'}}>Gestión de Usuarios</h2>
                                    <p style={{margin:0, fontSize:'13px', color:'var(--text-muted)'}}>Control de acceso y perfiles de sistema.</p>
                                </div>
                                <button className="btn primary transition-all" onClick={() => { setEditingUser(null); setFormData({ nombre: '', correo: '', usuario: '', password: '', confirmPassword: '' }); setIsModalOpen(true); }}>
                                    + Nuevo Usuario
                                </button>
                            </header>
                            {success && <div className="form-message success">{success}</div>}
                            <div className="table-responsive">
                                <table>
                                    <thead><tr><th>ID</th><th>Nombre</th><th>Usuario</th><th style={{textAlign:'right'}}>Acciones</th></tr></thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.id}</td>
                                                <td style={{fontWeight:600}}>{u.nombre}</td>
                                                <td><span style={{background:'var(--bg-app)', padding:'4px 8px', borderRadius:'6px'}}>{u.usuario}</span></td>
                                                <td style={{textAlign:'right'}}>
                                                    <button className="icon-btn" style={{display:'inline-flex', marginRight:'8px'}} onClick={() => { setEditingUser(u); setFormData({ nombre: u.nombre, correo: u.correo, usuario: u.usuario, password: u.password || '', confirmPassword: u.password || '' }); setIsModalOpen(true); }}><FaEye /></button>
                                                    <button className="icon-btn" style={{display:'inline-flex', color:'#ef4444'}} onClick={() => handleDeleteUser(u.id, u.nombre)}><FaSignOutAlt /></button>
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
                <div className="modal-backdrop">
                    <div className="modal-content animate-in">
                        <h2 style={{margin:'0 0 20px 0'}}>{editingUser ? 'Editar' : 'Nuevo'} Usuario</h2>
                        <form onSubmit={handleModalSubmit}>
                            {error && <div className="form-message error">{error}</div>}
                            <div className="form-grid">
                                <label>Nombre completo <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required /></label>
                                <label>Email <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} required /></label>
                                <label>Nombre de usuario <input type="text" name="usuario" value={formData.usuario} onChange={handleInputChange} required /></label>
                                <label>Contraseña 
                                    <div className="input-with-icon">
                                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required={!editingUser} />
                                        <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
                                    </div>
                                </label>
                                <label>Confirmar contraseña 
                                    <div className="input-with-icon">
                                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required={!editingUser} />
                                        <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
                                    </div>
                                </label>
                            </div>
                            <div className="form-actions" style={{display:'flex', gap:'10px', marginTop:'20px'}}>
                                <button type="submit" className="btn primary" style={{flex:1}}>Guardar Cambios</button>
                                <button type="button" className="btn" style={{background:'var(--border)', color:'var(--text-main)', border:'none'}} onClick={() => setIsModalOpen(false)}>Cerrar</button>
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