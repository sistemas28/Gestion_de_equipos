import React from 'react';
import { FaTimes, FaUser, FaBuilding, FaDesktop, FaTag, FaCalendarAlt, FaTools, FaFileAlt, FaSignature, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './CreateMaintenanceModal.css';

const CreateMaintenanceModal = ({ 
    isOpen, 
    onClose, 
    newMaintenanceData, 
    equipos, 
    selectedEquipoId, 
    setSelectedEquipoId, 
    handleFormChange, 
    handleNewSignatureImageChange, 
    handleSaveNew, 
    handleCancel, 
    signatureType, 
    setSignatureType 
}) => {
    if (!isOpen) return null;

    return (
        <div className="create-maintenance-modal-overlay" onClick={onClose}>
            <div className="create-maintenance-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Crear Nuevo Mantenimiento</h3>
                    <button className="close-modal-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-section">
                        <h4>Información del Equipo</h4>
                        <div className="form-group">
                            <label>Equipo</label>
                            <select 
                                name="equipoId" 
                                value={selectedEquipoId} 
                                onChange={(e) => {
                                    setSelectedEquipoId(e.target.value);
                                    handleFormChange(e);
                                }}
                                required
                            >
                                <option value="">Selecciona un equipo...</option>
                                {equipos.map(eq => (
                                    <option key={eq.id} value={eq.id}>
                                        {eq.codigo} - {eq.usuario} ({eq.area})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedEquipoId && (
                            <div className="equipment-info">
                                <div className="info-row">
                                    <span className="info-label">Usuario:</span>
                                    <span className="info-value">{newMaintenanceData?.usuario || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Área:</span>
                                    <span className="info-value">{newMaintenanceData?.area || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Tipo:</span>
                                    <span className="info-value">{newMaintenanceData?.tipo || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Marca:</span>
                                    <span className="info-value">{newMaintenanceData?.marca || 'N/A'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-section">
                        <h4>Características del Equipo</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Sistema Operativo</label>
                                <select 
                                    name="sistema_operativo" 
                                    value={newMaintenanceData?.sistema_operativo || ''} 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Seleccionar sistema operativo...</option>
                                    <option value="Windows 10">Windows 10</option>
                                    <option value="Windows 11">Windows 11</option>
                                    <option value="Windows 7">Windows 7</option>
                                    <option value="Ubuntu">Ubuntu</option>
                                    <option value="Debian">Debian</option>
                                    <option value="CentOS">CentOS</option>
                                    <option value="macOS">macOS</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                {newMaintenanceData?.sistema_operativo === 'Otro' && (
                                    <input 
                                        name="sistema_operativo_otro" 
                                        value={newMaintenanceData?.sistema_operativo_otro || ''} 
                                        onChange={(e) => handleFormChange({
                                            target: { name: 'sistema_operativo_otro', value: e.target.value }
                                        })}
                                        placeholder="Especifique el sistema operativo"
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <label>Procesador</label>
                                <select 
                                    name="procesador" 
                                    value={newMaintenanceData?.procesador || ''} 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Seleccionar procesador...</option>
                                    <option value="Intel Core i3">Intel Core i3</option>
                                    <option value="Intel Core i5">Intel Core i5</option>
                                    <option value="Intel Core i7">Intel Core i7</option>
                                    <option value="Intel Core i9">Intel Core i9</option>
                                    <option value="AMD Ryzen 3">AMD Ryzen 3</option>
                                    <option value="AMD Ryzen 5">AMD Ryzen 5</option>
                                    <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                                    <option value="AMD Ryzen 9">AMD Ryzen 9</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                {newMaintenanceData?.procesador === 'Otro' && (
                                    <input 
                                        name="procesador_otro" 
                                        value={newMaintenanceData?.procesador_otro || ''} 
                                        onChange={(e) => handleFormChange({
                                            target: { name: 'procesador_otro', value: e.target.value }
                                        })}
                                        placeholder="Especifique el procesador"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>RAM</label>
                                <select 
                                    name="memoria_ram" 
                                    value={newMaintenanceData?.memoria_ram || ''} 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Seleccionar RAM...</option>
                                    <option value="4GB">4GB</option>
                                    <option value="8GB">8GB</option>
                                    <option value="16GB">16GB</option>
                                    <option value="32GB">32GB</option>
                                    <option value="64GB">64GB</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                {newMaintenanceData?.memoria_ram === 'Otro' && (
                                    <input 
                                        name="memoria_ram_otro" 
                                        value={newMaintenanceData?.memoria_ram_otro || ''} 
                                        onChange={(e) => handleFormChange({
                                            target: { name: 'memoria_ram_otro', value: e.target.value }
                                        })}
                                        placeholder="Especifique la RAM"
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <label>Disco Duro</label>
                                <select 
                                    name="disco_duro" 
                                    value={newMaintenanceData?.disco_duro || ''} 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Seleccionar disco duro...</option>
                                    <option value="HDD 500GB">HDD 500GB</option>
                                    <option value="HDD 1TB">HDD 1TB</option>
                                    <option value="SSD 256GB">SSD 256GB</option>
                                    <option value="SSD 512GB">SSD 512GB</option>
                                    <option value="SSD 1TB">SSD 1TB</option>
                                    <option value="NVMe 256GB">NVMe 256GB</option>
                                    <option value="NVMe 512GB">NVMe 512GB</option>
                                    <option value="NVMe 1TB">NVMe 1TB</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                {newMaintenanceData?.disco_duro === 'Otro' && (
                                    <input 
                                        name="disco_duro_otro" 
                                        value={newMaintenanceData?.disco_duro_otro || ''} 
                                        onChange={(e) => handleFormChange({
                                            target: { name: 'disco_duro_otro', value: e.target.value }
                                        })}
                                        placeholder="Especifique el disco duro"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Modelo</label>
                                <input 
                                    name="modelo" 
                                    value={newMaintenanceData?.modelo || ''} 
                                    onChange={handleFormChange} 
                                    placeholder="Modelo del equipo"
                                />
                            </div>
                            <div className="form-group">
                                <label>Serial</label>
                                <input 
                                    name="serial" 
                                    value={newMaintenanceData?.serial || ''} 
                                    onChange={handleFormChange} 
                                    placeholder="Número de serie del equipo"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Licencia</label>
                                <select 
                                    name="licencia" 
                                    value={newMaintenanceData?.licencia || ''} 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Seleccionar licencia...</option>
                                    <option value="Windows Pro">Windows Pro</option>
                                    <option value="Windows Home">Windows Home</option>
                                    <option value="Ubuntu">Ubuntu (Open Source)</option>
                                    <option value="Debian">Debian (Open Source)</option>
                                    <option value="CentOS">CentOS (Open Source)</option>
                                    <option value="macOS">macOS</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                {newMaintenanceData?.licencia === 'Otro' && (
                                    <input 
                                        name="licencia_otro" 
                                        value={newMaintenanceData?.licencia_otro || ''} 
                                        onChange={(e) => handleFormChange({
                                            target: { name: 'licencia_otro', value: e.target.value }
                                        })}
                                        placeholder="Especifique la licencia"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h4>Características Específicas</h4>
                        <div className="form-group">
                            <label>Características Adicionales</label>
                            <textarea 
                                name="caracteristicas_especificas" 
                                value={newMaintenanceData?.caracteristicas_especificas || ''} 
                                onChange={handleFormChange} 
                                rows="4"
                                placeholder="Especifique características adicionales del equipo (ej: tarjeta gráfica, puertos disponibles, periféricos, etc.)"
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-section">
                        <h4>Detalles del Servicio</h4>
                        <div className="form-group">
                            <label>Actividades Realizadas</label>
                            <textarea 
                                name="actividades_realizadas" 
                                value={newMaintenanceData?.actividades_realizadas || ''} 
                                onChange={handleFormChange} 
                                rows="5"
                                placeholder="Describa las actividades realizadas durante el mantenimiento..."
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Observaciones</label>
                            <textarea 
                                name="observaciones" 
                                value={newMaintenanceData?.observaciones || ''} 
                                onChange={handleFormChange} 
                                rows="3"
                                placeholder="Ingrese observaciones o comentarios adicionales..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-section">
                        <h4>Cronograma de Mantenimiento</h4>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Fecha de Elaboración</label>
                                <input type="date" name="fecha_de_elaboracion" value={newMaintenanceData?.fecha_de_elaboracion || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Fecha de Ejecución</label>
                                <input type="date" name="fecha_de_ejecucion" value={newMaintenanceData?.fecha_de_ejecucion || ''} onChange={handleFormChange} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Último Mantenimiento</label>
                                <input type="date" name="fecha_ultimo_mantenimiento" value={newMaintenanceData?.fecha_ultimo_mantenimiento || ''} onChange={handleFormChange} />
                            </div>
                            <div className="form-group">
                                <label>Próximo Mantenimiento</label>
                                <input type="date" name="fecha_actual_de_mantenimiento" value={newMaintenanceData?.fecha_actual_de_mantenimiento || ''} onChange={handleFormChange} />
                            </div>
                        </div>
                    </div>

                    <div className="modal-sidebar">
                        <div className="sidebar-section">
                            <h4>Firmas del Mantenimiento</h4>
                            <div className="signature-options">
                                <label>
                                    <input type="radio" name="signatureType" value="text" checked={signatureType === 'text'} onChange={() => setSignatureType('text')} />
                                    Escribir nombre
                                </label>
                                <label>
                                    <input type="radio" name="signatureType" value="image" checked={signatureType === 'image'} onChange={() => setSignatureType('image')} />
                                    Subir firma
                                </label>
                            </div>
                            
                            {signatureType === 'text' ? (
                                <div className="signature-inputs">
                                    <div className="form-group">
                                        <label>Nombre del técnico</label>
                                        <input name="firmas_tecnico" placeholder="Nombre del técnico" value={newMaintenanceData?.firmas_tecnico || ''} onChange={handleFormChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Nombre de quien aprueba</label>
                                        <input name="firmas_aprobo" placeholder="Nombre de quien aprueba" value={newMaintenanceData?.firmas_aprobo || ''} onChange={handleFormChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Nombre de quien revisa</label>
                                        <input name="firmas_reviso" placeholder="Nombre de quien revisa" value={newMaintenanceData?.firmas_reviso || ''} onChange={handleFormChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="signature-upload">
                                    <div className="upload-group">
                                        <label>Firma Técnico</label>
                                        <input type="file" accept="image/*" onChange={(e) => handleNewSignatureImageChange(e, 'firmas_tecnico')} />
                                        {newMaintenanceData?.firmas_tecnico && <img src={newMaintenanceData.firmas_tecnico} alt="Vista previa de la firma" className="signature-preview" />}
                                    </div>
                                    <div className="upload-group">
                                        <label>Firma Aprobó</label>
                                        <input type="file" accept="image/*" onChange={(e) => handleNewSignatureImageChange(e, 'firmas_aprobo')} />
                                        {newMaintenanceData?.firmas_aprobo && <img src={newMaintenanceData.firmas_aprobo} alt="Vista previa de la firma" className="signature-preview" />}
                                    </div>
                                    <div className="upload-group">
                                        <label>Firma Revisó</label>
                                        <input type="file" accept="image/*" onChange={(e) => handleNewSignatureImageChange(e, 'firmas_reviso')} />
                                        {newMaintenanceData?.firmas_reviso && <img src={newMaintenanceData.firmas_reviso} alt="Vista previa de la firma" className="signature-preview" />}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={handleSaveNew}>
                        <FaCheckCircle /> Crear Mantenimiento
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        <FaTimes /> Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateMaintenanceModal;