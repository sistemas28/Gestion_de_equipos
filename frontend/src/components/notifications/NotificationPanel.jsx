import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { FaCheck, FaBell, FaCalendarAlt, FaTools, FaLaptop, FaTrash } from 'react-icons/fa';
import './NotificationPanel.css';

const NotificationPanel = () => {
    const {
        notifications,
        showPanel,
        closePanel,
        markAsRead,
        clearAll,
        loading
    } = useNotifications();

    if (!showPanel) return null;

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getIcon = (source) => {
        switch (source) {
            case 'mantenimiento': return <FaTools />;
            case 'licencia': return <FaLaptop />;
            default: return <FaBell />;
        }
    };

    return (
        <>
            <div className="notif-backdrop" onClick={closePanel} />
            <div className="notification-panel-overlay" onClick={e => e.stopPropagation()}>
                <div className="notification-panel-header">
                    <h3>Notificaciones</h3>
                    {notifications.length > 0 && (
                        <button className="clear-all-btn" onClick={clearAll}>
                            Limpiar manuables
                        </button>
                    )}
                </div>

                <div className="notification-list-container">
                    {loading && <div className="loading-dots">Cargando...</div>}

                    {!loading && notifications.length === 0 ? (
                        <div className="empty-notifications">
                            <FaBell className="empty-icon" />
                            <p>No tienes notificaciones pendientes</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div key={notif.id} className="notification-item-card">
                                <div className="notification-icon-wrapper">
                                    {getIcon(notif.source)}
                                </div>
                                <div className="notification-info">
                                    <h4 className="notification-title">{notif.title}</h4>
                                    <div className="notification-meta">
                                        <span className="meta-date">
                                            <FaCalendarAlt size={10} />
                                            {formatDate(notif.date)}
                                        </span>
                                        {notif.source && (
                                            <span className="meta-source">
                                                {notif.source}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {!notif.source && (
                                    <div className="item-actions">
                                        <button
                                            className="check-btn"
                                            onClick={() => markAsRead(notif)}
                                            title="Marcar como realizado"
                                        >
                                            <FaCheck />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;
