import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import api from '../../api/axios';
import { FaCheck, FaBell, FaCalendarAlt, FaTools, FaLaptop, FaTrash, FaPlus } from 'react-icons/fa';
import './NotificationPanel.css';

const NotificationPanel = () => {
    const {
        notifications,
        showPanel,
        closePanel,
        markAsRead,
        clearAll,
        loading,
        refresh
    } = useNotifications();

    const [expandedNotif, setExpandedNotif] = useState(null);

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
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {notifications.length > 0 && (
                            <button className="clear-all-btn" onClick={clearAll}>
                                Limpiar todo
                            </button>
                        )}
                    </div>
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
                                    {notif.notas && (
                                        <div className="notification-notes-preview" onClick={(e) => { e.stopPropagation(); setExpandedNotif(expandedNotif === notif.id ? null : notif.id) }}>
                                            {expandedNotif === notif.id ? notif.notas : (
                                                <span className="notes-truncated">Ver notas...</span>
                                            )}
                                        </div>
                                    )}
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
            </div >
        </>
    );
};

export default NotificationPanel;
