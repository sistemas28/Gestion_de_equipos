import React, { useEffect, useState } from "react";
import './copiasPage.css';
import api from '../../api/axios';
import moment from 'moment';
import 'moment/locale/es';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaTimes } from 'react-icons/fa';
import { FaCalendarAlt, FaHistory, FaDownload, FaTrash, FaPlus, FaSearch, FaSync, FaShieldAlt } from 'react-icons/fa';
import useIsMobile from '../../hooks/useIsMobile';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateReport } from '../../utils/reportGenerator';

// Configuración para el calendario en español
moment.updateLocale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
    week: {
        dow: 1, // Lunes es el primer día de la semana.
    },
});
const localizer = momentLocalizer(moment);

const CopiasPage = () => {
    const isMobile = useIsMobile();
    const [copiasData, setCopiasData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [selectedItem, setSelectedItem] = useState(null);
    const [detailedData, setDetailedData] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editCopiaData, setEditCopiaData] = useState(null);
    const [newCopiaData, setNewCopiaData] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [selectedEquipoId, setSelectedEquipoId] = useState('');
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [historialView, setHistorialView] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
    const [filtroFechaFin, setFiltroFechaFin] = useState('');
    const [estadisticas, setEstadisticas] = useState(null);

    useEffect(() => {
        fetchCopiasData();
        fetchEquipos();
    }, []);

    async function fetchEquipos() {
        try {
            const response = await api.get('/equipos');
            setEquipos(response.data.body || []);
        } catch (err) {
            console.error("Error fetching equipos:", err);
            // No es un error fatal para la vista principal, solo para la creación/edición.
        }
    }

    async function fetchCopiasData() {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/CopiasDeSeguridad'); // Endpoint from DOCUMENTATION.md
            setCopiasData(response.data.body || []);
        } catch (err) {
            console.error("Error fetching copias de seguridad data:", err);
            setError("Error al cargar los datos de copias de seguridad. Por favor, inténtalo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    }

    function handleRowClick(item) {
        if (selectedItem && selectedItem.id === item.id) {
            setSelectedItem(null);
            setDetailedData(null);
            return;
        }
        setSelectedItem(item);
        // No es necesario hacer otra llamada a la API, ya tenemos los datos.
        setDetailedData(item);
        if (item.fecha) {
            setCalendarDate(new Date(item.fecha));
        } else {
            setCalendarDate(new Date());
        }
    }


    const handleOpenAddModal = () => {
        setNewCopiaData({
            usuario: '',
            area: '',
            tipo: '',
            marca: '',
            codigo: '',
            fecha: moment().format('YYYY-MM-DD'),
            estado_copia: 'Pendiente',
            hora_inicio: '',
            hora_fin: '',
            tipo_copia: 'Completa',
            ubicacion_almacenamiento: '',
            tamaño_datos: '',
            tiempo_duracion: '',
            observaciones: '',
            responsable: '',
        });
        setSelectedEquipoId('');
        setSelectedItem(null);
        setDetailedData(null);
        setIsAdding(true);
    };

    const handleNewFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "equipoId") {
            setSelectedEquipoId(value);
            const selectedEquipo = equipos.find(eq => eq.id === parseInt(value));
            if (selectedEquipo) {
                setNewCopiaData(prev => ({
                    ...prev,
                    usuario: selectedEquipo.usuario,
                    area: selectedEquipo.area,
                    tipo: selectedEquipo.tipo,
                    marca: selectedEquipo.marca,
                    codigo: selectedEquipo.codigo,
                }));
            } else {
                setNewCopiaData(prev => ({ ...prev, usuario: '', area: '', tipo: '', marca: '', codigo: '' }));
            }
        } else {
            setNewCopiaData(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleSaveNew = async (e) => {
        e.preventDefault();
        if (!selectedEquipoId) {
            setError("Por favor, selecciona un equipo para asociar la copia de seguridad.");
            return;
        }
        const selectedEquipo = equipos.find(eq => eq.id === parseInt(selectedEquipoId));
        if (!selectedEquipo || !selectedEquipo.codigo) {
            setError("El equipo seleccionado no tiene un código de inventario válido.");
            return;
        }
        const dataToSend = {
            ...newCopiaData,
            equipo_id: parseInt(selectedEquipoId, 10)
        };
        await api.post('/CopiasDeSeguridad', dataToSend);
        setIsAdding(false);
        fetchCopiasData();
    };


    const handleEdit = (item) => {
        // Crear una copia completa de los datos del item para editar
        setEditCopiaData({
            id: item.id,
            usuario: item.usuario || '',
            area: item.area || '',
            tipo: item.tipo || '',
            marca: item.marca || '',
            codigo: item.codigo || '',
            fecha: item.fecha ? item.fecha.split('T')[0] : '',
            estado_copia: item.estado_copia || 'Pendiente',
            hora_inicio: item.hora_inicio || '',
            hora_fin: item.hora_fin || '',
            tipo_copia: item.tipo_copia || 'Completa',
            ubicacion_almacenamiento: item.ubicacion_almacenamiento || '',
            tamaño_datos: item.tamaño_datos || '',
            tiempo_duracion: item.tiempo_duracion || '',
            observaciones: item.observaciones || '',
            responsable: item.responsable || '',
            equipo_id: item.equipo_id || null
        });
        setSelectedEquipoId(item.equipo_id ? item.equipo_id.toString() : '');
        setIsEditing(true);
        setIsAdding(false);
    };


    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "equipoId") {
            setSelectedEquipoId(value);
            const selectedEquipo = equipos.find(eq => eq.id === parseInt(value));
            if (selectedEquipo) {
                // Solo actualizar los campos del equipo si se selecciona uno nuevo
                setEditCopiaData(prev => ({
                    ...prev,
                    usuario: selectedEquipo.usuario,
                    area: selectedEquipo.area,
                    tipo: selectedEquipo.tipo,
                    marca: selectedEquipo.marca,
                    codigo: selectedEquipo.codigo,
                }));
            } else {
                // Si no se selecciona equipo, mantener los valores actuales (no sobrescribir con undefined)
                // Los valores del equipo original se mantienen
            }
        } else {
            // Actualizar cualquier otro campo normalmente
            setEditCopiaData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editCopiaData || !editCopiaData.id) return;

        const dataToSend = {
            ...editCopiaData,
            equipo_id: selectedEquipoId ? parseInt(selectedEquipoId, 10) : null
        };

        try {
            await api.put(`/CopiasDeSeguridad/${editCopiaData.id}`, dataToSend);
            setIsEditing(false);
            setEditCopiaData(null);
            setSelectedEquipoId('');
            fetchCopiasData();
        } catch (error) {
            console.error('Error al actualizar:', error);
            setError('Error al actualizar la copia de seguridad.');
        }
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar la copia de seguridad #${item.id}?`)) {
            return;
        }

        try {
            await api.delete(`/CopiasDeSeguridad/${item.id}`);
            setSelectedItem(null);
            setDetailedData(null);
            fetchCopiasData();
        } catch (error) {
            console.error('Error al eliminar:', error);
            setError('Error al eliminar la copia de seguridad.');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/CopiasDeSeguridad/${id}`, {
                estado_copia: newStatus
            });
            await fetchCopiasData();
        } catch (err) {
            console.error("Error updating status:", err);
            setError("Error al actualizar el estado de la copia de seguridad.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return moment(dateString).format('LL');
    };

    const calendarEvents = detailedData ? [
        detailedData.fecha && moment(detailedData.fecha).isValid() ? {
            title: `Copia #${detailedData.id}`,
            start: new Date(detailedData.fecha),
            end: new Date(detailedData.fecha),
            allDay: true,
        } : null,
    ].filter(Boolean) : [];

    const handleDownloadPdf = () => {
        if (!detailedData) return;

        const sections = [
            {
                type: 'info',
                title: 'INFORMACIÓN DEL EQUIPO',
                data: [
                    { label: 'CÓDIGO INVENTARIO', value: detailedData.codigo || detailedData.id || 'N/A' },
                    { label: 'USUARIO', value: detailedData.usuario || 'N/A' },
                    { label: 'ÁREA', value: detailedData.area || 'N/A' },
                    { label: 'TIPO DE EQUIPO', value: detailedData.tipo || 'N/A' },
                    { label: 'MARCA', value: detailedData.marca || 'N/A' },
                    { label: '', value: '' }
                ]
            },
            {
                type: 'info',
                title: 'DETALLES DE LA COPIA DE SEGURIDAD',
                data: [
                    { label: 'FECHA DE COPIA', value: formatDate(detailedData.fecha) },
                    { label: 'ESTADO', value: detailedData.estado_copia || 'N/A' },
                    { label: 'TIPO DE COPIA', value: detailedData.tipo_copia || 'N/A' },
                    { label: 'RESPONSABLE', value: detailedData.responsable || 'N/A' }
                ]
            },
            {
                type: 'info',
                title: 'TIEMPOS Y DURACIÓN',
                data: [
                    { label: 'HORA INICIO', value: detailedData.hora_inicio || 'N/A' },
                    { label: 'HORA FIN', value: detailedData.hora_fin || 'N/A' },
                    { label: 'TIEMPO DURACIÓN', value: detailedData.tiempo_duracion || 'N/A' },
                    { label: '', value: '' }
                ]
            },
            {
                type: 'info',
                title: 'ALMACENAMIENTO Y CAPACIDAD',
                data: [
                    { label: 'UBICACIÓN ALMACENAMIENTO', value: detailedData.ubicacion_almacenamiento || 'N/A' },
                    { label: 'TAMAÑO DE DATOS', value: detailedData.tamaño_datos || 'N/A' }
                ]
            }
        ];

        // Agregar observaciones si existen
        if (detailedData.observaciones && detailedData.observaciones.trim() !== '') {
            sections.push({
                type: 'info',
                title: 'OBSERVACIONES',
                data: [
                    { label: 'NOTAS', value: detailedData.observaciones }
                ]
            });
        }

        generateReport(
            'PROCESO DE GESTIÓN DE INFORMÁTICA',
            'REPORTE DE COPIA DE SEGURIDAD',
            'FT-COPIA-001',
            '1.0',
            sections,
            `Reporte_Copia_Seguridad_${detailedData.id}.pdf`
        );
    };

    return (
        <div className="copias-page">

            <div className="page-header">
                <h2 className="page-title">Gestión de Copias de Seguridad</h2>
                <div className="header-actions">
                    <button className="action-btn save" onClick={handleOpenAddModal} disabled={loading}>
                        Agregar Copia
                    </button>
                    <button className="action-btn" onClick={() => setHistorialView(!historialView)} disabled={loading}>
                        {historialView ? 'Vista Simple' : 'Historial Completo'}
                    </button>
                    <button className="refresh-btn" onClick={fetchCopiasData} disabled={loading}>
                        {loading ? 'Cargando...' : 'Actualizar Datos'}
                    </button>
                </div>
            </div>



            {error && <div className="error-message">{error}</div>}

            {/* Filtros Avanzados */}
            {historialView && (
                <div className="filters-section card">
                    <h3>Filtros de Historial</h3>
                    <div className="filters-grid">
                        <label>
                            Estado
                            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                                <option value="">Todos los estados</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="En Progreso">En Progreso</option>
                                <option value="Exitosa">Exitosa</option>
                                <option value="Fallida">Fallida</option>
                            </select>
                        </label>
                        <label>
                            Fecha Inicio
                            <input type="date" value={filtroFechaInicio} onChange={(e) => setFiltroFechaInicio(e.target.value)} />
                        </label>
                        <label>
                            Fecha Fin
                            <input type="date" value={filtroFechaFin} onChange={(e) => setFiltroFechaFin(e.target.value)} />
                        </label>
                        <button className="action-btn" onClick={() => {
                            setFiltroEstado('');
                            setFiltroFechaInicio('');
                            setFiltroFechaFin('');
                        }}>
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            )}

            {loading && copiasData.length === 0 && <div className="loading-message">Cargando datos de copias de seguridad...</div>}

            {!loading && copiasData.length === 0 && !error && (
                <div className="no-data-message">No hay datos de copias de seguridad disponibles.</div>
            )}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por ID (código) o usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {!loading && copiasData.length > 0 && (
                <div className="copias-table-container card">
                    <table>

                        <thead>
                            <tr>
                                {historialView ? (
                                    <>
                                        <th>ID</th>
                                        <th>Usuario</th>
                                        {!isMobile && <th>Área</th>}
                                        <th>Estado</th>
                                        {!isMobile && <th>Tipo Copia</th>}
                                        <th>Fecha</th>
                                        {!isMobile && <th>Hora Inicio</th>}
                                        {!isMobile && <th>Hora Fin</th>}
                                        {!isMobile && <th>Responsable</th>}
                                        {!isMobile && <th>Ubicación</th>}
                                    </>
                                ) : (
                                    <>
                                        <th>ID</th>
                                        <th>Usuario</th>
                                        {!isMobile && <th>Área</th>}
                                        <th>Estado</th>
                                        {!isMobile && <th>Tipo</th>}
                                        {!isMobile && <th>Marca</th>}
                                        <th>Fecha</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {copiasData
                                .filter(item => {
                                    // Filtro por término de búsqueda
                                    const matchesSearch = (item.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                                        (String(item.usuario || '').toLowerCase().includes(searchTerm.toLowerCase()));

                                    // Filtros de historial
                                    const matchesEstado = !filtroEstado || item.estado_copia === filtroEstado;
                                    const matchesFechaInicio = !filtroFechaInicio || new Date(item.fecha) >= new Date(filtroFechaInicio);
                                    const matchesFechaFin = !filtroFechaFin || new Date(item.fecha) <= new Date(filtroFechaFin);

                                    return matchesSearch && matchesEstado && matchesFechaInicio && matchesFechaFin;
                                })
                                .map((item) => (
                                    <tr key={item.id} onClick={() => handleRowClick(item)} className={selectedItem?.id === item.id ? 'selected' : ''}>
                                        {historialView ? (
                                            <>
                                                <td>{item.id}</td>
                                                <td>{item.usuario || 'N/A'}</td>
                                                {!isMobile && <td>{item.area}</td>}
                                                <td>
                                                    <select
                                                        className={`status-select ${(item.estado_copia || '').toLowerCase().replace(' ', '-')}`}
                                                        value={item.estado_copia || 'Pendiente'}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                                                    >
                                                        <option value="Pendiente">Pendiente</option>
                                                        <option value="En Progreso">En Progreso</option>
                                                        <option value="Exitosa">Exitosa</option>
                                                        <option value="Fallida">Fallida</option>
                                                    </select>
                                                </td>
                                                {!isMobile && <td>{item.tipo_copia || 'N/A'}</td>}
                                                <td>{formatDate(item.fecha)}</td>
                                                {!isMobile && <td>{item.hora_inicio || 'N/A'}</td>}
                                                {!isMobile && <td>{item.hora_fin || 'N/A'}</td>}
                                                {!isMobile && <td>{item.responsable || 'N/A'}</td>}
                                                {!isMobile && (
                                                    <td title={item.ubicacion_almacenamiento}>
                                                        {item.ubicacion_almacenamiento ?
                                                            (item.ubicacion_almacenamiento.length > 20 ?
                                                                item.ubicacion_almacenamiento.substring(0, 20) + '...' :
                                                                item.ubicacion_almacenamiento) : 'N/A'}
                                                    </td>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <td>{item.id}</td>
                                                <td>{item.usuario || 'N/A'}</td>
                                                {!isMobile && <td>{item.area}</td>}
                                                <td>
                                                    <select
                                                        className={`status-select ${(item.estado_copia || '').toLowerCase().replace(' ', '-')}`}
                                                        value={item.estado_copia || 'Pendiente'}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                                                    >
                                                        <option value="Pendiente">Pendiente</option>
                                                        <option value="En Progreso">En Progreso</option>
                                                        <option value="Exitosa">Exitosa</option>
                                                        <option value="Fallida">Fallida</option>
                                                    </select>
                                                </td>
                                                {!isMobile && <td>{item.tipo}</td>}
                                                {!isMobile && <td>{item.marca}</td>}
                                                <td>{formatDate(item.fecha)}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}




            {(selectedItem || isAdding || isEditing) && (
                <div className="details-modal" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setSelectedItem(null);
                        setIsAdding(false);
                        setIsEditing(false);
                    }
                }}>
                    <div className="details-panel card" onClick={(e) => e.stopPropagation()}>
                        <div className="details-header">
                            <h3>
                                {detailedData && !isEditing && !isAdding
                                    ? `Detalles de la Copia de Seguridad #${detailedData.id}`
                                    : isAdding
                                        ? 'Agregar Nueva Copia de Seguridad'
                                        : `Editar Copia de Seguridad #${editCopiaData?.id}`
                                }
                            </h3>
                            <div className="details-actions">
                                {detailedData && !isEditing && !isAdding ? (
                                    <>
                                        <button type="button" className="action-btn edit" onClick={() => handleEdit(detailedData)}>
                                            ✏️ Editar
                                        </button>
                                        <button type="button" className="action-btn delete" onClick={() => handleDelete(detailedData)}>
                                            🗑️ Eliminar
                                        </button>
                                        <button type="button" className="action-btn download" onClick={handleDownloadPdf}>
                                            📄 Descargar PDF
                                        </button>
                                    </>
                                ) : isAdding ? (
                                    <>
                                        <button type="button" className="action-btn save" onClick={handleSaveNew}>Guardar</button>
                                        <button type="button" className="action-btn cancel" onClick={() => setIsAdding(false)}>Cancelar</button>
                                    </>
                                ) : isEditing ? (
                                    <>
                                        <button type="button" className="action-btn save" onClick={handleSaveEdit}>Guardar Cambios</button>
                                        <button type="button" className="action-btn cancel" onClick={() => setIsEditing(false)}>Cancelar</button>
                                    </>
                                ) : null}
                                <button className="close-details-btn" onClick={() => {
                                    setSelectedItem(null);
                                    setIsAdding(false);
                                    setIsEditing(false);
                                }}><FaTimes /></button>
                            </div>
                        </div>

                        <div className="details-content">
                            {detailedData && !isEditing && !isAdding ? (
                                <div className="details-content-grid">
                                    <div className="details-list">
                                        <h4>📋 Información Principal</h4>
                                        <div className="detail-item"><span>ID Copia:</span><p>#{detailedData.id}</p></div>
                                        <div className="detail-item"><span>Usuario:</span><p>{detailedData.usuario || 'N/A'}</p></div>
                                        <div className="detail-item"><span>Área:</span><p>{detailedData.area}</p></div>
                                        <div className="detail-item"><span>Equipo:</span><p>{detailedData.tipo} - {detailedData.marca}</p></div>

                                        <h4>📅 Fecha y Estado</h4>
                                        <div className="detail-item"><span>Fecha de Copia:</span><p>{formatDate(detailedData.fecha)}</p></div>
                                        <div className="detail-item">
                                            <span>Estado:</span>
                                            <span className={`status-badge status-${(detailedData.estado_copia || '').toLowerCase().replace(' ', '-')}`}>
                                                {detailedData.estado_copia || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="detail-item"><span>Tipo de Copia:</span><p>{detailedData.tipo_copia || 'N/A'}</p></div>

                                        <h4>⏱️ Tiempos y Responsable</h4>
                                        <div className="detail-item"><span>Responsable:</span><p>{detailedData.responsable || 'N/A'}</p></div>
                                        <div className="detail-item"><span>Hora Inicio:</span><p>{detailedData.hora_inicio || 'N/A'}</p></div>
                                        <div className="detail-item"><span>Hora Fin:</span><p>{detailedData.hora_fin || 'N/A'}</p></div>
                                        <div className="detail-item"><span>Duración:</span><p>{detailedData.tiempo_duracion || 'N/A'}</p></div>

                                        <h4>💾 Detalles del Respaldo</h4>
                                        <div className="detail-item"><span>Ubicación:</span><p>{detailedData.ubicacion_almacenamiento || 'N/A'}</p></div>
                                        <div className="detail-item"><span>Tamaño:</span><p>{detailedData.tamaño_datos || 'N/A'}</p></div>

                                        {detailedData.observaciones && (
                                            <div className="detail-item full-width">
                                                <span>📝 Observaciones:</span>
                                                <p>{detailedData.observaciones}</p>
                                            </div>
                                        )}

                                        <div className="calendar-container">
                                            <Calendar
                                                localizer={localizer}
                                                events={calendarEvents}
                                                startAccessor="start"
                                                endAccessor="end"
                                                style={{ height: 200 }}
                                                toolbar={true}
                                                date={calendarDate}
                                                onNavigate={(date) => setCalendarDate(date)}
                                                views={['month']}
                                                messages={{ next: "Siguiente", previous: "Anterior", today: "Hoy", month: "Mes" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (isAdding && newCopiaData) ? (
                                <form onSubmit={handleSaveNew}>
                                    <div className="details-grid">
                                        <label className="full-width">
                                            Seleccionar Equipo Existente:
                                            <select name="equipoId" value={selectedEquipoId} onChange={handleNewFormChange} required>
                                                <option value="">-- Seleccionar un equipo --</option>
                                                {equipos.map(eq => (
                                                    <option key={eq.id} value={eq.id}>
                                                        {eq.usuario} ({eq.tipo} - {eq.codigo})
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <hr className="full-width" />
                                        <label>Usuario <input name="usuario" value={newCopiaData.usuario} readOnly placeholder="Se autocompleta" /></label>
                                        <label>Área <input name="area" value={newCopiaData.area} readOnly placeholder="Se autocompleta" /></label>
                                        <label>Tipo <input name="tipo" value={newCopiaData.tipo} readOnly placeholder="Se autocompleta" /></label>
                                        <label>Marca <input name="marca" value={newCopiaData.marca} readOnly placeholder="Se autocompleta" /></label>
                                        <label>Código Inventario <input name="codigo" value={newCopiaData.codigo} readOnly placeholder="Se autocompleta" /></label>

                                        <h4 className="full-width">Información de la Copia</h4>
                                        <label>
                                            Fecha de la Copia
                                            <input type="date" name="fecha" value={newCopiaData.fecha} onChange={handleNewFormChange} required />
                                        </label>
                                        <label>
                                            Estado
                                            <select name="estado_copia" value={newCopiaData.estado_copia} onChange={handleNewFormChange}>
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="En Progreso">En Progreso</option>
                                                <option value="Exitosa">Exitosa</option>
                                                <option value="Fallida">Fallida</option>
                                            </select>
                                        </label>
                                        <label>
                                            Tipo de Copia
                                            <select name="tipo_copia" value={newCopiaData.tipo_copia} onChange={handleNewFormChange}>
                                                <option value="Completa">Completa</option>
                                                <option value="Incremental">Incremental</option>
                                                <option value="Diferencial">Diferencial</option>
                                            </select>
                                        </label>
                                        <label>
                                            Responsable
                                            <input name="responsable" value={newCopiaData.responsable} onChange={handleNewFormChange} placeholder="Persona que realizó la copia" />
                                        </label>

                                        <h4 className="full-width">Tiempos</h4>
                                        <label>
                                            Hora Inicio
                                            <input type="time" name="hora_inicio" value={newCopiaData.hora_inicio} onChange={handleNewFormChange} />
                                        </label>
                                        <label>
                                            Hora Fin
                                            <input type="time" name="hora_fin" value={newCopiaData.hora_fin} onChange={handleNewFormChange} />
                                        </label>
                                        <label>
                                            Tiempo de Duración
                                            <input name="tiempo_duracion" value={newCopiaData.tiempo_duracion} onChange={handleNewFormChange} placeholder="Ej: 2h 30min" />
                                        </label>

                                        <h4 className="full-width">Detalles del Respaldo</h4>
                                        <label>
                                            Ubicación de Almacenamiento
                                            <input name="ubicacion_almacenamiento" value={newCopiaData.ubicacion_almacenamiento} onChange={handleNewFormChange} placeholder="Disco externo, servidor, nube..." />
                                        </label>
                                        <label>
                                            Tamaño de Datos
                                            <input name="tamaño_datos" value={newCopiaData.tamaño_datos} onChange={handleNewFormChange} placeholder="Ej: 500GB, 1.2TB" />
                                        </label>
                                        <label className="full-width">
                                            Observaciones
                                            <textarea name="observaciones" value={newCopiaData.observaciones} onChange={handleNewFormChange} rows="3" placeholder="Notas adicionales sobre el proceso de copia"></textarea>
                                        </label>
                                    </div>
                                </form>
                            ) : (isEditing && editCopiaData) ? (
                                <form onSubmit={handleSaveEdit}>
                                    <div className="details-grid">
                                        <label className="full-width">
                                            Seleccionar Equipo:
                                            <select name="equipoId" value={selectedEquipoId} onChange={handleEditFormChange}>
                                                <option value="">-- Seleccionar un equipo --</option>
                                                {equipos.map(eq => (
                                                    <option key={eq.id} value={eq.id}>
                                                        {eq.usuario} ({eq.tipo} - {eq.codigo})
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <hr className="full-width" />
                                        <label>Usuario <input name="usuario" value={editCopiaData.usuario || ''} readOnly placeholder="Se autocompleta" /></label>
                                        <label>Área <input name="area" value={editCopiaData.area || ''} readOnly placeholder="Se autocompleta" /></label>
                                        <label>Tipo <input name="tipo" value={editCopiaData.tipo || ''} readOnly placeholder="Se autocompleta" /></label>
                                        <label>Marca <input name="marca" value={editCopiaData.marca || ''} readOnly placeholder="Se autocompleta" /></label>
                                        <label>Código Inventario <input name="codigo" value={editCopiaData.codigo || ''} readOnly placeholder="Se autocompleta" /></label>

                                        <h4 className="full-width">Información de la Copia</h4>
                                        <label>
                                            Fecha de la Copia
                                            <input type="date" name="fecha" value={editCopiaData.fecha ? editCopiaData.fecha.split('T')[0] : ''} onChange={handleEditFormChange} required />
                                        </label>
                                        <label>
                                            Estado
                                            <select name="estado_copia" value={editCopiaData.estado_copia || 'Pendiente'} onChange={handleEditFormChange}>
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="En Progreso">En Progreso</option>
                                                <option value="Exitosa">Exitosa</option>
                                                <option value="Fallida">Fallida</option>
                                            </select>
                                        </label>
                                        <label>
                                            Tipo de Copia
                                            <select name="tipo_copia" value={editCopiaData.tipo_copia || 'Completa'} onChange={handleEditFormChange}>
                                                <option value="Completa">Completa</option>
                                                <option value="Incremental">Incremental</option>
                                                <option value="Diferencial">Diferencial</option>
                                            </select>
                                        </label>
                                        <label>
                                            Responsable
                                            <input name="responsable" value={editCopiaData.responsable || ''} onChange={handleEditFormChange} placeholder="Persona que realizó la copia" />
                                        </label>

                                        <h4 className="full-width">Tiempos</h4>
                                        <label>
                                            Hora Inicio
                                            <input type="time" name="hora_inicio" value={editCopiaData.hora_inicio || ''} onChange={handleEditFormChange} />
                                        </label>
                                        <label>
                                            Hora Fin
                                            <input type="time" name="hora_fin" value={editCopiaData.hora_fin || ''} onChange={handleEditFormChange} />
                                        </label>
                                        <label>
                                            Tiempo de Duración
                                            <input name="tiempo_duracion" value={editCopiaData.tiempo_duracion || ''} onChange={handleEditFormChange} placeholder="Ej: 2h 30min" />
                                        </label>

                                        <h4 className="full-width">Detalles del Respaldo</h4>
                                        <label>
                                            Ubicación de Almacenamiento
                                            <input name="ubicacion_almacenamiento" value={editCopiaData.ubicacion_almacenamiento || ''} onChange={handleEditFormChange} placeholder="Disco externo, servidor, nube..." />
                                        </label>
                                        <label>
                                            Tamaño de Datos
                                            <input name="tamaño_datos" value={editCopiaData.tamaño_datos || ''} onChange={handleEditFormChange} placeholder="Ej: 500GB, 1.2TB" />
                                        </label>
                                        <label className="full-width">
                                            Observaciones
                                            <textarea name="observaciones" value={editCopiaData.observaciones || ''} onChange={handleEditFormChange} rows="3" placeholder="Notas adicionales sobre el proceso de copia"></textarea>
                                        </label>
                                    </div>
                                </form>
                            ) : (
                                <div className="loading-message">Cargando...</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CopiasPage;