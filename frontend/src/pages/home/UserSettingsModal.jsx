import React, { useState } from 'react';
import './SettingsModal.css'; // Usaremos un CSS compartido para los modales
import { FaUser, FaTimes } from 'react-icons/fa';

function UserSettingsModal({ user, onClose }) {
    const [nombre, setNombre] = useState(user?.nombre || '');
    const [correo, setCorreo] = useState(user?.correo || '');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Aquí iría la lógica para llamar a la API y guardar los cambios
        console.log('Guardando perfil de usuario:', { nombre, correo });

        setSuccess('¡Perfil actualizado con éxito! (Simulación)');
        // setTimeout(onClose, 2000); // Opcional: cerrar después de un tiempo
    };

    return (
        <div className="settings-modal" onClick={onClose}>
            <div className="settings-panel card" onClick={(e) => e.stopPropagation()}>
                <div className="settings-header">
                    <h3><span className="icon"><FaUser /></span>Ajustes de Usuario</h3>
                    <button className="close-modal-btn" onClick={onClose}><FaTimes /></button>
                </div>
                <form onSubmit={handleSubmit} className="settings-form">
                    {error && <div className="form-message error">{error}</div>}
                    {success && <div className="form-message success">{success}</div>}

                    <h4>Información del Perfil</h4>
                    <label>
                        Nombre de Usuario
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />
                    </label>
                    <label>
                        Correo Electrónico
                        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="tu@correo.com" />
                    </label>

                    <div className="form-actions">
                        <button type="submit" className="action-btn save">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserSettingsModal;