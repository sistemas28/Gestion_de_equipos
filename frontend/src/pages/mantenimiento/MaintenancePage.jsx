import React, { useEffect, useState } from "react";
import "./maintenancePage.css";
import api from '../../api/axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNotifications } from '../../context/NotificationContext';
import {
    FaTimes, FaUser, FaBuilding, FaDesktop, FaTag,
    FaCalendarAlt, FaTools, FaFileAlt, FaSignature, FaSearch,
    FaPlus, FaTrash, FaCheckCircle, FaExclamationTriangle,
    FaDownload, FaSync, FaInfoCircle
} from 'react-icons/fa';
import useIsMobile from '../../hooks/useIsMobile';
import MaintenanceDetailsModal from '../../components/mantenimiento/MaintenanceDetailsModal';
import CreateMaintenanceModal from '../../components/mantenimiento/CreateMaintenanceModal';

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
    const { logActivity } = useNotifications();
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
        // Pre-seleccionar el equipo que coincide por ID (el ID del mantenimiento es el ID del equipo)
        setSelectedEquipoId(detailedData.id || '');
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
            logActivity('Mantenimiento Actualizado', `Se actualizó el mantenimiento para ${updatedData.usuario}`);
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
        if (!selectedEquipo) {
            console.error("Error: Equipo no válido", selectedEquipo);
            setError("El equipo seleccionado no tiene un código de inventario válido. No se puede crear el mantenimiento.");
            return;
        }

        // Verificar si ya existe un mantenimiento con el código de equipo (el ID será el código del equipo)
        const existingMaintenance = maintenanceData.find(maint =>
            maint.id?.toString() === selectedEquipo.id.toString()
        );

        if (existingMaintenance) {
            if (window.confirm(`Ya existe un mantenimiento para el equipo "${selectedEquipo.usuario}" con ID "${selectedEquipo.id}". ¿Deseas actualizar la información existente con los nuevos datos ingresados?`)) {
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
                // El ID del mantenimiento será igual al ID del equipo (sin equipo_id separado)
                id: selectedEquipo.id,
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
            
            // Enviar solicitud al backend
            await api.post('/mantenimiento', dataToSend);
            
            // Limpiar modal y actualizar datos
            setIsAdding(false);
            setNewMaintenanceData(null);
            logActivity('Mantenimiento Creado', `Se creó un nuevo mantenimiento para ${dataToSend.usuario}`);
            await fetchMaintenanceData();
        } catch (err) {
            console.error("Error creating new maintenance:", err);
            console.error("Error details:", err.response);

            // Manejar errores específicos
            if (err.response?.status === 409) {
                setError(`Ya existe un mantenimiento para el equipo "${selectedEquipo.usuario}" con ID "${selectedEquipo.id}". Cada equipo solo puede tener un mantenimiento.`);
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
                logActivity('Mantenimiento Eliminado', `Se eliminó el mantenimiento #${idToDelete}`);
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
                    codigo: selectedEquipo.id
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
                    { label: 'CÓDIGO INVENTARIO', value: detailedData.id || 'N/A' },
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
                                <th>Código</th>
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

            <MaintenanceDetailsModal
                isOpen={selectedItem !== null}
                onClose={() => setSelectedItem(null)}
                detailedData={detailedData}
                loadingDetails={loadingDetails}
                handleDownloadPdf={handleDownloadPdf}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isEditing={isEditing}
                handleSave={handleSave}
                handleCancel={handleCancel}
                editFormData={editFormData}
                handleFormChange={handleFormChange}
                signatureType={signatureType}
                setSignatureType={setSignatureType}
                handleSignatureImageChange={handleSignatureImageChange}
                handleNewSignatureImageChange={handleNewSignatureImageChange}
                equipos={equipos}
                selectedEquipoId={selectedEquipoId}
                setSelectedEquipoId={setSelectedEquipoId}
                formatDate={formatDate}
                calendarEvents={calendarEvents}
                calendarDate={calendarDate}
                setCalendarDate={setCalendarDate}
            />

            <CreateMaintenanceModal
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                newMaintenanceData={newMaintenanceData}
                equipos={equipos}
                selectedEquipoId={selectedEquipoId}
                setSelectedEquipoId={setSelectedEquipoId}
                handleFormChange={handleFormChange}
                handleNewSignatureImageChange={handleNewSignatureImageChange}
                handleSaveNew={handleSaveNew}
                handleCancel={handleCancel}
                signatureType={signatureType}
                setSignatureType={setSignatureType}
            />
        </div >
    );
}

export default MaintenancePage;