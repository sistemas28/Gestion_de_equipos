import React, { useEffect, useState } from "react";
import "./maintenancePage.css";
import api from '../../api/axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    FaTimes, FaUser, FaBuilding, FaDesktop, FaTag,
    FaCalendarAlt, FaTools, FaFileAlt, FaSignature, FaSearch,
    FaPlus, FaTrash, FaCheckCircle, FaExclamationTriangle,
    FaDownload, FaSync
} from 'react-icons/fa';
import useIsMobile from '../../hooks/useIsMobile';

import { generateReport } from '../../utils/reportGenerator';

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

const MaintenancePage = () => {
    const isMobile = useIsMobile();
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailedData, setDetailedData] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false); // Para controlar el modal de "agregar"
    const [newMaintenanceData, setNewMaintenanceData] = useState(null); // Datos para el nuevo mantenimiento
    const [editFormData, setEditFormData] = useState(null);
    const [signatureType, setSignatureType] = useState('text');
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [equipos, setEquipos] = useState([]); // Nuevo estado para almacenar los equipos
    const [selectedEquipoId, setSelectedEquipoId] = useState(''); // Estado para el equipo seleccionado en el dropdown
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMaintenanceData();
    }, []);

    async function fetchMaintenanceData() {
        await fetchEquipos(); // Asegurarse de tener los equipos antes de cargar mantenimientos
        try {
            setLoading(true);
            setError(null);
            // Asumiendo que el endpoint para obtener todos los mantenimientos es /api/mantenimiento
            const response = await api.get('/mantenimiento');
            // Ajusta 'response.data.body' si la estructura de tu API es diferente
            setMaintenanceData(response.data.body || []);
            // Después de cargar los mantenimientos, si hay un item seleccionado, intentar pre-seleccionar el equipo
            if (selectedItem) {
                handleRowClick(selectedItem); // Volver a procesar el item seleccionado para actualizar el dropdown
            }
        } catch (err) {
            console.error("Error fetching maintenance data:", err);
            setError("Error al cargar los datos de mantenimiento. Por favor, inténtalo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchEquipos() {
        try {
            const response = await api.get('/equipos');
            setEquipos(response.data.body || []);
        } catch (err) {
            console.error("Error fetching equipos:", err);
        }
    }

    async function handleRowClick(item) {
        if (selectedItem && selectedItem.id === item.id) {
            setSelectedItem(null); // Oculta el panel si se hace clic en el mismo item
            setDetailedData(null);
            return;
        }
        // Reset states when opening a new item
        setIsEditing(false);
        setSelectedItem(item);
        setEditFormData(null);
        setLoadingDetails(true);
        try {
            // Usamos el endpoint para obtener un solo registro
            const response = await api.get(`/mantenimiento/${item.id}`);
            const data = response.data.body;

            // Intentar encontrar un equipo que coincida por código para pre-seleccionar en el dropdown y obtener detalles extra
            const matchingEquipo = equipos.find(eq =>
                eq.codigo === data.id.toString()
            );

            // Combinar datos del mantenimiento con datos del equipo (procesador, ram, so, etc.)
            // Establecemos equipo_id para que la búsqueda de historial funcióne (usando el código)
            const mergedData = {
                ...data,
                ...(matchingEquipo || {}),
                equipo_id: data.codigo || data.id
            };

            setDetailedData(mergedData);

            if (data.fecha_actual_de_mantenimiento) {
                setCalendarDate(new Date(data.fecha_actual_de_mantenimiento));
            } else {
                setCalendarDate(new Date());
            }

            setSelectedEquipoId(matchingEquipo ? matchingEquipo.id : '');
        } catch (err) {
            console.error("Error fetching maintenance details:", err);
            setError("Error al cargar los detalles del mantenimiento.");
            setDetailedData(null);
        } finally {
            setLoadingDetails(false);
        }
    }

    const handleOpenAddModal = () => {
        // Inicializa el formulario para un nuevo mantenimiento
        setNewMaintenanceData({
            usuario: '',
            area: '',
            tipo: '',
            marca: '',
            codigo: '',
            fecha_ultimo_mantenimiento: null,
            fecha_actual_de_mantenimiento: null,
            actividades_realizadas: '',
            observaciones: '',
            fecha_de_elaboracion: moment().format('YYYY-MM-DD'), // Fecha de hoy por defecto
            fecha_de_ejecucion: null,
            firmas_tecnico: '',
            firmas_aprobo: '',
            firmas_reviso: '',
            estado: 'Pendiente',
        });
        setSelectedEquipoId(''); // Resetea el equipo seleccionado
        setSelectedItem(null); // Cierra el panel de detalles si está abierto
        setDetailedData(null); // Limpia los datos detallados del item anterior
        setIsAdding(true);
    };


    const handleEdit = () => {
        setEditFormData({ ...detailedData });
        setSignatureType(detailedData.firmas_tecnico?.startsWith('data:image') ? 'image' : 'text');
        // Pre-seleccionar el equipo que coincide por código (el ID del mantenimiento es el código del equipo)
        setSelectedEquipoId(equipos.find(eq => eq.codigo === detailedData.id.toString())?.id || '');
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditFormData(null);
        setIsAdding(false);
        setSelectedEquipoId(''); // Limpiar selección de equipo
    };


    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // 1. Preparamos los datos para enviar, creando una copia para no modificar el estado directamente
            // No enviamos equipo_id, solo los datos del formulario
            const dataToSave = { ...editFormData };

            // 2. Removemos propiedades que no deben estar en el cuerpo de la petición PUT
            delete dataToSave.id;
            delete dataToSave.equipoId;
            delete dataToSave.equipo_id;

            // 3. Aseguramos que las fechas vacías se envíen como null
            Object.keys(dataToSave).forEach(key => {
                if (key.startsWith('fecha_') && dataToSave[key] === '') {
                    dataToSave[key] = null;
                }
            });

            // 4. Enviamos la petición PUT al backend usando el ID (código de equipo)
            await api.put(`/mantenimiento/${detailedData.id}`, dataToSave, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // 5. Actualizamos el estado local para reflejar los cambios inmediatamente
            const response = await api.get(`/mantenimiento/${detailedData.id}`);
            const updatedData = response.data.body;
            setDetailedData(updatedData);
            setIsEditing(false);
            fetchMaintenanceData(); // Actualizamos la lista principal en segundo plano
        } catch (err) {
            console.error("Error saving maintenance data:", err);
            setError("Error al guardar los cambios. Por favor, inténtalo de nuevo.");
        }
    };





    const handleSaveNew = async (e) => {
        e.preventDefault();
        if (!selectedEquipoId) {
            setError("Por favor, selecciona un equipo para asociar el mantenimiento.");
            return;
        }
        // Buscamos el equipo completo para obtener su código de inventario
        const selectedEquipo = equipos.find(eq => eq.id === parseInt(selectedEquipoId, 10));
        if (!selectedEquipo || (selectedEquipo.codigo === undefined || selectedEquipo.codigo === null || selectedEquipo.codigo === '')) {
            console.error("Error: Equipo no válido o sin código", selectedEquipo);
            setError("El equipo seleccionado no tiene un código de inventario válido. No se puede crear el mantenimiento.");
            return;
        }

        // Verificar si ya existe un mantenimiento con el código de equipo (el ID será el código del equipo)
        const existingMaintenance = maintenanceData.find(maint =>
            maint.id?.toString() === selectedEquipo.codigo.toString()
        );

        if (existingMaintenance) {
            if (window.confirm(`Ya existe un mantenimiento para el equipo "${selectedEquipo.usuario}" con código "${selectedEquipo.codigo}". ¿Deseas actualizar la información existente con los nuevos datos ingresados?`)) {
                try {
                    const dataToUpdate = { ...newMaintenanceData };

                    Object.keys(dataToUpdate).forEach(key => {
                        if (key.startsWith('fecha_') && dataToUpdate[key] === '') {
                            dataToUpdate[key] = null;
                        }
                    });

                    await api.put(`/mantenimiento/${existingMaintenance.id}`, dataToUpdate, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    setIsAdding(false);
                    setNewMaintenanceData(null);
                    await fetchMaintenanceData();
                    return;
                } catch (err) {
                    console.error("Error updating existing maintenance from create modal:", err);
                    setError("Error al actualizar el mantenimiento existente: " + (err.response?.data?.message || err.message));
                    return;
                }
            } else {
                return;
            }
        }

        try {
            // Creamos el objeto a enviar con los datos del formulario
            const dataToSend = {
                ...newMaintenanceData,
                // El ID del mantenimiento será igual al código del equipo (sin equipo_id separado)
                id: selectedEquipo.codigo,
            };

            // Aseguramos que las fechas vacías se envíen como null para evitar errores en la BD
            Object.keys(dataToSend).forEach(key => {
                if (key.startsWith('fecha_') && (dataToSend[key] === '' || dataToSend[key] === null)) {
                    dataToSend[key] = null;
                }
            });
            // Asignar fecha de elaboración si no está definida
            if (!dataToSend.fecha_de_elaboracion) {
                dataToSend.fecha_de_elaboracion = moment().format('YYYY-MM-DD');
            }
            await api.post('/mantenimiento', dataToSend);
            setIsAdding(false);
            setNewMaintenanceData(null);
            await fetchMaintenanceData();
        } catch (err) {
            console.error("Error creating new maintenance:", err);

            // Manejar errores específicos
            if (err.response?.status === 409) {
                setError(`Ya existe un mantenimiento para el equipo "${selectedEquipo.usuario}" con código "${selectedEquipo.codigo}". Cada equipo solo puede tener un mantenimiento.`);
            } else if (err.response?.status === 500) {
                setError("Error interno del servidor. Por favor, contacta al administrador.");
            } else if (err.response?.status === 400) {
                setError("Datos inválidos. Verifica que todos los campos estén correctamente llenados.");
            } else {
                setError("Error al crear el nuevo mantenimiento: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el mantenimiento #${detailedData.id}?`)) {
            try {
                const idToDelete = detailedData.id;
                await api.delete(`/mantenimiento/${detailedData.id}`);
                setSelectedItem(null); // Cierra el panel de detalles inmediatamente
                await fetchMaintenanceData();
            } catch (err) {
                console.error("Error deleting maintenance data:", err);
                setError("Error al eliminar el registro.");
            }
        }
    };

    const handleStatusUpdate = async (e, id, newStatus) => {
        if (e) e.stopPropagation();
        try {
            await api.put(`/mantenimiento/${id}`, {
                estado: newStatus
            });
            await fetchMaintenanceData();
        } catch (err) {
            console.error("Error updating status:", err);
            setError("Error al actualizar el estado del mantenimiento.");
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        const formDataSetter = isEditing ? setEditFormData : setNewMaintenanceData;

        if (name === "equipoId") {
            const formDataSetter = isEditing ? setEditFormData : setNewMaintenanceData;
            setSelectedEquipoId(value);
            const selectedEquipo = equipos.find(eq => eq.id === parseInt(value, 10));
            if (selectedEquipo) {
                formDataSetter(prev => ({
                    ...prev,
                    usuario: selectedEquipo.usuario,
                    area: selectedEquipo.area,
                    tipo: selectedEquipo.tipo,
                    marca: selectedEquipo.marca,
                    codigo: selectedEquipo.codigo
                }));
            } else {
                // Si no se selecciona ningún equipo, limpiar los campos relacionados
                formDataSetter(prev => ({ ...prev, usuario: '', area: '', tipo: '', marca: '', codigo: '' }));
            }
        } else {
            formDataSetter(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleNewSignatureImageChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewMaintenanceData(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSignatureImageChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditFormData(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return moment(dateString).format('LL');
    };



    const handleDownloadPdf = async () => {
        if (!detailedData) return;

        // 1. Obtener el historial de mantenimientos para este equipo
        let historial = [];
        if (detailedData.equipo_id) {
            try {
                const historialRes = await api.get(`/mantenimiento/historial/${detailedData.equipo_id}`);
                historial = historialRes.data.body || [];
            } catch (err) {
                console.error("Error al obtener el historial de mantenimiento:", err);
            }
        }

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
                    { label: 'SISTEMA OPERATIVO', value: detailedData.sistema_operativo || detailedData.os || 'N/A' },
                    { label: 'PROCESADOR', value: detailedData.procesador || 'N/A' },
                    { label: 'MEMORIA RAM', value: detailedData.memoria_ram || detailedData.ram || 'N/A' },
                    { label: 'DISCO DURO', value: detailedData.disco_duro || 'N/A' },
                    { label: 'ESTADO ACTUAL', value: detailedData.estado || 'N/A' }
                ]
            },
            {
                type: 'info',
                title: 'CRONOGRAMA DE MANTENIMIENTO',
                data: [
                    { label: 'FECHA ELABORACIÓN', value: formatDate(detailedData.fecha_de_elaboracion) },
                    { label: 'FECHA EJECUCIÓN', value: formatDate(detailedData.fecha_de_ejecucion) },
                    { label: 'ÚLTIMO MANTENIMIENTO', value: formatDate(detailedData.fecha_ultimo_mantenimiento) },
                    { label: 'PRÓXIMO MANTENIMIENTO', value: formatDate(detailedData.fecha_actual_de_mantenimiento) }
                ]
            },
            {
                type: 'info',
                title: 'ACTIVIDADES REALIZADAS',
                data: [
                    { label: 'DESCRIPCIÓN', value: detailedData.actividades_realizadas || 'No se registraron actividades realizadas.' }
                ]
            },
            {
                type: 'info',
                title: 'OBSERVACIONES Y NOTAS',
                data: [
                    { label: 'OBSERVACIONES', value: detailedData.observaciones || 'Sin observaciones adicionales.' }
                ]
            }
        ];

        // Add History Table if exists
        if (historial.length > 0) {
            sections.push({
                type: 'table',
                headers: ['Fecha de Ejecución', 'Actividades Realizadas', 'Observaciones'],
                body: historial.map(item => [
                    formatDate(item.fecha_de_ejecucion),
                    item.actividades_realizadas || 'N/A',
                    item.observaciones || 'N/A'
                ]),
                columnStyles: {
                    0: { cellWidth: 35 },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 50 }
                }
            });
        }

        // Add Signatures
        const signatures = [];
        if (detailedData.firmas_tecnico) signatures.push({ role: 'TÉCNICO', name: '', signature: detailedData.firmas_tecnico });
        if (detailedData.firmas_aprobo) signatures.push({ role: 'APROBÓ', name: '', signature: detailedData.firmas_aprobo });
        if (detailedData.firmas_reviso) signatures.push({ role: 'REVISÓ', name: '', signature: detailedData.firmas_reviso });

        if (signatures.length > 0) {
            sections.push({
                type: 'signatures',
                data: signatures
            });
        }

        generateReport(
            'PROCESO DE GESTIÓN DE INFORMÁTICA',
            'HOJA DE VIDA DE LOS EQUIPOS',
            'FT-MANT-001',
            '1.0',
            sections,
            `Mantenimiento_${detailedData.usuario}.pdf`
        );
    };

    const calendarEvents = detailedData ? [
        detailedData.fecha_ultimo_mantenimiento && moment(detailedData.fecha_ultimo_mantenimiento).isValid() ? {
            title: 'Último Mantenimiento',
            start: new Date(detailedData.fecha_ultimo_mantenimiento),
            end: new Date(detailedData.fecha_ultimo_mantenimiento),
            allDay: true,
        } : null,
        detailedData.fecha_actual_de_mantenimiento && moment(detailedData.fecha_actual_de_mantenimiento).isValid() ? {
            title: 'Próximo Mantenimiento',
            start: new Date(detailedData.fecha_actual_de_mantenimiento),
            end: new Date(detailedData.fecha_actual_de_mantenimiento),
            allDay: true,
        } : null,
        detailedData.fecha_de_elaboracion && moment(detailedData.fecha_de_elaboracion).isValid() ? {
            title: 'Fecha Elaboración',
            start: new Date(detailedData.fecha_de_elaboracion),
            end: new Date(detailedData.fecha_de_elaboracion),
        } : null,
        detailedData.fecha_de_ejecucion && moment(detailedData.fecha_de_ejecucion).isValid() ? {
            title: 'Fecha Ejecución',
            start: new Date(detailedData.fecha_de_ejecucion),
            end: new Date(detailedData.fecha_de_ejecucion),
        } : null,
    ].filter(Boolean) : []; // Filtra eventos nulos si las fechas no existen

    return (
        <div className="maintenance-page">
            <div className="page-header">
                <h2 className="page-title">Gestión de Mantenimiento</h2>
                <div className="header-actions">
                    <button className="action-btn save" onClick={handleOpenAddModal} disabled={loading}>
                        Crear Mantenimiento
                    </button>
                    <button className="refresh-btn" onClick={fetchMaintenanceData} disabled={loading}>
                        {loading ? 'Cargando...' : 'Actualizar Datos'}
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading && maintenanceData.length === 0 && <div className="loading-message">Cargando datos de mantenimiento...</div>}

            {!loading && maintenanceData.length === 0 && !error && (
                <div className="no-data-message">No hay datos de mantenimiento disponibles.</div>
            )}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por ID o usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {!loading && maintenanceData.length > 0 && (
                <div className="maintenance-table-container card">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                {!isMobile && <th>Área</th>}
                                {!isMobile && <th>Tipo</th>}
                                <th>Fecha</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenanceData
                                .filter(item =>
                                    (item.id.toString().includes(searchTerm)) ||
                                    (item.usuario?.toLowerCase().includes(searchTerm.toLowerCase()))
                                ).map((item) => (
                                    <tr key={item.id} onClick={() => handleRowClick(item)} className={selectedItem?.id === item.id ? 'selected' : ''}>
                                        <td>{item.id}</td>
                                        <td>{item.usuario}</td>
                                        {!isMobile && <td>{item.area}</td>}
                                        {!isMobile && <td>{item.tipo}</td>}
                                        <td>{item.fecha_actual_de_mantenimiento ? new Date(item.fecha_actual_de_mantenimiento).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }) : 'N/A'}</td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <select
                                                className={`status-select ${item.statusClass || item.estado?.toLowerCase().replace(' ', '-') || 'pendiente'}`}
                                                value={item.estado || 'Pendiente'}
                                                onChange={(e) => handleStatusUpdate(null, item.id, e.target.value)}
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="En ejecución">En ejecución</option>
                                                <option value="Terminado">Terminado</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(selectedItem || isAdding) && (
                <div className="details-modal" onClick={(e) => { if (e.target === e.currentTarget) { setSelectedItem(null); setIsAdding(false); } }}>
                    <div className="details-panel card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-details-btn" onClick={() => setSelectedItem(null)}><FaTimes /></button>
                        {loadingDetails ? (
                            <div className="loading-message">Cargando detalles...</div>
                        ) : detailedData ? (
                            <>
                                <div className="details-header">
                                    <h3>{isEditing ? `Editando Mantenimiento #${detailedData.id}` : `Detalles del Mantenimiento #${detailedData.id}`}</h3>
                                    <div className="details-actions" onClick={(e) => e.stopPropagation()}>
                                        {isEditing ? (
                                            <>
                                                <button type="button" className="action-btn save" onClick={handleSave}>Guardar</button>
                                                <button type="button" className="action-btn cancel" onClick={handleCancel}>Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <button type="button" className="action-btn" onClick={handleEdit}>Editar</button>
                                                <button type="button" className="action-btn delete" onClick={handleDelete}>Eliminar</button>
                                                <button type="button" className="action-btn download" onClick={handleDownloadPdf}>Descargar PDF</button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="details-grid">
                                    <div className="details-list">
                                        <h4>Información del Equipo</h4>
                                        {isEditing ? (
                                            <div className="form-section">
                                                <label>
                                                    Seleccionar Equipo:
                                                    <select name="equipoId" value={selectedEquipoId} onChange={handleFormChange}>
                                                        <option value="">-- Seleccionar un equipo --</option>
                                                        {equipos.length > 0 && equipos.map(eq => (
                                                            <option key={eq.id} value={eq.id}>
                                                                {eq.usuario} ({eq.tipo} - {eq.marca})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>
                                                <div className="form-grid-inner">
                                                    <label>Usuario: <input name="usuario" value={editFormData.usuario || ''} onChange={handleFormChange} placeholder="Usuario del equipo" /></label>
                                                    <label>Área: <input name="area" value={editFormData.area || ''} onChange={handleFormChange} placeholder="Área del equipo" /></label>
                                                    <label>Tipo: <input name="tipo" value={editFormData.tipo || ''} onChange={handleFormChange} placeholder="Tipo de equipo" /></label>
                                                    <label>Marca: <input name="marca" value={editFormData.marca || ''} onChange={handleFormChange} placeholder="Marca del equipo" /></label>
                                                </div>
                                                <hr />
                                                <h4>Detalles del Mantenimiento</h4>
                                                <label>Actividades Realizadas: <textarea name="actividades_realizadas" value={editFormData.actividades_realizadas || ''} onChange={handleFormChange} rows="4"></textarea></label>
                                                <label>Observaciones: <textarea name="observaciones" value={editFormData.observaciones || ''} onChange={handleFormChange} rows="3"></textarea></label>
                                                <label>
                                                    Estado:
                                                    <select name="estado" value={editFormData.estado || 'Pendiente'} onChange={handleFormChange}>
                                                        <option value="Pendiente">Pendiente</option>
                                                        <option value="En ejecución">En ejecución</option>
                                                        <option value="Terminado">Terminado</option>
                                                    </select>
                                                </label>
                                                <hr />
                                                <h4>Fechas Clave</h4>
                                                <div className="form-grid-inner">
                                                    <label>Fecha de Elaboración: <input type="date" name="fecha_de_elaboracion" value={editFormData.fecha_de_elaboracion && moment(editFormData.fecha_de_elaboracion).isValid() ? moment(editFormData.fecha_de_elaboracion).format('YYYY-MM-DD') : ''} onChange={handleFormChange} /></label>
                                                    <label>Fecha de Ejecución: <input type="date" name="fecha_de_ejecucion" value={editFormData.fecha_de_ejecucion && moment(editFormData.fecha_de_ejecucion).isValid() ? moment(editFormData.fecha_de_ejecucion).format('YYYY-MM-DD') : ''} onChange={handleFormChange} /></label>
                                                    <label>Fecha Último Mantenimiento: <input type="date" name="fecha_ultimo_mantenimiento" value={editFormData.fecha_ultimo_mantenimiento && moment(editFormData.fecha_ultimo_mantenimiento).isValid() ? moment(editFormData.fecha_ultimo_mantenimiento).format('YYYY-MM-DD') : ''} onChange={handleFormChange} /></label>
                                                    <label>Fecha Próximo Mantenimiento: <input type="date" name="fecha_actual_de_mantenimiento" value={editFormData.fecha_actual_de_mantenimiento && moment(editFormData.fecha_actual_de_mantenimiento).isValid() ? moment(editFormData.fecha_actual_de_mantenimiento).format('YYYY-MM-DD') : ''} onChange={handleFormChange} /></label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="details-view-premium">
                                                <div className="details-section-card">
                                                    <div className="section-header">
                                                        <FaDesktop className="section-icon" />
                                                        <h4>Información del Equipo</h4>
                                                    </div>
                                                    <div className="details-grid-mini">
                                                        <div className="detail-pill">
                                                            <FaUser className="pill-icon" />
                                                            <div className="pill-content">
                                                                <span>Usuario</span>
                                                                <p>{detailedData.usuario}</p>
                                                            </div>
                                                        </div>
                                                        <div className="detail-pill">
                                                            <FaBuilding className="pill-icon" />
                                                            <div className="pill-content">
                                                                <span>Área</span>
                                                                <p>{detailedData.area}</p>
                                                            </div>
                                                        </div>
                                                        <div className="detail-pill">
                                                            <FaTag className="pill-icon" />
                                                            <div className="pill-content">
                                                                <span>Marca</span>
                                                                <p>{detailedData.marca || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="detail-pill">
                                                            <FaTools className="pill-icon" />
                                                            <div className="pill-content">
                                                                <span>Tipo</span>
                                                                <p>{detailedData.tipo}</p>
                                                            </div>
                                                        </div>
                                                        <div className="detail-pill">
                                                            <FaDesktop className="pill-icon" />
                                                            <div className="pill-content">
                                                                <span>S.O.</span>
                                                                <p>{detailedData.sistema_operativo || detailedData.os || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="detail-pill">
                                                            <FaTag className="pill-icon" />
                                                            <div className="pill-content">
                                                                <span>Procesador</span>
                                                                <p>{detailedData.procesador || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="detail-pill">
                                                            <FaTag className="pill-icon" />
                                                            <div className="pill-content">
                                                                <span>RAM</span>
                                                                <p>{detailedData.memoria_ram || detailedData.ram || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="detail-pill">
                                                            <FaTag className="pill-icon" />
                                                            <div className="pill-content">
                                                                <span>Disco Duro</span>
                                                                <p>{detailedData.disco_duro || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="details-section-card">
                                                    <div className="section-header">
                                                        <FaFileAlt className="section-icon" />
                                                        <h4>Detalles del Servicio</h4>
                                                    </div>
                                                    <div className="service-details">
                                                        <div className="service-item">
                                                            <span>Actividades Realizadas</span>
                                                            <div className="service-text-box">
                                                                {detailedData.actividades_realizadas || 'No se registraron actividades.'}
                                                            </div>
                                                        </div>
                                                        <div className="service-item">
                                                            <span>Observaciones</span>
                                                            <div className="service-text-box obs">
                                                                {detailedData.observaciones || 'Sin observaciones.'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="details-section-card">
                                                    <div className="section-header">
                                                        <FaCalendarAlt className="section-icon" />
                                                        <h4>Cronograma de Mantenimiento</h4>
                                                    </div>
                                                    <div className="dates-grid-premium">
                                                        <div className="date-box elaboration">
                                                            <span>Elaboración</span>
                                                            <p>{formatDate(detailedData.fecha_de_elaboracion)}</p>
                                                        </div>
                                                        <div className="date-box execution">
                                                            <span>Ejecución</span>
                                                            <p>{formatDate(detailedData.fecha_de_ejecucion)}</p>
                                                        </div>
                                                        <div className="date-box last">
                                                            <span>Último Mant.</span>
                                                            <p>{formatDate(detailedData.fecha_ultimo_mantenimiento)}</p>
                                                        </div>
                                                        <div className="date-box next">
                                                            <span>Próximo Mant.</span>
                                                            <p>{formatDate(detailedData.fecha_actual_de_mantenimiento)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="details-meta">
                                        <div className="calendar-container">
                                            <Calendar
                                                localizer={localizer}
                                                events={calendarEvents}
                                                startAccessor="start"
                                                endAccessor="end"
                                                style={{ height: 300 }}
                                                toolbar={true}
                                                date={calendarDate}
                                                onNavigate={(date) => setCalendarDate(date)}
                                                views={['month']}
                                                messages={{ next: "Siguiente", previous: "Anterior", today: "Hoy", month: "Mes" }}
                                            />
                                        </div>
                                        <div className="signature-container">
                                            <h4>Firmas</h4>
                                            {isEditing ? (
                                                <div className="signature-edit">
                                                    <div className="signature-options">
                                                        <label><input type="radio" name="signatureType" value="text" checked={signatureType === 'text'} onChange={() => setSignatureType('text')} /> Escribir nombre</label>
                                                        <label><input type="radio" name="signatureType" value="image" checked={signatureType === 'image'} onChange={() => setSignatureType('image')} /> Subir firma</label>
                                                    </div>
                                                    {signatureType === 'text' ? (
                                                        <>
                                                            <input name="firmas_tecnico" placeholder="Escriba el nombre del técnico" value={editFormData.firmas_tecnico || ''} onChange={handleFormChange} />
                                                            <input name="firmas_aprobo" placeholder="Escriba el nombre de quien aprueba" value={editFormData.firmas_aprobo || ''} onChange={handleFormChange} />
                                                            <input name="firmas_reviso" placeholder="Escriba el nombre de quien revisa" value={editFormData.firmas_reviso || ''} onChange={handleFormChange} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div>
                                                                <label>Firma Técnico:</label>
                                                                <input type="file" accept="image/*" onChange={(e) => handleSignatureImageChange(e, 'firmas_tecnico')} />
                                                                {editFormData.firmas_tecnico && <img src={editFormData.firmas_tecnico} alt="Vista previa de la firma" className="signature-display" />}
                                                            </div>
                                                            <div>
                                                                <label>Firma Aprobó:</label>
                                                                <input type="file" accept="image/*" onChange={(e) => handleSignatureImageChange(e, 'firmas_aprobo')} />
                                                                {editFormData.firmas_aprobo && <img src={editFormData.firmas_aprobo} alt="Vista previa de la firma" className="signature-display" />}
                                                            </div>
                                                            <div>
                                                                <label>Firma Revisó:</label>
                                                                <input type="file" accept="image/*" onChange={(e) => handleSignatureImageChange(e, 'firmas_reviso')} />
                                                                {editFormData.firmas_reviso && <img src={editFormData.firmas_reviso} alt="Vista previa de la firma" className="signature-display" />}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="signatures-flex-grid">
                                                        <div className="signature-item">
                                                            <span><FaSignature className="pill-icon" /> Técnico</span>
                                                            <div className="signature-box">
                                                                {detailedData.firmas_tecnico ? (
                                                                    detailedData.firmas_tecnico.startsWith('data:image')
                                                                        ? <img src={detailedData.firmas_tecnico} alt="Firma del técnico" className="signature-display" />
                                                                        : <p className="signature-text">{detailedData.firmas_tecnico}</p>
                                                                ) : <p className="muted">Sin firma</p>}
                                                            </div>
                                                        </div>
                                                        <div className="signature-item">
                                                            <span><FaSignature className="pill-icon" /> Aprobó</span>
                                                            <div className="signature-box">
                                                                {detailedData.firmas_aprobo ? (
                                                                    detailedData.firmas_aprobo.startsWith('data:image')
                                                                        ? <img src={detailedData.firmas_aprobo} alt="Firma de quien aprueba" className="signature-display" />
                                                                        : <p className="signature-text">{detailedData.firmas_aprobo}</p>
                                                                ) : <p className="muted">Sin firma</p>}
                                                            </div>
                                                        </div>
                                                        <div className="signature-item">
                                                            <span><FaSignature className="pill-icon" /> Revisó</span>
                                                            <div className="signature-box">
                                                                {detailedData.firmas_reviso ? (
                                                                    detailedData.firmas_reviso.startsWith('data:image')
                                                                        ? <img src={detailedData.firmas_reviso} alt="Firma de quien revisa" className="signature-display" />
                                                                        : <p className="signature-text">{detailedData.firmas_reviso}</p>
                                                                ) : <p className="muted">Sin firma</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="error-message">No se pudieron cargar los detalles.</div>
                        )}
                        {isAdding && newMaintenanceData && (
                            <>
                                <div className="details-header">
                                    <h3>Crear Nuevo Mantenimiento</h3>
                                    <div className="details-actions">
                                        <button type="button" className="action-btn save" onClick={handleSaveNew}>Guardar</button>
                                        <button type="button" className="action-btn cancel" onClick={() => setIsAdding(false)}>Cancelar</button>
                                    </div>
                                </div>
                                <div className="details-grid">
                                    <div className="details-list">
                                        <form onSubmit={handleSaveNew}>
                                            <div className="form-section">
                                                <h4>Información del Equipo</h4>
                                                <div className="equipment-selection-container">
                                                    <label>Buscar y Seleccionar Equipo:</label>
                                                    <select
                                                        name="equipoId"
                                                        value={selectedEquipoId}
                                                        onChange={handleFormChange}
                                                        required
                                                        className="equipment-select-pro"
                                                    >
                                                        <option value="">-- Seleccionar un equipo --</option>
                                                        {equipos.map(eq => (
                                                            <option key={eq.id} value={eq.id}>
                                                                {eq.codigo} - {eq.usuario} ({eq.tipo})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-grid-inner info-card-grid">
                                                    <div className="info-field"><span>Usuario:</span><input name="usuario" value={newMaintenanceData.usuario} readOnly /></div>
                                                    <div className="info-field"><span>Área:</span><input name="area" value={newMaintenanceData.area} readOnly /></div>
                                                    <div className="info-field"><span>Tipo:</span><input name="tipo" value={newMaintenanceData.tipo} readOnly /></div>
                                                    <div className="info-field"><span>Marca:</span><input name="marca" value={newMaintenanceData.marca} readOnly /></div>
                                                    <div className="info-field"><span>Código:</span><input name="codigo" value={newMaintenanceData.codigo} readOnly /></div>
                                                </div>
                                                <hr />
                                                <h4>Detalles del Mantenimiento</h4>
                                                <label>Actividades Realizadas: <textarea name="actividades_realizadas" value={newMaintenanceData.actividades_realizadas} onChange={handleFormChange} rows="4"></textarea></label>
                                                <label>Observaciones: <textarea name="observaciones" value={newMaintenanceData.observaciones} onChange={handleFormChange} rows="3"></textarea></label>
                                                <hr />
                                                <h4>Fechas Clave</h4>
                                                <div className="form-grid-inner">
                                                    <label>Fecha de Elaboración: <input type="date" name="fecha_de_elaboracion" value={moment(newMaintenanceData.fecha_de_elaboracion).format('YYYY-MM-DD')} onChange={handleFormChange} /></label>
                                                    <label>Fecha de Ejecución: <input type="date" name="fecha_de_ejecucion" value={newMaintenanceData.fecha_de_ejecucion ? moment(newMaintenanceData.fecha_de_ejecucion).format('YYYY-MM-DD') : ''} onChange={handleFormChange} /></label>
                                                    <label>Fecha Último Mantenimiento: <input type="date" name="fecha_ultimo_mantenimiento" value={newMaintenanceData.fecha_ultimo_mantenimiento ? moment(newMaintenanceData.fecha_ultimo_mantenimiento).format('YYYY-MM-DD') : ''} onChange={handleFormChange} /></label>
                                                    <label>Fecha Próximo Mantenimiento: <input type="date" name="fecha_actual_de_mantenimiento" value={newMaintenanceData.fecha_actual_de_mantenimiento ? moment(newMaintenanceData.fecha_actual_de_mantenimiento).format('YYYY-MM-DD') : ''} onChange={handleFormChange} /></label>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="details-meta">
                                        <div className="signature-container">
                                            <h4>Firmas</h4>
                                            <div className="signature-edit">
                                                <div className="signature-options">
                                                    <label><input type="radio" name="newSignatureType" value="text" checked={signatureType === 'text'} onChange={() => setSignatureType('text')} /> Escribir nombre</label>
                                                    <label><input type="radio" name="newSignatureType" value="image" checked={signatureType === 'image'} onChange={() => setSignatureType('image')} /> Subir firma</label>
                                                </div>
                                                {signatureType === 'text' ? (
                                                    <>
                                                        <input name="firmas_tecnico" placeholder="Escriba el nombre del técnico" value={newMaintenanceData.firmas_tecnico || ''} onChange={handleFormChange} />
                                                        <input name="firmas_aprobo" placeholder="Escriba el nombre de quien aprueba" value={newMaintenanceData.firmas_aprobo || ''} onChange={handleFormChange} />
                                                        <input name="firmas_reviso" placeholder="Escriba el nombre de quien revisa" value={newMaintenanceData.firmas_reviso || ''} onChange={handleFormChange} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <label>Firma Técnico:</label>
                                                            <input type="file" accept="image/*" onChange={(e) => handleNewSignatureImageChange(e, 'firmas_tecnico')} />
                                                            {newMaintenanceData.firmas_tecnico && <img src={newMaintenanceData.firmas_tecnico} alt="Vista previa de la firma" className="signature-display" />}
                                                        </div>
                                                        <div>
                                                            <label>Firma Aprobó:</label>
                                                            <input type="file" accept="image/*" onChange={(e) => handleNewSignatureImageChange(e, 'firmas_aprobo')} />
                                                            {newMaintenanceData.firmas_aprobo && <img src={newMaintenanceData.firmas_aprobo} alt="Vista previa de la firma" className="signature-display" />}
                                                        </div>
                                                        <div>
                                                            <label>Firma Revisó:</label>
                                                            <input type="file" accept="image/*" onChange={(e) => handleNewSignatureImageChange(e, 'firmas_reviso')} />
                                                            {newMaintenanceData.firmas_reviso && <img src={newMaintenanceData.firmas_reviso} alt="Vista previa de la firma" className="signature-display" />}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div >
            )}
        </div >
    );
}

export default MaintenancePage;