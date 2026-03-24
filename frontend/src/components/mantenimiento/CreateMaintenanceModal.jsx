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
        <div className="create-maintenance-modal" onClick={onClose}>
            <div className="create-maintenance-panel" onClick={(e) => e.stopPropagation()}>
                <button className="close-create-modal-btn" onClick={onClose}><FaTimes /></button>
                
                <div className="create-modal-header">
                    <h3>Crear Nuevo Mantenimiento</h3>
                </div>

                <div className="create-maintenance-content">
                    <div className="maintenance-main-content">
                        {/* Información del Equipo */}
                        <div className="info-section-modal">
                            <div className="section-header-modal">
                                <FaDesktop className="section-icon-modal" />
                                <h4>Información del Equipo</h4>
                            </div>
                            <div className="form-section-modal">
                                <div className="form-row-modal">
                                    <label className="form-label-modal">
                                        <FaDesktop /> Equipo
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
                                    </label>
                                </div>
                                {selectedEquipoId && (
                                    <div className="info-grid-modal">
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaUser /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Usuario</span>
                                                <span className="info-value-modal">{newMaintenanceData?.usuario || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaBuilding /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Área</span>
                                                <span className="info-value-modal">{newMaintenanceData?.area || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTools /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Tipo</span>
                                                <span className="info-value-modal">{newMaintenanceData?.tipo || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Marca</span>
                                                <span className="info-value-modal">{newMaintenanceData?.marca || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaDesktop /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Sistema Operativo</span>
                                                <span className="info-value-modal">{newMaintenanceData?.sistema_operativo || newMaintenanceData?.os || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Procesador</span>
                                                <span className="info-value-modal">{newMaintenanceData?.procesador || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">RAM</span>
                                                <span className="info-value-modal">{newMaintenanceData?.memoria_ram || newMaintenanceData?.ram || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Disco Duro</span>
                                                <span className="info-value-modal">{newMaintenanceData?.disco_duro || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Modelo</span>
                                                <span className="info-value-modal">{newMaintenanceData?.modelo || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Serial</span>
                                                <span className="info-value-modal">{newMaintenanceData?.serial || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-card-modal">
                                            <div className="info-icon-modal"><FaTag /></div>
                                            <div className="info-content-modal">
                                                <span className="info-label-modal">Licencia</span>
                                                <span className="info-value-modal">{newMaintenanceData?.licencia || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Características del Equipo */}
                        <div className="info-section-modal">
                            <div className="section-header-modal">
                                <FaTools className="section-icon-modal" />
                                <h4>Características del Equipo</h4>
                            </div>
                            <div className="form-section-modal">
                                <div className="form-row-modal">
                                    <label className="form-label-modal">
                                        <FaDesktop /> Sistema Operativo
                                        <select 
                                            name="sistema_operativo" 
                                            value={newMaintenanceData?.sistema_operativo || ''} 
                                            onChange={handleFormChange}
                                            onBlur={(e) => {
                                                // Si elige "Otro", mantener el valor actual
                                                if (e.target.value === 'Otro') {
                                                    return;
                                                }
                                                // Si escribe algo que no está en la lista, se queda como está
                                            }}
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
                                                    target: { name: 'sistema_operativo', value: e.target.value }
                                                })}
                                                placeholder="Especifique el sistema operativo"
                                            />
                                        )}
                                    </label>
                                    <label className="form-label-modal">
                                        <FaTag /> Procesador
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
                                                    target: { name: 'procesador', value: e.target.value }
                                                })}
                                                placeholder="Especifique el procesador"
                                            />
                                        )}
                                    </label>
                                </div>
                                <div className="form-row-modal">
                                    <label className="form-label-modal">
                                        <FaTag /> RAM
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
                                                    target: { name: 'memoria_ram', value: e.target.value }
                                                })}
                                                placeholder="Especifique la RAM"
                                            />
                                        )}
                                    </label>
                                    <label className="form-label-modal">
                                        <FaTag /> Disco Duro
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
                                                    target: { name: 'disco_duro', value: e.target.value }
                                                })}
                                                placeholder="Especifique el disco duro"
                                            />
                                        )}
                                    </label>
                                </div>
                                <div className="form-row-modal">
                                    <label className="form-label-modal">
                                        <FaTag /> Modelo
                                        <input 
                                            name="modelo" 
                                            value={newMaintenanceData?.modelo || ''} 
                                            onChange={handleFormChange} 
                                            placeholder="Modelo del equipo"
                                        />
                                    </label>
                                    <label className="form-label-modal">
                                        <FaTag /> Serial
                                        <input 
                                            name="serial" 
                                            value={newMaintenanceData?.serial || ''} 
                                            onChange={handleFormChange} 
                                            placeholder="Número de serie del equipo"
                                        />
                                    </label>
                                </div>
                                <div className="form-row-modal">
                                    <label className="form-label-modal">
                                        <FaTag /> Licencia
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
                                                    target: { name: 'licencia', value: e.target.value }
                                                })}
                                                placeholder="Especifique la licencia"
                                            />
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Características Específicas */}
                        <div className="info-section-modal">
                            <div className="section-header-modal">
                                <FaInfoCircle className="section-icon-modal" />
                                <h4>Características Específicas</h4>
                            </div>
                            <div className="form-section-modal">
                                <div className="form-group-modal">
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
                        </div>

                        {/* Detalles del Servicio */}
                        <div className="info-section-modal">
                            <div className="section-header-modal">
                                <FaFileAlt className="section-icon-modal" />
                                <h4>Detalles del Servicio</h4>
                            </div>
                            <div className="service-form-premium">
                                <div className="form-group-premium">
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
                                <div className="form-group-premium">
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
                        </div>

                        {/* Cronograma de Mantenimiento */}
                        <div className="info-section-modal">
                            <div className="section-header-modal">
                                <FaCalendarAlt className="section-icon-modal" />
                                <h4>Cronograma de Mantenimiento</h4>
                            </div>
                            <div className="dates-form-premium">
                                <div className="form-row-premium">
                                    <label className="form-label-premium">
                                        <FaCalendarAlt /> Fecha de Elaboración
                                        <input type="date" name="fecha_de_elaboracion" value={newMaintenanceData?.fecha_de_elaboracion || ''} onChange={handleFormChange} />
                                    </label>
                                    <label className="form-label-premium">
                                        <FaCalendarAlt /> Fecha de Ejecución
                                        <input type="date" name="fecha_de_ejecucion" value={newMaintenanceData?.fecha_de_ejecucion || ''} onChange={handleFormChange} />
                                    </label>
                                </div>
                                <div className="form-row-premium">
                                    <label className="form-label-premium">
                                        <FaCalendarAlt /> Último Mantenimiento
                                        <input type="date" name="fecha_ultimo_mantenimiento" value={newMaintenanceData?.fecha_ultimo_mantenimiento || ''} onChange={handleFormChange} />
                                    </label>
                                    <label className="form-label-premium">
                                        <FaCalendarAlt /> Próximo Mantenimiento
                                        <input type="date" name="fecha_actual_de_mantenimiento" value={newMaintenanceData?.fecha_actual_de_mantenimiento || ''} onChange={handleFormChange} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna lateral con firmas */}
                    <div className="maintenance-sidebar">
                        {/* Firmas */}
                        <div className="sidebar-section-modal">
                            <div className="section-header-modal">
                                <FaSignature className="section-icon-modal" />
                                <h4>Firmas del Mantenimiento</h4>
                            </div>
                            <div className="signatures-form-premium">
                                <div className="signature-options-premium">
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
                                    <div className="signature-inputs-premium">
                                        <input name="firmas_tecnico" placeholder="Nombre del técnico" value={newMaintenanceData?.firmas_tecnico || ''} onChange={handleFormChange} />
                                        <input name="firmas_aprobo" placeholder="Nombre de quien aprueba" value={newMaintenanceData?.firmas_aprobo || ''} onChange={handleFormChange} />
                                        <input name="firmas_reviso" placeholder="Nombre de quien revisa" value={newMaintenanceData?.firmas_reviso || ''} onChange={handleFormChange} />
                                    </div>
                                ) : (
                                    <div className="signature-upload-premium">
                                        <div className="upload-group">
                                            <label>Firma Técnico</label>
                                            <input type="file" accept="image/*" onChange={(e) => handleNewSignatureImageChange(e, 'firmas_tecnico')} />
                                            {newMaintenanceData?.firmas_tecnico && <img src={newMaintenanceData.firmas_tecnico} alt="Vista previa de la firma" className="signature-display-premium" />}
                                        </div>
                                        <div className="upload-group">
                                            <label>Firma Aprobó</label>
                                            <input type="file" accept="image/*" onChange={(e) => handleNewSignatureImageChange(e, 'firmas_aprobo')} />
                                            {newMaintenanceData?.firmas_aprobo && <img src={newMaintenanceData.firmas_aprobo} alt="Vista previa de la firma" className="signature-display-premium" />}
                                        </div>
                                        <div className="upload-group">
                                            <label>Firma Revisó</label>
                                            <input type="file" accept="image/*" onChange={(e) => handleNewSignatureImageChange(e, 'firmas_reviso')} />
                                            {newMaintenanceData?.firmas_reviso && <img src={newMaintenanceData.firmas_reviso} alt="Vista previa de la firma" className="signature-display-premium" />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="create-modal-actions">
                    <button type="button" className="action-btn-modal save" onClick={handleSaveNew}>
                        <FaCheckCircle /> Crear Mantenimiento
                    </button>
                    <button type="button" className="action-btn-modal cancel" onClick={handleCancel}>
                        <FaTimes /> Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateMaintenanceModal;
