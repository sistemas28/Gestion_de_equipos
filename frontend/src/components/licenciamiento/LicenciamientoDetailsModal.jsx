import React from 'react';
import { FaTimes, FaUser, FaBuilding, FaDesktop, FaTag, FaFileAlt, FaDownload, FaEdit, FaTrash } from 'react-icons/fa';

const LicenciamientoDetailsModal = ({
    isOpen,
    onClose,
    detailedData,
    loadingDetails,
    handleDownloadPdf,
    handleEdit,
    handleDelete,
    isEditing,
    handleSave,
    handleCancel,
    editFormData,
    equipos,
    selectedEquipoId,
    setSelectedEquipoId,
    formatDate,
    handleFormChange
}) => {
    if (!isOpen) return null;

    return (
        <div className="maintenance-details-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="maintenance-details-panel" onClick={(e) => e.stopPropagation()}>
                <button className="close-maintenance-modal-btn" onClick={onClose}><FaTimes /></button>
                {loadingDetails ? (
                    <div className="loading-message-modal">Cargando detalles...</div>
                ) : detailedData ? (
                    <form onSubmit={handleSave}>
                        <div className="maintenance-modal-header">
                            <div className="maintenance-header-info">
                                <div className="maintenance-id-badge">
                                    <span className="id-label">Licenciamiento</span>
                                    <span className="id-value">#{detailedData.id}</span>
                                </div>
                                <div className="maintenance-user-info">
                                    <div className="user-name">
                                        <FaUser /> {detailedData.usuario}
                                    </div>
                                    <div className="user-area">
                                        <FaBuilding /> {detailedData.area}
                                    </div>
                                </div>
                            </div>
                            <div className="maintenance-actions">
                                {isEditing ? (
                                    <>
                                        <button type="submit" className="action-btn-modal save">Guardar</button>
                                        <button type="button" className="action-btn-modal cancel" onClick={handleCancel}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="action-btn-modal edit" onClick={handleEdit}><FaEdit /> Editar</button>
                                        <button type="button" className="action-btn-modal delete" onClick={handleDelete}><FaTrash /> Eliminar</button>
                                        <button type="button" className="action-btn-modal download" onClick={handleDownloadPdf}><FaDownload /> Descargar PDF</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="maintenance-content">
                            <div className="maintenance-main-content">
                                {isEditing ? (
                                    <>
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
                                                            <span className="info-value-modal">{editFormData?.usuario || detailedData?.usuario || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="info-card-modal">
                                                        <div className="info-icon-modal"><FaBuilding /></div>
                                                        <div className="info-content-modal">
                                                            <span className="info-label-modal">Área</span>
                                                            <span className="info-value-modal">{editFormData?.area || detailedData?.area || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="info-card-modal">
                                                        <div className="info-icon-modal"><FaTag /></div>
                                                        <div className="info-content-modal">
                                                            <span className="info-label-modal">Tipo</span>
                                                            <span className="info-value-modal">{editFormData?.tipo || detailedData?.tipo || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="info-card-modal">
                                                        <div className="info-icon-modal"><FaTag /></div>
                                                        <div className="info-content-modal">
                                                            <span className="info-label-modal">Marca</span>
                                                            <span className="info-value-modal">{editFormData?.marca || detailedData?.marca || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="info-card-modal">
                                                        <div className="info-icon-modal"><FaDesktop /></div>
                                                        <div className="info-content-modal">
                                                            <span className="info-label-modal">Sistema Operativo</span>
                                                            <span className="info-value-modal">{editFormData?.sistema_operativo || editFormData?.os || detailedData?.sistema_operativo || detailedData?.os || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="info-card-modal">
                                                        <div className="info-icon-modal"><FaTag /></div>
                                                        <div className="info-content-modal">
                                                            <span className="info-label-modal">Procesador</span>
                                                            <span className="info-value-modal">{editFormData?.procesador || detailedData?.procesador || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="info-card-modal">
                                                        <div className="info-icon-modal"><FaTag /></div>
                                                        <div className="info-content-modal">
                                                            <span className="info-label-modal">RAM</span>
                                                            <span className="info-value-modal">{editFormData?.memoria_ram || editFormData?.ram || detailedData?.memoria_ram || detailedData?.ram || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="info-card-modal">
                                                        <div className="info-icon-modal"><FaTag /></div>
                                                        <div className="info-content-modal">
                                                            <span className="info-label-modal">Disco Duro</span>
                                                            <span className="info-value-modal">{editFormData?.disco_duro || detailedData?.disco_duro || 'N/A'}</span>
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
                                                        <input name="sistema_operativo" value={editFormData?.sistema_operativo || detailedData?.sistema_operativo || ''} onChange={handleFormChange} placeholder="Sistema Operativo" />
                                                    </div>
                                                    <div className="form-label-modal">
                                                        <label>Software de Oficina</label>
                                                        <input name="software_de_oficina" value={editFormData?.software_de_oficina || detailedData?.software_de_oficina || ''} onChange={handleFormChange} />
                                                    </div>
                                                </div>
                                                <div className="form-label-modal">
                                                    <label>Otro Software</label>
                                                    <input name="otro_software" value={editFormData?.otro_software || detailedData?.otro_software || ''} onChange={handleFormChange} />
                                                </div>
                                                <div className="form-label-modal">
                                                    <label>Descripción</label>
                                                    <textarea name="descripcion" value={editFormData?.descripcion || detailedData?.descripcion || ''} onChange={handleFormChange} rows="3"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="info-section-modal">
                                            <div className="section-header-modal">
                                                <div className="section-icon-modal"><FaUser /></div>
                                                <h4 className="section-title-modal">Información General</h4>
                                            </div>
                                            <div className="info-grid-modal">
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaUser /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">Usuario</span>
                                                        <span className="info-value-modal">{detailedData.usuario}</span>
                                                    </div>
                                                </div>
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaBuilding /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">Área</span>
                                                        <span className="info-value-modal">{detailedData.area}</span>
                                                    </div>
                                                </div>
                                                <div className="info-card-modal">
                                                    <div className="info-icon-modal"><FaTag /></div>
                                                    <div className="info-content-modal">
                                                        <span className="info-label-modal">Tipo de Equipo</span>
                                                        <span className="info-value-modal">{detailedData.tipo}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="info-section-modal">
                                            <div className="section-header-modal">
                                                <div className="section-icon-modal"><FaFileAlt /></div>
                                                <h4 className="section-title-modal">Detalles del Licenciamiento</h4>
                                            </div>
                                            <div className="service-details-modal">
                                                <div className="service-item-modal">
                                                    <span className="service-label-modal"><FaFileAlt /> Sistema Operativo</span>
                                                    <div className="service-content-modal">{detailedData.sistema_operativo || 'N/A'}</div>
                                                </div>
                                                <div className="service-item-modal">
                                                    <span className="service-label-modal"><FaFileAlt /> Software de Oficina</span>
                                                    <div className="service-content-modal">{detailedData.software_de_oficina || 'N/A'}</div>
                                                </div>
                                                <div className="service-item-modal">
                                                    <span className="service-label-modal"><FaFileAlt /> Otro Software</span>
                                                    <div className="service-content-modal">{detailedData.otro_software || 'N/A'}</div>
                                                </div>
                                                <div className="service-item-modal">
                                                    <span className="service-label-modal"><FaFileAlt /> Descripción</span>
                                                    <div className="service-content-modal">{detailedData.descripcion}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="error-message-modal">No se pudieron cargar los detalles.</div>
                )}
            </div>
        </div>
    );
};

export default LicenciamientoDetailsModal;
