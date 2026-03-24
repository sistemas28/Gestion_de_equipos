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
    handleFormChange,
    equipos,
    selectedEquipoId,
    setSelectedEquipoId,
    formatDate
}) => {
    if (!isOpen) return null;

    return (
        <div className="details-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="details-panel card" onClick={(e) => e.stopPropagation()}>
                <button className="close-details-btn" onClick={onClose}><FaTimes /></button>
                {loadingDetails ? (
                    <div className="loading-message">Cargando detalles...</div>
                ) : detailedData ? (
                    <form onSubmit={handleSave}>
                        <div className="details-header">
                            <h3>Detalles del Licenciamiento #{detailedData.id}</h3>
                            <div className="details-actions">
                                {isEditing ? (
                                    <>
                                        <button type="submit" className="action-btn save">Guardar</button>
                                        <button type="button" className="action-btn cancel" onClick={handleCancel}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="action-btn" onClick={handleEdit}><FaEdit /> Editar</button>
                                        <button type="button" className="action-btn delete" onClick={handleDelete}><FaTrash /> Eliminar</button>
                                        <button type="button" className="action-btn download" onClick={handleDownloadPdf}><FaDownload /> Descargar PDF</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="details-grid">
                            {isEditing ? (
                                <>
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
                                    <hr className="full-width" />
                                    {selectedEquipoId && (
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
                                    )}
                                    <hr className="full-width" />
                                    <label><FaFileAlt /> Sistema Operativo <input name="sistema_operativo" value={editFormData.sistema_operativo || ''} onChange={handleFormChange} placeholder="Sistema Operativo" /></label>
                                    <label><FaFileAlt /> Software de Oficina <input name="software_de_oficina" value={editFormData.software_de_oficina || ''} onChange={handleFormChange} /></label>
                                    <label><FaFileAlt /> Otro Software <input name="otro_software" value={editFormData.otro_software || ''} onChange={handleFormChange} /></label>
                                    <label className="full-width">
                                        <FaFileAlt /> Descripción 
                                        <textarea name="descripcion" value={editFormData.descripcion || ''} onChange={handleFormChange} rows="3"></textarea>
                                    </label>
                                </>
                            ) : (
                                <>
                                    <div className="detail-item"><span><FaUser /> Usuario:</span><p>{detailedData.usuario}</p></div>
                                    <div className="detail-item"><span><FaBuilding /> Área:</span><p>{detailedData.area}</p></div>
                                    <div className="detail-item"><span><FaTag /> Tipo de Equipo:</span><p>{detailedData.tipo}</p></div>
                                    <div className="detail-item full-width"><span><FaFileAlt /> Descripción:</span><p>{detailedData.descripcion}</p></div>
                                    <div className="detail-item"><span><FaFileAlt /> Sistema Operativo:</span><p>{detailedData.sistema_operativo || 'N/A'}</p></div>
                                    <div className="detail-item"><span><FaFileAlt /> Software de Oficina:</span><p>{detailedData.software_de_oficina || 'N/A'}</p></div>
                                    <div className="detail-item"><span><FaFileAlt /> Otro Software:</span><p>{detailedData.otro_software || 'N/A'}</p></div>
                                </>
                            )}
                        </div>
                    </form>
                ) : (
                    <div className="error-message">No se pudieron cargar los detalles.</div>
                )}
            </div>
        </div>
    );
};

export default LicenciamientoDetailsModal;
