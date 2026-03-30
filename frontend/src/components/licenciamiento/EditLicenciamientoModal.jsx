import React from 'react';
import { FaTimes, FaUser, FaBuilding, FaDesktop, FaTag, FaFileAlt, FaDownload, FaEdit, FaTrash } from 'react-icons/fa';
import './EditLicenciamientoModal.css';

const EditLicenciamientoModal = ({
    isOpen,
    onClose,
    editFormData,
    equipos,
    selectedEquipoId,
    setSelectedEquipoId,
    handleFormChange,
    handleSave,
    handleCancel,
    handleDownloadPdf,
    formatDate
}) => {
    if (!isOpen) return null;

    return (
        <div className="maintenance-details-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="maintenance-details-panel" onClick={(e) => e.stopPropagation()}>
                <button className="close-maintenance-modal-btn" onClick={onClose}><FaTimes /></button>
                <>
                    <div className="maintenance-modal-header">
                        <div className="maintenance-header-info">
                            <div className="maintenance-id-badge">
                                <span className="id-label">Editar</span>
                                <span className="id-value">Licenciamiento</span>
                            </div>
                            <div className="maintenance-user-info">
                                <div className="user-name">
                                    <FaUser /> {editFormData?.usuario || 'N/A'}
                                </div>
                                <div className="user-area">
                                    <FaBuilding /> {editFormData?.area || 'N/A'}
                                </div>
                            </div>
                        </div>
                        <div className="maintenance-actions">
                            <button type="button" className="action-btn-modal save" onClick={handleSave}><FaEdit /> Guardar</button>
                            <button type="button" className="action-btn-modal cancel" onClick={handleCancel}>Cancelar</button>
                        </div>
                    </div>

                    <div className="maintenance-content">
                        <div className="maintenance-main-content">
                            <div className="info-section-modal">
                                <div className="section-header-modal">
                                    <div className="section-icon-modal"><FaDesktop /></div>
                                    <h4 className="section-title-modal">Seleccionar Equipo</h4>
                                </div>
                                <label>
                                    <FaDesktop /> Seleccionar Equipo:
                                    <select name="equipoId" value={selectedEquipoId} onChange={handleFormChange}>
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
                                                <span className="info-value-modal">{editFormData?.usuario || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaBuilding /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Área</span>
                                                <span className="info-value-modal">{editFormData?.area || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Tipo</span>
                                                <span className="info-value-modal">{editFormData?.tipo || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Marca</span>
                                                <span className="info-value-modal">{editFormData?.marca || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaDesktop /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Sistema Operativo</span>
                                                <span className="info-value-modal">{editFormData?.sistema_operativo || editFormData?.os || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Procesador</span>
                                                <span className="info-value-modal">{editFormData?.procesador || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">RAM</span>
                                                <span className="info-value-modal">{editFormData?.memoria_ram || editFormData?.ram || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Disco Duro</span>
                                                <span className="info-value-modal">{editFormData?.disco_duro || 'N/A'}</span>
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
                                            <input name="sistema_operativo" value={editFormData?.sistema_operativo || ''} onChange={handleFormChange} placeholder="Sistema Operativo" />
                                        </div>
                                        <div className="form-label-modal">
                                            <label>Software de Oficina</label>
                                            <input name="software_de_oficina" value={editFormData?.software_de_oficina || ''} onChange={handleFormChange} />
                                        </div>
                                    </div>
                                    <div className="form-label-modal">
                                        <label>Otro Software</label>
                                        <input name="otro_software" value={editFormData?.otro_software || ''} onChange={handleFormChange} />
                                    </div>
                                    <div className="form-label-modal">
                                        <label>Descripción</label>
                                        <textarea name="descripcion" value={editFormData?.descripcion || ''} onChange={handleFormChange} rows="3"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </div>
    );
};

export default EditLicenciamientoModal;
