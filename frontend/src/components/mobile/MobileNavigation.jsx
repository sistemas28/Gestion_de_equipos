import React from 'react';
import { FaHome, FaTools, FaFileAlt, FaDatabase, FaPlus, FaHistory, FaUser } from 'react-icons/fa';
import './MobileNavigation.css';

const MobileNavigation = ({ currentView, onViewChange }) => {
    return (
        <nav className="mobile-bottom-nav">
            <button
                className={`mobile-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => onViewChange('dashboard')}
            >
                <FaHome className="nav-icon" />
                <span className="nav-label">Inicio</span>
            </button>

            <button
                className={`mobile-nav-item ${currentView === 'mantenimiento' ? 'active' : ''}`}
                onClick={() => onViewChange('mantenimiento')}
            >
                <FaTools className="nav-icon" />
                <span className="nav-label">Mant.</span>
            </button>

            <div className="mobile-nav-center">
                <button
                    className="mobile-fab"
                    onClick={() => onViewChange('agregarEquipo')}
                >
                    <FaPlus />
                </button>
            </div>

            <button
                className={`mobile-nav-item ${currentView === 'historial' ? 'active' : ''}`}
                onClick={() => onViewChange('historial')}
            >
                <FaHistory className="nav-icon" />
                <span className="nav-label">Historial</span>
            </button>

            <button
                className={`mobile-nav-item ${currentView === 'menu' ? 'active' : ''}`}
                onClick={() => onViewChange('menu')}
            >
                <FaUser className="nav-icon" />
                <span className="nav-label">Menú</span>
            </button>
        </nav>
    );
};

export default MobileNavigation;
