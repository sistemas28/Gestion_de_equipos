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
import { FaBars, FaBell, FaUser, FaCog, FaSignOutAlt, FaCheck, FaTools, FaFileAlt, FaDatabase, FaPlus, FaTimes } from 'react-icons/fa';

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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserSettings, setShowUserSettings] = useState(false);
    const [showAppSettings, setShowAppSettings] = useState(false);
    const notificationsRef = useRef(null);

    const [currentView, setCurrentView] = useState('dashboard');

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    // recordatorios desde backend
    const [reminders, setReminders] = useState([]);
    const [loadingReminders, setLoadingReminders] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formTitle, setFormTitle] = useState('');
    const [formDateTime, setFormDateTime] = useState('');
    const [editingId, setEditingId] = useState(null);

    async function fetchReminders() {
        setLoadingReminders(true);
        try {
            const remindersPromise = api.get('/recordatorios');
            const maintenancePromise = api.get('/mantenimiento');

            const [remindersResp, maintenanceResp] = await Promise.all([remindersPromise, maintenancePromise]);

            const manualReminders = remindersResp.data.body || [];

            const maintenanceReminders = (maintenanceResp.data.body || [])
                .filter(item => item.fecha_actual_de_mantenimiento)
                .map(item => ({
                    id: `mantenimiento-${item.id}`,
                    title: `Próximo mantenimiento: ${item.usuario} (${item.tipo})`,
                    date: item.fecha_actual_de_mantenimiento,
                    realizado: new Date(item.fecha_actual_de_mantenimiento) < new Date(item.fecha_ultimo_mantenimiento),
                    source: 'mantenimiento'
                }));

            setReminders([...manualReminders, ...maintenanceReminders]);

        } catch (err) {
            console.error('Error al obtener recordatorios y mantenimientos:', err);
        } finally {
            setLoadingReminders(false);
        }
    }

    useEffect(() => {
        fetchReminders();
    }, []);

    function isoToLocalInput(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const local = new Date(d - tzOffset).toISOString().slice(0, 16);
        return local;
    }

    async function handleEdit(rem) {
        setEditingId(rem.id);
        setFormTitle(rem.title || '');
        setFormDateTime(rem.date ? isoToLocalInput(rem.date) : '');
        setShowForm(true);
    }

    async function handleToggleRealizado(rem) {
        if (rem.source === 'mantenimiento') {
            alert('Este recordatorio se gestiona desde la sección de Mantenimiento.');
            return;
        }
        try {
            const newVal = rem.realizado ? 0 : 1;
            await api.patch(`/recordatorios/${rem.id}/realizado`, { realizado: newVal });
            fetchReminders();
        } catch (err) {
            console.error('Error toggling realizado', err);
        }
    }

    async function handleDelete(rem) {
        if (rem.source === 'mantenimiento') {
            alert('Este recordatorio se gestiona desde la sección de Mantenimiento.');
            return;
        }
        if (!confirm('¿Eliminar recordatorio?')) return;
        try {
            await api.delete(`/recordatorios/${rem.id}`);
            fetchReminders();
        } catch (err) {
            console.error('Error deleting reminder', err);
        }
    }

    async function handleClearAllNotifications() {
        if (!confirm('¿Marcar todos los recordatorios manuales como realizados?')) return;
        try {
            const uncompletedManualReminders = reminders.filter(r => !r.realizado && !r.source);
            const promises = uncompletedManualReminders.map(rem =>
                api.patch(`/recordatorios/${rem.id}/realizado`, { realizado: 1 })
            );
            if (promises.length > 0) await Promise.all(promises);
            fetchReminders();
        } catch (err) {
            console.error('Error al limpiar los recordatorios', err);
        }
    }

    function getLatestReminder() {
        if (!reminders || reminders.length === 0) return null;
        const nowISO = now.toISOString();
        const past = reminders.filter(r => r.date && r.date <= nowISO).sort((a, b) => b.date.localeCompare(a.date));
        if (past.length) return past[0];
        const future = reminders.slice().filter(r => r.date).sort((a, b) => a.date.localeCompare(b.date));
        return future[0] || null;
    }

    const latest = getLatestReminder();

    const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const uncompletedReminders = reminders.filter(r => !r.realizado);

    const day = now.toLocaleDateString([], { day: '2-digit' });
    const month = now.toLocaleDateString([], { month: 'long' }).toUpperCase();
    const year = now.getFullYear();

    return (
        <div className={`home-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <aside className="sidebar">
                <div className="sidebar-top">
                    <div className="sidebar-brand">GESTION DE<br />EQUIPOS</div>
                    <nav className="side-nav">
                        <button className={currentView === 'dashboard' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('dashboard')}>DASHBOARD</button>
                        <button className={currentView === 'mantenimiento' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('mantenimiento')}>MANTENIMIENTO</button>
                        <button className={currentView === 'licenciamiento' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('licenciamiento')}>LICENCIAMIENTO</button>
                        <button className={currentView === 'copias' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('copias')}>COPIAS DE SEGURIDAD</button>
                        <button className={currentView === 'impresoras' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('impresoras')}>IMPRESORAS</button>
                        <button className={currentView === 'agregarEquipo' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('agregarEquipo')}>AGREGAR EQUIPO</button>
                        <button className={currentView === 'historial' ? 'nav-btn active' : 'nav-btn'} onClick={() => setCurrentView('historial')}>HISTORIAL EQUIPOS</button>
                    </nav>
                </div>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div className="logo-row">
                        <button className="hamburger" onClick={() => setSidebarOpen(s => !s)} aria-label="Toggle menu"><FaBars /></button>
                        <div className="logo-pill">GE</div>
                        <div className="org">GESTION DE<br />EQUIPOS</div>
                        <div className="topbar-time">{timeStr}</div>
                        <div className="logoNasakiwe"></div>
                    </div>
                    <div className="top-actions" >
                        <button className="icon-btn" onClick={() => setShowNotifications(s => !s)}>
                            <FaBell />
                            {uncompletedReminders.length > 0 && <span className="notification-badge">{uncompletedReminders.length}</span>}
                        </button>
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
                        <section className="hero">
                            <div className="hero-left card big-card">
                                <div className="hero-content-flex">
                                    <div className="hero-greeting">
                                        <h2>HOLA,<br /><span className="username">{username || '(USUARIO)'}</span></h2>
                                    </div>
                                    <div className="hero-reminders">
                                        <h4>RECORDATORIOS</h4>
                                        <div className="reminders-list card-inner">
                                            {latest ? (
                                                <div className="reminder-item">
                                                    <div className="reminder-title">{latest.title}</div>
                                                    <div className="reminder-date">{new Date(latest.date).toLocaleString([], { hour: 'numeric', minute: '2-digit', hour12: true, day: '2-digit', month: 'short' })}</div>
                                                </div>
                                            ) : (
                                                <div className="muted">No hay recordatorios</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="quick-actions-dashboard">
                                    <h4>Acciones rápidas</h4>
                                    <div className="quick-actions">
                                        <button className="action-btn" onClick={() => setCurrentView('mantenimiento')}>
                                            <span className="icon"><FaTools /></span> Mantenimiento
                                        </button>
                                        <button className="action-btn" onClick={() => setCurrentView('licenciamiento')}>
                                            <span className="icon"><FaFileAlt /></span> Licenciamiento
                                        </button>
                                        <button className="action-btn" onClick={() => setCurrentView('copias')}>
                                            <span className="icon"><FaDatabase /></span> Copias de Seguridad
                                        </button>
                                        <button className="action-btn" onClick={() => { setShowForm(s => !s); setEditingId(null); setFormTitle(''); setFormDateTime(''); }}>
                                            <span className="icon">{showForm ? <FaTimes /> : <FaPlus />}</span> {showForm ? 'Cancelar' : 'Crear recordatorio'}
                                        </button>
                                    </div>

                                    {showForm && (
                                        <form className="create-form" onSubmit={async (e) => {
                                            e.preventDefault();
                                            try {
                                                const payloadDate = formDateTime ? new Date(formDateTime).toISOString() : new Date().toISOString();
                                                if (editingId) {
                                                    await api.put(`/recordatorios/${editingId}`, { title: formTitle, date: payloadDate });
                                                } else {
                                                    await api.post('/recordatorios', { title: formTitle, date: payloadDate, realizado: 0 });
                                                }
                                                setShowForm(false);
                                                setFormTitle('');
                                                setFormDateTime('');
                                                setEditingId(null);
                                                fetchReminders();
                                            } catch (err) {
                                                console.error('Error saving reminder', err);
                                                alert('Error al guardar recordatorio');
                                            }
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                                                <input required placeholder="Título" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
                                                <input type="datetime-local" value={formDateTime} onChange={e => setFormDateTime(e.target.value)} />
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="action-btn" type="submit">Guardar</button>
                                                    <button className="action-btn" type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormTitle(''); setFormDateTime(''); }}>Cancelar</button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                            <aside className="hero-right">
                                <div className="date-card card">
                                    <div className="month">{month}</div>
                                    <div className="day">{day}</div>
                                    <div className="year">{year}</div>
                                </div>
                            </aside>
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

            {(sidebarOpen || showNotifications || showUserSettings || showAppSettings) && <div className="backdrop" onClick={() => { setSidebarOpen(false); setShowNotifications(false); setShowUserSettings(false); setShowAppSettings(false); }} />}

            {showNotifications && (
                <div className="notifications-modal" onClick={() => setShowNotifications(false)}>
                    <div className="notifications-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="notifications-header">
                            <div className="notifications-header-title">
                                <span className="icon"><FaBell /></span>
                                <h4>Notificaciones</h4>
                            </div>
                            <button className="link small" onClick={handleClearAllNotifications}>Limpiar todo</button>
                        </div>
                        <div className="notifications-list">
                            {uncompletedReminders.length > 0 ? (
                                uncompletedReminders.map(rem => (
                                    <div key={rem.id} className="notification-item">
                                        <div className="notification-content">
                                            <div className="notification-title">{rem.title}</div>
                                            <small className="muted">{rem.date ? new Date(rem.date).toLocaleString() : ''}</small>
                                            {rem.source === 'mantenimiento' && (
                                                <small className="notification-source">
                                                    <span onClick={(e) => { e.stopPropagation(); setShowNotifications(false); setCurrentView('mantenimiento'); }}>Ir a Mantenimiento</span>
                                                </small>
                                            )}
                                        </div>
                                        <button
                                            className="clear-notification-btn"
                                            title="Marcar como realizado"
                                            onClick={(e) => { e.stopPropagation(); handleToggleRealizado(rem); }}
                                        ><FaCheck /></button>
                                    </div>
                                ))
                            ) : <div className="muted" style={{ padding: '1rem' }}>No hay notificaciones nuevas</div>}
                        </div>
                    </div>
                </div>
            )}

            {showUserSettings && (
                <UserSettingsModal user={{ nombre: username }} onClose={() => setShowUserSettings(false)} />
            )}

            {showAppSettings && (
                <AppSettingsModal onClose={() => setShowAppSettings(false)} />
            )}
        </div>
    );
}

export default Home;
