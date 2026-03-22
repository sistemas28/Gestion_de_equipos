import React, { useState } from 'react';
import './SettingsModal.css';
import { FaCog, FaTimes, FaMoon, FaVolumeUp, FaCompress, FaBolt } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';

function AppSettingsModal({ onClose }) {
    const { settings, updateSetting } = useSettings();

    return (
        <div className="settings-modal" onClick={onClose}>
            <div className="settings-panel card" onClick={(e) => e.stopPropagation()}>
                <div className="settings-header">
                    <h3><span className="icon"><FaCog /></span>Configuración</h3>
                    <button className="close-modal-btn" onClick={onClose}><FaTimes /></button>
                </div>
                <div className="settings-form">

                    <div className="setting-group">
                        <h4>Apariencia</h4>
                        <div className="setting-item">
                            <div className="setting-label">
                                <FaMoon /> <span>Modo Oscuro</span>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.darkMode}
                                    onChange={(e) => updateSetting('darkMode', e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-label">
                                <FaCompress /> <span>Modo Compacto</span>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.compactMode}
                                    onChange={(e) => updateSetting('compactMode', e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-group">
                        <h4>Rendimiento y Sonido</h4>
                        <div className="setting-item">
                            <div className="setting-label">
                                <FaBolt /> <span>Reducir Animaciones</span>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.reduceAnimations}
                                    onChange={(e) => updateSetting('reduceAnimations', e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-label">
                                <FaVolumeUp /> <span>Sonidos de Notificación</span>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={settings.soundEnabled}
                                    onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button onClick={onClose} className="action-btn save">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppSettingsModal;