import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPanel, setShowPanel] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const remindersPromise = api.get('/recordatorios');
            const maintenancePromise = api.get('/mantenimiento');

            const [remindersResp, maintenanceResp] = await Promise.all([
                remindersPromise,
                maintenancePromise
            ]);

            const manualReminders = remindersResp.data.body || [];
            const maintenanceReminders = (maintenanceResp.data.body || [])
                .filter(item => item.fecha_actual_de_mantenimiento)
                .map(item => ({
                    id: `mantenimiento-${item.id}`,
                    title: `Mantenimiento pendiente: ${item.usuario}`,
                    date: item.fecha_actual_de_mantenimiento,
                    realizado: new Date(item.fecha_actual_de_mantenimiento) < new Date(item.fecha_ultimo_mantenimiento),
                    source: 'mantenimiento',
                    icon: 'maintenance',
                    notas: item.actividades_realizadas
                        ? (item.observaciones ? `${item.actividades_realizadas}\n\nObservaciones: ${item.observaciones}` : item.actividades_realizadas)
                        : item.observaciones
                }));

            // Filter out completed ones
            const allNotifications = [...manualReminders, ...maintenanceReminders]
                .filter(n => !n.realizado)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            setNotifications(allNotifications);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Refresh every 5 minutes
        const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = async (notification) => {
        if (notification.source === 'mantenimiento') {
            // Maintenance notifications are marked as read by performing the maintenance
            // But we can hide them from the list if we want, or just alert the user
            return;
        }
        try {
            await api.patch(`/recordatorios/${notification.id}/realizado`, { realizado: 1 });
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const clearAll = async () => {
        try {
            const manual = notifications.filter(n => !n.source);
            await Promise.all(manual.map(n => api.patch(`/recordatorios/${n.id}/realizado`, { realizado: 1 })));
            fetchNotifications();
        } catch (err) {
            console.error('Error clearing notifications:', err);
        }
    };

    const togglePanel = () => setShowPanel(prev => !prev);
    const closePanel = () => setShowPanel(false);

    return (
        <NotificationContext.Provider value={{
            notifications,
            loading,
            showPanel,
            togglePanel,
            closePanel,
            markAsRead,
            clearAll,
            markAsRead,
            clearAll,
            refresh: fetchNotifications,
            logActivity: async (title, details) => {
                try {
                    await api.post('/recordatorios', {
                        title: `Actividad: ${title}`,
                        date: new Date().toISOString(),
                        notas: details,
                        realizado: 0
                    });
                    fetchNotifications();
                } catch (err) {
                    console.error('Error logging activity:', err);
                }
            }
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
