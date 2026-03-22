import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaCheckCircle, FaTrash, FaPlus, FaExclamationCircle } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationContext';
import './RemindersWidget.css';

const RemindersWidget = () => {
    const { logActivity } = useNotifications();
    const [reminders, setReminders] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newReminder, setNewReminder] = useState({ title: '', date: '', notas: '' });

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/recordatorios');
            // Filter only pending (realizado = 0) and sort by date closest first
            const pending = (response.data.body || [])
                .filter(r => r.realizado === 0)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            setReminders(pending.slice(0, 5)); // Show top 5
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/recordatorios', newReminder);
            setNewReminder({ title: '', date: '', notas: '' });
            setIsAdding(false);
            logActivity('Recordatorio Creado', `Nuevo recordatorio: ${newReminder.title}`);
            fetchReminders();
        } catch (err) {
            console.error(err);
        }
    };

    const handleComplete = async (id) => {
        try {
            const reminder = reminders.find(r => r.id === id);
            await api.patch(`/recordatorios/${id}/realizado`, { realizado: 1 });
            logActivity('Recordatorio Completado', `Se completó: ${reminder?.title}`);
            fetchReminders();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar recordatorio?')) return;
        try {
            const reminder = reminders.find(r => r.id === id);
            await api.delete(`/recordatorios/${id}`);
            logActivity('Recordatorio Eliminado', `Se eliminó: ${reminder?.title}`);
            fetchReminders();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="reminders-widget card">
            <div className="widget-header">
                <h3>Recordatorios</h3>
                <button className="add-reminder-btn-small" onClick={() => setIsAdding(!isAdding)}>
                    <FaPlus />
                </button>
            </div>

            {isAdding && (
                <form className="widget-add-form" onSubmit={handleAdd}>
                    <input
                        type="text"
                        placeholder="Título..."
                        value={newReminder.title}
                        onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        value={newReminder.date}
                        onChange={e => setNewReminder({ ...newReminder, date: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Notas..."
                        value={newReminder.notas}
                        onChange={e => setNewReminder({ ...newReminder, notas: e.target.value })}
                        rows="2"
                    />
                    <div className="widget-form-actions">
                        <button type="button" onClick={() => setIsAdding(false)}>Cancelar</button>
                        <button type="submit">Guardar</button>
                    </div>
                </form>
            )}

            <div className="widget-list">
                {loading && <p className="loading-text">Cargando...</p>}
                {!loading && reminders.length === 0 && (
                    <div className="empty-widget">
                        <FaExclamationCircle />
                        <p>No hay recordatorios pendientes.</p>
                    </div>
                )}
                {reminders.map(r => (
                    <div key={r.id} className="reminder-item-row">
                        <div className="reminder-info">
                            <span className="reminder-title">{r.title}</span>
                            <span className="reminder-date">{new Date(r.date + 'T00:00:00').toLocaleDateString()}</span>
                            {r.notas && <p className="reminder-notes-preview">{r.notas}</p>}
                        </div>
                        <div className="reminder-actions">
                            <button onClick={() => handleComplete(r.id)} title="Completar" className="btn-icon complete"><FaCheckCircle /></button>
                            <button onClick={() => handleDelete(r.id)} title="Borrar" className="btn-icon delete"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default RemindersWidget;
