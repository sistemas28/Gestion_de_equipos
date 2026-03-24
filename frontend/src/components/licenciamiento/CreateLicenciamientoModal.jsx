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
        <div className="details-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="details-panel card" onClick={(e) => e.stopPropagation()}>
                <button className="close-details-btn" onClick={onClose}><FaTimes /></button>
                {newLicenciamientoData && (
                    <>
                        <div className="details-header">
                            <h3>Crear Nuevo Licenciamiento</h3>
                            <div className="details-actions">
                                <button type="button" className="action-btn save" onClick={handleSaveNew}>Guardar</button>
                                <button type="button" className="action-btn cancel" onClick={handleCancel}>Cancelar</button>
                            </div>
                        </div>
                        <form onSubmit={handleSaveNew}>
                            <div className="details-grid">
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
                                <hr className="full-width" />
                                {selectedEquipoId && (
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
                                )}
                                <hr className="full-width" />
                                <label><FaFileAlt /> Sistema Operativo <input name="sistema_operativo" value={newLicenciamientoData.sistema_operativo} onChange={handleFormChange} placeholder="Ej: Windows 11 Pro" /></label>
                                <label><FaFileAlt /> Software de Oficina <input name="software_de_oficina" value={newLicenciamientoData.software_de_oficina} onChange={handleFormChange} placeholder="Ej: Microsoft Office 2021" /></label>
                                <label><FaFileAlt /> Otro Software <input name="otro_software" value={newLicenciamientoData.otro_software} onChange={handleFormChange} placeholder="Ej: Adobe Photoshop" /></label>
                                <label className="full-width">
                                    <FaFileAlt /> Descripción
                                    <textarea name="descripcion" value={newLicenciamientoData.descripcion} onChange={handleFormChange} rows="3" placeholder="Detalles adicionales del licenciamiento"></textarea>
                                </label>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateLicenciamientoModal;
