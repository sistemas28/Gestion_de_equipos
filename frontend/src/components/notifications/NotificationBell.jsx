import React from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationBell.css';

const NotificationBell = () => {
    const { notifications, togglePanel, showPanel } = useNotifications();

    const count = notifications.length;

    return (
        <div className="notification-bell-container">
            <button
                className={`bell-btn ${showPanel ? 'active' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    togglePanel();
                }}
                aria-label="Notificaciones"
            >
                <FaBell className="bell-icon" />
                {count > 0 && (
                    <span className="bell-badge">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
            </button>
        </div>
    );
};

export default NotificationBell;
