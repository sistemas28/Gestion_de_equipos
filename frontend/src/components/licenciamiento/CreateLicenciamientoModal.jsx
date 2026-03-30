import React from 'react';
import { FaTimes, FaUser, FaBuilding, FaDesktop, FaTag, FaFileAlt } from 'react-icons/fa';

const CreateLicenciamientoModal = ({
    isOpen,
    onClose,
    newLicenciamientoData,
    equipos,
    selectedEquipoId,
    setSelectedEquipoId,
    handleFormChange,
    handleSaveNew,
    handleCancel
}) => {
    if (!isOpen) return null;

    return (
        <div className="maintenance-details-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="maintenance-details-panel" onClick={(e) => e.stopPropagation()}>
                <button className="close-maintenance-modal-btn" onClick={onClose}><FaTimes /></button>
                {newLicenciamientoData && (
                    <>
                        <div className="maintenance-modal-header">
                            <div className="maintenance-header-info">
                                <div className="maintenance-id-badge">
                                    <span className="id-label">Nuevo</span>
                                    <span className="id-value">Licenciamiento</span>
                                </div>
                                <div className="maintenance-user-info">
                                    <div className="user-name">
                                        <FaUser /> Crear Registro
                                    </div>
                                    <div className="user-area">
                                        <FaBuilding /> Licenciamiento
                                    </div>
                                </div>
                            </div>
                            <div className="maintenance-actions">
                                <button type="button" className="action-btn-modal save" onClick={handleSaveNew}>Guardar</button>
                                <button type="button" className="action-btn-modal cancel" onClick={handleCancel}>Cancelar</button>
                            </div>
                        </div>
                        <form onSubmit={handleSaveNew}>
                            <div className="maintenance-content">
                                <div className="maintenance-main-content">
                                    <div className="info-section-modal">
                                        <div className="section-header-modal">
                                            <div className="section-icon-modal"><FaDesktop /></div>
                                            <h4 className="section-title-modal">Seleccionar Equipo</h4>
                                        </div>
                                        <label>
                                            <FaDesktop /> Seleccionar Equipo Existente:
                                            <select name="equipoId" value={selectedEquipoId} onChange={handleFormChange} required>
                                                <option value="">-- Seleccionar un equipo --</option>
                                                {equipos.map(eq => (
                                                    <option key={eq.id} value={eq.id}>
                                                        {eq.codigo} - {eq.usuario} ({eq.area})
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                    
                                    {selectedEquipoId && (
                                        <div className="info-section-modal">
                                            <div className="section-header-modal">
                                                <div className="section-icon-modal"><FaDesktop /></div>
                                                <h4 className="section-title-modal">Información del Equipo</h4>
                                            </div>
                                            <div className="info-grid-modal">
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaUser /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">Usuario</span>
                                                        <span className="info-value-modal">{newLicenciamientoData?.usuario || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaBuilding /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">Área</span>
                                                        <span className="info-value-modal">{newLicenciamientoData?.area || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaTag /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">Tipo</span>
                                                        <span className="info-value-modal">{newLicenciamientoData?.tipo || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaTag /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">Marca</span>
                                                        <span className="info-value-modal">{newLicenciamientoData?.marca || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaDesktop /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">Sistema Operativo</span>
                                                        <span className="info-value-modal">{newLicenciamientoData?.sistema_operativo || newLicenciamientoData?.os || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaTag /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">Procesador</span>
                                                        <span className="info-value-modal">{newLicenciamientoData?.procesador || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaTag /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">RAM</span>
                                                        <span className="info-value-modal">{newLicenciamientoData?.memoria_ram || newLicenciamientoData?.ram || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaTag /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">Disco Duro</span>
                                                        <span className="info-value-modal">{newLicenciamientoData?.disco_duro || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="info-section-modal">
                                        <div className="section-header-modal">
                                            <div className="section-icon-modal"><FaFileAlt /></div>
                                            <h4 className="section-title-modal">Información de Licenciamiento</h4>
                                        </div>
                                        <div className="form-section-modal">
                                            <div className="form-row-modal">
                                                <div className="form-label-modal">
                                                    <label>Sistema Operativo</label>
                                                    <input name="sistema_operativo" value={newLicenciamientoData.sistema_operativo} onChange={handleFormChange} placeholder="Ej: Windows 11 Pro" />
                                                </div>
                                                <div className="form-label-modal">
                                                    <label>Software de Oficina</label>
                                                    <input name="software_de_oficina" value={newLicenciamientoData.software_de_oficina} onChange={handleFormChange} placeholder="Ej: Microsoft Office 2021" />
                                                </div>
                                            </div>
                                            <div className="form-label-modal">
                                                <label>Otro Software</label>
                                                <input name="otro_software" value={newLicenciamientoData.otro_software} onChange={handleFormChange} placeholder="Ej: Adobe Photoshop" />
                                            </div>
                                            <div className="form-label-modal">
                                                <label>Descripción</label>
                                                <textarea name="descripcion" value={newLicenciamientoData.descripcion} onChange={handleFormChange} rows="3" placeholder="Detalles adicionales del licenciamiento"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateLicenciamientoModal;
