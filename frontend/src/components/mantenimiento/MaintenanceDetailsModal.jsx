import React from 'react';
import { FaTimes, FaUser, FaBuilding, FaDesktop, FaTag, FaCalendarAlt, FaTools, FaFileAlt, FaSignature, FaDownload, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { generateReport } from '../../utils/reportGenerator';
import './MaintenanceDetailsModal.css';

// Configuración para el calendario en español
moment.updateLocale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    week: {
        dow: 1, // Monday is the first day of the week.
    },
    longDateFormat: {
        LL: 'D [de] MMMM [de] YYYY',
    }
});
const localizer = momentLocalizer(moment);

const MaintenanceDetailsModal = ({ 
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
    signatureType, 
    setSignatureType, 
    handleSignatureImageChange, 
    handleNewSignatureImageChange, 
    equipos, 
    selectedEquipoId, 
    setSelectedEquipoId,
    formatDate,
    calendarEvents,
    calendarDate,
    setCalendarDate
}) => {
    if (!isOpen) return null;

    const getStatusBadge = (estado) => {
        const statusClass = estado?.toLowerCase().replace(' ', '-') || 'pendiente';
        const statusIcon = estado === 'Terminado' ? <FaCheckCircle /> : estado === 'En ejecución' ? <FaClock /> : <FaExclamationTriangle />;
        return (
            <span className={`status-badge-modal ${statusClass}`}>
                {statusIcon} {estado || 'Pendiente'}
            </span>
        );
    };

    return (
        <div className="maintenance-details-modal" onClick={onClose}>
            <div className="maintenance-details-panel" onClick={(e) => e.stopPropagation()}>
                <button className="close-maintenance-modal-btn" onClick={onClose}><FaTimes /></button>
                
                {loadingDetails ? (
                    <div className="loading-message">Cargando detalles del mantenimiento...</div>
                ) : detailedData ? (
                    <>
                        {/* Encabezado con información resumida */}
                        <div className="maintenance-modal-header">
                            <div className="maintenance-header-info">
                                <div className="maintenance-id-badge">
                                    <span className="id-label">ID Mantenimiento</span>
                                    <span className="id-value">#{detailedData.id}</span>
                                </div>
                                <div className="maintenance-user-info">
                                    <div className="user-name">{detailedData.usuario}</div>
                                    <div className="user-area">{detailedData.area}</div>
                                </div>
                                <div className="maintenance-status">
                                    {getStatusBadge(detailedData.estado)}
                                </div>
                            </div>
                            <div className="maintenance-actions">
                                {isEditing ? (
                                    <>
                                        <button type="button" className="action-btn-modal save" onClick={handleSave}>
                                            <FaCheckCircle /> Guardar Cambios
                                        </button>
                                        <button type="button" className="action-btn-modal cancel" onClick={handleCancel}>
                                            <FaTimes /> Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="action-btn-modal edit" onClick={handleEdit}>
                                            <FaTools /> Editar
                                        </button>
                                        <button type="button" className="action-btn-modal delete" onClick={handleDelete}>
                                            <FaExclamationTriangle /> Eliminar
                                        </button>
                                        <button type="button" className="action-btn-modal download" onClick={handleDownloadPdf}>
                                            <FaDownload /> PDF
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="maintenance-content">
                            <div className="maintenance-main-content">
                                {/* Información del Equipo */}
                                <div className="info-section-modal">
                                    <div className="section-header-modal">
                                        <FaDesktop className="section-icon-modal" />
                                        <h4>Información del Equipo</h4>
                                    </div>
                                    {isEditing ? (
                                        <div className="form-section-modal">
                                            <div className="form-row-modal">
                                                <label className="form-label-modal">
                                                    <FaUser /> Usuario
                                                    <input name="usuario" value={editFormData.usuario || ''} onChange={handleFormChange} placeholder="Nombre del usuario" />
                                                </label>
                                                <label className="form-label-modal">
                                                    <FaBuilding /> Área
                                                    <input name="area" value={editFormData.area || ''} onChange={handleFormChange} placeholder="Área del equipo" />
                                                </label>
                                            </div>
                                            <div className="form-row-modal">
                                                <label className="form-label-modal">
                                                    <FaTools /> Tipo de Equipo
                                                    <input name="tipo" value={editFormData.tipo || ''} onChange={handleFormChange} placeholder="Tipo de equipo" />
                                                </label>
                                                <label className="form-label-modal">
                                                    <FaTag /> Marca
                                                    <input name="marca" value={editFormData.marca || ''} onChange={handleFormChange} placeholder="Marca del equipo" />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
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
                                                <div className="info-icon-modal"><FaTools /></div>
                                                <div className="info-content-modal">
                                                    <span className="info-label-modal">Tipo</span>
                                                    <span className="info-value-modal">{detailedData.tipo}</span>
                                                </div>
                                            </div>
                                            <div className="info-card-modal">
                                                <div className="info-icon-modal"><FaTag /></div>
                                                <div className="info-content-modal">
                                                    <span className="info-label-modal">Marca</span>
                                                    <span className="info-value-modal">{detailedData.marca || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="info-card-modal">
                                                <div className="info-icon-modal"><FaDesktop /></div>
                                                <div className="info-content-modal">
                                                    <span className="info-label-modal">Sistema Operativo</span>
                                                    <span className="info-value-modal">{detailedData.sistema_operativo || detailedData.os || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="info-card-modal">
                                                <div className="info-icon-modal"><FaTag /></div>
                                                <div className="info-content-modal">
                                                    <span className="info-label-modal">Procesador</span>
                                                    <span className="info-value-modal">{detailedData.procesador || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="info-card-modal">
                                                <div className="info-icon-modal"><FaTag /></div>
                                                <div className="info-content-modal">
                                                    <span className="info-label-modal">RAM</span>
                                                    <span className="info-value-modal">{detailedData.memoria_ram || detailedData.ram || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="info-card-modal">
                                                <div className="info-icon-modal"><FaTag /></div>
                                                <div className="info-content-modal">
                                                    <span className="info-label-modal">Disco Duro</span>
                                                    <span className="info-value-modal">{detailedData.disco_duro || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Detalles del Servicio */}
                                <div className="info-section-modal">
                                    <div className="section-header-modal">
                                        <FaFileAlt className="section-icon-modal" />
                                        <h4>Detalles del Servicio</h4>
                                    </div>
                                    {isEditing ? (
                                        <div className="service-form-premium">
                                            <div className="form-group-premium">
                                                <label>Actividades Realizadas</label>
                                                <textarea 
                                                    name="actividades_realizadas" 
                                                    value={editFormData.actividades_realizadas || ''} 
                                                    onChange={handleFormChange} 
                                                    rows="5"
                                                    placeholder="Describa las actividades realizadas durante el mantenimiento..."
                                                ></textarea>
                                            </div>
                                            <div className="form-group-premium">
                                                <label>Observaciones</label>
                                                <textarea 
                                                    name="observaciones" 
                                                    value={editFormData.observaciones || ''} 
                                                    onChange={handleFormChange} 
                                                    rows="3"
                                                    placeholder="Ingrese observaciones o comentarios adicionales..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="service-details-modal">
                                            <div className="service-item-modal">
                                                <div className="service-label-modal">Actividades Realizadas</div>
                                                <div className="service-content-modal">
                                                    {detailedData.actividades_realizadas || 'No se registraron actividades realizadas.'}
                                                </div>
                                            </div>
                                            <div className="service-item-modal">
                                                <div className="service-label-modal">Observaciones</div>
                                                <div className="service-content-modal obs">
                                                    {detailedData.observaciones || 'Sin observaciones adicionales.'}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Cronograma de Mantenimiento */}
                                <div className="info-section-modal">
                                    <div className="section-header-modal">
                                        <FaCalendarAlt className="section-icon-modal" />
                                        <h4>Cronograma de Mantenimiento</h4>
                                    </div>
                                    {isEditing ? (
                                        <div className="dates-form-premium">
                                            <div className="form-row-premium">
                                                <label className="form-label-premium">
                                                    <FaCalendarAlt /> Fecha de Elaboración
                                                    <input type="date" name="fecha_de_elaboracion" value={editFormData.fecha_de_elaboracion && moment(editFormData.fecha_de_elaboracion).isValid() ? moment(editFormData.fecha_de_elaboracion).format('YYYY-MM-DD') : ''} onChange={handleFormChange} />
                                                </label>
                                                <label className="form-label-premium">
                                                    <FaCalendarAlt /> Fecha de Ejecución
                                                    <input type="date" name="fecha_de_ejecucion" value={editFormData.fecha_de_ejecucion && moment(editFormData.fecha_de_ejecucion).isValid() ? moment(editFormData.fecha_de_ejecucion).format('YYYY-MM-DD') : ''} onChange={handleFormChange} />
                                                </label>
                                            </div>
                                            <div className="form-row-premium">
                                                <label className="form-label-premium">
                                                    <FaCalendarAlt /> Último Mantenimiento
                                                    <input type="date" name="fecha_ultimo_mantenimiento" value={editFormData.fecha_ultimo_mantenimiento && moment(editFormData.fecha_ultimo_mantenimiento).isValid() ? moment(editFormData.fecha_ultimo_mantenimiento).format('YYYY-MM-DD') : ''} onChange={handleFormChange} />
                                                </label>
                                                <label className="form-label-premium">
                                                    <FaCalendarAlt /> Próximo Mantenimiento
                                                    <input type="date" name="fecha_actual_de_mantenimiento" value={editFormData.fecha_actual_de_mantenimiento && moment(editFormData.fecha_actual_de_mantenimiento).isValid() ? moment(editFormData.fecha_actual_de_mantenimiento).format('YYYY-MM-DD') : ''} onChange={handleFormChange} />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="dates-grid-modal">
                                            <div className="date-card-modal elaboration">
                                                <div className="date-icon-modal"><FaCalendarAlt /></div>
                                                <div className="date-content-modal">
                                                    <span className="date-label-modal">Elaboración</span>
                                                    <span className="date-value-modal">{formatDate(detailedData.fecha_de_elaboracion)}</span>
                                                </div>
                                            </div>
                                            <div className="date-card-modal execution">
                                                <div className="date-icon-modal"><FaCalendarAlt /></div>
                                                <div className="date-content-modal">
                                                    <span className="date-label-modal">Ejecución</span>
                                                    <span className="date-value-modal">{formatDate(detailedData.fecha_de_ejecucion)}</span>
                                                </div>
                                            </div>
                                            <div className="date-card-modal last">
                                                <div className="date-icon-modal"><FaCalendarAlt /></div>
                                                <div className="date-content-modal">
                                                    <span className="date-label-modal">Último Mant.</span>
                                                    <span className="date-value-modal">{formatDate(detailedData.fecha_ultimo_mantenimiento)}</span>
                                                </div>
                                            </div>
                                            <div className="date-card-modal next">
                                                <div className="date-icon-modal"><FaCalendarAlt /></div>
                                                <div className="date-content-modal">
                                                    <span className="date-label-modal">Próximo Mant.</span>
                                                    <span className="date-value-modal">{formatDate(detailedData.fecha_actual_de_mantenimiento)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Columna lateral con calendario y firmas */}
                            <div className="maintenance-sidebar">
                                {/* Calendario */}
                                <div className="sidebar-section-modal">
                                    <div className="section-header-modal">
                                        <FaCalendarAlt className="section-icon-modal" />
                                        <h4>Calendario de Eventos</h4>
                                    </div>
                                    <div className="calendar-container-modal">
                                        <Calendar
                                            localizer={localizer}
                                            events={calendarEvents}
                                            startAccessor="start"
                                            endAccessor="end"
                                            style={{ height: 280 }}
                                            toolbar={true}
                                            date={calendarDate}
                                            onNavigate={(date) => setCalendarDate(date)}
                                            views={['month']}
                                            messages={{ next: "Siguiente", previous: "Anterior", today: "Hoy", month: "Mes" }}
                                        />
                                    </div>
                                </div>

                                {/* Firmas */}
                                <div className="sidebar-section-modal">
                                    <div className="section-header-modal">
                                        <FaSignature className="section-icon-modal" />
                                        <h4>Firmas del Mantenimiento</h4>
                                    </div>
                                    {isEditing ? (
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
                                                    <input name="firmas_tecnico" placeholder="Nombre del técnico" value={editFormData.firmas_tecnico || ''} onChange={handleFormChange} />
                                                    <input name="firmas_aprobo" placeholder="Nombre de quien aprueba" value={editFormData.firmas_aprobo || ''} onChange={handleFormChange} />
                                                    <input name="firmas_reviso" placeholder="Nombre de quien revisa" value={editFormData.firmas_reviso || ''} onChange={handleFormChange} />
                                                </div>
                                            ) : (
                                                <div className="signature-upload-premium">
                                                    <div className="upload-group">
                                                        <label>Firma Técnico</label>
                                                        <input type="file" accept="image/*" onChange={(e) => handleSignatureImageChange(e, 'firmas_tecnico')} />
                                                        {editFormData.firmas_tecnico && <img src={editFormData.firmas_tecnico} alt="Vista previa de la firma" className="signature-display-premium" />}
                                                    </div>
                                                    <div className="upload-group">
                                                        <label>Firma Aprobó</label>
                                                        <input type="file" accept="image/*" onChange={(e) => handleSignatureImageChange(e, 'firmas_aprobo')} />
                                                        {editFormData.firmas_aprobo && <img src={editFormData.firmas_aprobo} alt="Vista previa de la firma" className="signature-display-premium" />}
                                                    </div>
                                                    <div className="upload-group">
                                                        <label>Firma Revisó</label>
                                                        <input type="file" accept="image/*" onChange={(e) => handleSignatureImageChange(e, 'firmas_reviso')} />
                                                        {editFormData.firmas_reviso && <img src={editFormData.firmas_reviso} alt="Vista previa de la firma" className="signature-display-premium" />}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="signatures-grid-premium">
                                            <div className="signature-card-premium">
                                                <div className="signature-header-premium">
                                                    <FaSignature className="signature-icon-premium" />
                                                    <span>Técnico</span>
                                                </div>
                                                <div className="signature-box-premium">
                                                    {detailedData.firmas_tecnico ? (
                                                        detailedData.firmas_tecnico.startsWith('data:image')
                                                            ? <img src={detailedData.firmas_tecnico} alt="Firma del técnico" className="signature-display-premium" />
                                                            : <p className="signature-text-premium">{detailedData.firmas_tecnico}</p>
                                                    ) : <p className="muted-premium">Sin firma</p>}
                                                </div>
                                            </div>
                                            <div className="signature-card-premium">
                                                <div className="signature-header-premium">
                                                    <FaSignature className="signature-icon-premium" />
                                                    <span>Aprobó</span>
                                                </div>
                                                <div className="signature-box-premium">
                                                    {detailedData.firmas_aprobo ? (
                                                        detailedData.firmas_aprobo.startsWith('data:image')
                                                            ? <img src={detailedData.firmas_aprobo} alt="Firma de quien aprueba" className="signature-display-premium" />
                                                            : <p className="signature-text-premium">{detailedData.firmas_aprobo}</p>
                                                    ) : <p className="muted-premium">Sin firma</p>}
                                                </div>
                                            </div>
                                            <div className="signature-card-premium">
                                                <div className="signature-header-premium">
                                                    <FaSignature className="signature-icon-premium" />
                                                    <span>Revisó</span>
                                                </div>
                                                <div className="signature-box-premium">
                                                    {detailedData.firmas_reviso ? (
                                                        detailedData.firmas_reviso.startsWith('data:image')
                                                            ? <img src={detailedData.firmas_reviso} alt="Firma de quien revisa" className="signature-display-premium" />
                                                            : <p className="signature-text-premium">{detailedData.firmas_reviso}</p>
                                                    ) : <p className="muted-premium">Sin firma</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="error-message-modal">No se pudieron cargar los detalles del mantenimiento.</div>
                )}
            </div>
        </div>
    );
};

export default MaintenanceDetailsModal;
