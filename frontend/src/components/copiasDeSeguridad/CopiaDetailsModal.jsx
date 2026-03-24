import React from 'react';
import { FaTimes, FaUser, FaBuilding, FaDesktop, FaTag, FaCalendarAlt, FaTools, FaFileAlt, FaShieldAlt, FaDownload, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { generateReport } from '../../utils/reportGenerator';
import './CopiaDetailsModal.css';

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

const CopiaDetailsModal = ({ 
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
    formatDate,
    calendarEvents,
    calendarDate,
    setCalendarDate
}) => {
    if (!isOpen) return null;

    const getStatusBadge = (estado) => {
        const statusClass = estado?.toLowerCase().replace(' ', '-') || 'pendiente';
        const statusIcon = estado === 'Exitosa' ? <FaCheckCircle /> : estado === 'En Progreso' ? <FaClock /> : <FaExclamationTriangle />;
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
                    <div className="loading-message">Cargando detalles de la copia de seguridad...</div>
                ) : detailedData ? (
                    <>
                        {/* Encabezado con información resumida */}
                        <div className="maintenance-modal-header">
                            <div className="maintenance-header-info">
                                <div className="maintenance-id-badge">
                                    <span className="id-label">ID Copia de Seguridad</span>
                                    <span className="id-value">#{detailedData.id}</span>
                                </div>
                                <div className="maintenance-user-info">
                                    <div className="user-name">{detailedData.usuario}</div>
                                    <div className="user-area">{detailedData.area}</div>
                                </div>
                                <div className="maintenance-status">
                                    {getStatusBadge(detailedData.estado_copia)}
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
                                                    <span className="info-label-modal">Código Inventario</span>
                                                    <span className="info-value-modal">{detailedData.codigo || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Detalles de la Copia de Seguridad */}
                                <div className="info-section-modal">
                                    <div className="section-header-modal">
                                        <FaShieldAlt className="section-icon-modal" />
                                        <h4>Detalles de la Copia de Seguridad</h4>
                                    </div>
                                    {isEditing ? (
                                        <div className="service-form-premium">
                                            <div className="form-group-premium">
                                                <label>Tipo de Copia</label>
                                                <select name="tipo_copia" value={editFormData.tipo_copia || 'Completa'} onChange={handleFormChange}>
                                                    <option value="Completa">Completa</option>
                                                    <option value="Incremental">Incremental</option>
                                                    <option value="Diferencial">Diferencial</option>
                                                </select>
                                            </div>
                                            <div className="form-group-premium">
                                                <label>Ubicación de Almacenamiento</label>
                                                <input name="ubicacion_almacenamiento" value={editFormData.ubicacion_almacenamiento || ''} onChange={handleFormChange} placeholder="Disco externo, servidor, nube..." />
                                            </div>
                                            <div className="form-group-premium">
                                                <label>Tamaño de Datos</label>
                                                <input name="tamaño_datos" value={editFormData.tamaño_datos || ''} onChange={handleFormChange} placeholder="Ej: 500GB, 1.2TB" />
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
                                                <div className="service-label-modal">Tipo de Copia</div>
                                                <div className="service-content-modal">
                                                    {detailedData.tipo_copia || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="service-item-modal">
                                                <div className="service-label-modal">Ubicación de Almacenamiento</div>
                                                <div className="service-content-modal">
                                                    {detailedData.ubicacion_almacenamiento || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="service-item-modal">
                                                <div className="service-label-modal">Tamaño de Datos</div>
                                                <div className="service-content-modal">
                                                    {detailedData.tamaño_datos || 'N/A'}
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

                                {/* Cronograma de Copia */}
                                <div className="info-section-modal">
                                    <div className="section-header-modal">
                                        <FaCalendarAlt className="section-icon-modal" />
                                        <h4>Cronograma de Copia</h4>
                                    </div>
                                    {isEditing ? (
                                        <div className="dates-form-premium">
                                            <div className="form-row-premium">
                                                <label className="form-label-premium">
                                                    <FaCalendarAlt /> Fecha de Copia
                                                    <input type="date" name="fecha" value={editFormData.fecha && moment(editFormData.fecha).isValid() ? moment(editFormData.fecha).format('YYYY-MM-DD') : ''} onChange={handleFormChange} />
                                                </label>
                                                <label className="form-label-premium">
                                                    <FaCalendarAlt /> Estado
                                                    <select name="estado_copia" value={editFormData.estado_copia || 'Pendiente'} onChange={handleFormChange}>
                                                        <option value="Pendiente">Pendiente</option>
                                                        <option value="En Progreso">En Progreso</option>
                                                        <option value="Exitosa">Exitosa</option>
                                                        <option value="Fallida">Fallida</option>
                                                    </select>
                                                </label>
                                            </div>
                                            <div className="form-row-premium">
                                                <label className="form-label-premium">
                                                    <FaCalendarAlt /> Hora Inicio
                                                    <input type="time" name="hora_inicio" value={editFormData.hora_inicio || ''} onChange={handleFormChange} />
                                                </label>
                                                <label className="form-label-premium">
                                                    <FaCalendarAlt /> Hora Fin
                                                    <input type="time" name="hora_fin" value={editFormData.hora_fin || ''} onChange={handleFormChange} />
                                                </label>
                                            </div>
                                            <div className="form-row-premium">
                                                <label className="form-label-premium">
                                                    <FaCalendarAlt /> Tiempo de Duración
                                                    <input name="tiempo_duracion" value={editFormData.tiempo_duracion || ''} onChange={handleFormChange} placeholder="Ej: 2h 30min" />
                                                </label>
                                                <label className="form-label-premium">
                                                    <FaCalendarAlt /> Responsable
                                                    <input name="responsable" value={editFormData.responsable || ''} onChange={handleFormChange} placeholder="Persona que realizó la copia" />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="dates-grid-modal">
                                            <div className="date-card-modal elaboration">
                                                <div className="date-icon-modal"><FaCalendarAlt /></div>
                                                <div className="date-content-modal">
                                                    <span className="date-label-modal">Fecha de Copia</span>
                                                    <span className="date-value-modal">{formatDate(detailedData.fecha)}</span>
                                                </div>
                                            </div>
                                            <div className="date-card-modal execution">
                                                <div className="date-icon-modal"><FaCalendarAlt /></div>
                                                <div className="date-content-modal">
                                                    <span className="date-label-modal">Estado</span>
                                                    <span className="date-value-modal">{detailedData.estado_copia || 'Pendiente'}</span>
                                                </div>
                                            </div>
                                            <div className="date-card-modal last">
                                                <div className="date-icon-modal"><FaCalendarAlt /></div>
                                                <div className="date-content-modal">
                                                    <span className="date-label-modal">Hora Inicio</span>
                                                    <span className="date-value-modal">{detailedData.hora_inicio || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="date-card-modal next">
                                                <div className="date-icon-modal"><FaCalendarAlt /></div>
                                                <div className="date-content-modal">
                                                    <span className="date-label-modal">Hora Fin</span>
                                                    <span className="date-value-modal">{detailedData.hora_fin || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="date-card-modal">
                                                <div className="date-icon-modal"><FaCalendarAlt /></div>
                                                <div className="date-content-modal">
                                                    <span className="date-label-modal">Duración</span>
                                                    <span className="date-value-modal">{detailedData.tiempo_duracion || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="date-card-modal">
                                                <div className="date-icon-modal"><FaCalendarAlt /></div>
                                                <div className="date-content-modal">
                                                    <span className="date-label-modal">Responsable</span>
                                                    <span className="date-value-modal">{detailedData.responsable || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Columna lateral con calendario y equipo */}
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

                                {/* Información del Equipo (versión resumida) */}
                                <div className="sidebar-section-modal">
                                    <div className="section-header-modal">
                                        <FaDesktop className="section-icon-modal" />
                                        <h4>Resumen del Equipo</h4>
                                    </div>
                                    <div className="signatures-grid-premium">
                                        <div className="signature-card-premium">
                                            <div className="signature-header-premium">
                                                <FaDesktop className="signature-icon-premium" />
                                                <span>Equipo</span>
                                            </div>
                                            <div className="signature-box-premium">
                                                <p className="signature-text-premium">{detailedData.tipo} - {detailedData.marca}</p>
                                            </div>
                                        </div>
                                        <div className="signature-card-premium">
                                            <div className="signature-header-premium">
                                                <FaTag className="signature-icon-premium" />
                                                <span>Código</span>
                                            </div>
                                            <div className="signature-box-premium">
                                                <p className="signature-text-premium">{detailedData.codigo || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="signature-card-premium">
                                            <div className="signature-header-premium">
                                                <FaUser className="signature-icon-premium" />
                                                <span>Usuario</span>
                                            </div>
                                            <div className="signature-box-premium">
                                                <p className="signature-text-premium">{detailedData.usuario}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="error-message-modal">No se pudieron cargar los detalles de la copia de seguridad.</div>
                )}
            </div>
        </div>
    );
};

export default CopiaDetailsModal;