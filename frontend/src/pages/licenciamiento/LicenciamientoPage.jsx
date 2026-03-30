import React, { useEffect, useState } from "react";
import './licenciamientoPage.css';
import api from '../../api/axios';
import moment from 'moment'; // Importar moment para manejar fechas si es necesario
import { FaTimes } from 'react-icons/fa';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { generateReport } from '../../utils/reportGenerator';
import LicenciamientoDetailsModal from '../../components/licenciamiento/LicenciamientoDetailsModal';
import CreateLicenciamientoModal from '../../components/licenciamiento/CreateLicenciamientoModal';
import EditLicenciamientoModal from '../../components/licenciamiento/EditLicenciamientoModal';

// Importar estilos del modal de edición
import '../../components/licenciamiento/EditLicenciamientoModal.css';

function LicenciamientoPage() {
    const [licenciamientoData, setLicenciamientoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailedData, setDetailedData] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [isAdding, setIsAdding] = useState(false); // Para controlar el modal de "agregar"
    const [newLicenciamientoData, setNewLicenciamientoData] = useState(null); // Datos para el nuevo licenciamiento
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [equipos, setEquipos] = useState([]); // Nuevo estado para almacenar los equipos
    const [selectedEquipoId, setSelectedEquipoId] = useState(''); // Estado para el equipo seleccionado en el dropdown
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLicenciamientoData();
        fetchEquipos(); // Cargar equipos una vez al montar el componente
    }, []);

    async function fetchLicenciamientoData() {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/licenciamiento');
            setLicenciamientoData(response.data.body || []);
        } catch (err) {
            console.error("Error fetching licenciamiento data:", err);
            setError("Error al cargar los datos de licenciamiento. Por favor, inténtalo de nuevo más tarde.");
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
            // No es un error fatal para la vista principal, solo para la edición.
        }
    }

    async function handleRowClick(item) {
        if (selectedItem && selectedItem.id === item.id) {
            setSelectedItem(null);
            setDetailedData(null);
            return;
        }
        setIsEditing(false);
        setEditFormData(null);
        setSelectedItem(item);
        setDetailedData(null);
        setLoadingDetails(true);
        // Intentar encontrar un equipo que coincida para pre-seleccionar en el dropdown
        const matchingEquipo = equipos.find(eq =>
            eq.usuario === item.usuario &&
            eq.area === item.area &&
            eq.tipo === item.tipo
            // La marca no está en el modelo de licenciamiento, así que no la usamos para la coincidencia
        );
        setSelectedEquipoId(matchingEquipo ? matchingEquipo.id : '');
        try {
            const response = await api.get(`/licenciamiento/${item.id}`);
            setDetailedData(response.data.body);
        } catch (err) {
            console.error("Error fetching licenciamiento details:", err);
            setError("Error al cargar los detalles del licenciamiento.");
            setDetailedData(null);
        } finally {
            setLoadingDetails(false);
        }
    }

    const handleOpenAddModal = () => {
        // Inicializa el formulario para un nuevo licenciamiento
        setNewLicenciamientoData({
            usuario: '',
            area: '',
            tipo: '',
            codigo: '',
            descripcion: '',
            sistema_operativo: '',
            software_de_oficina: '',
            otro_software: '',
        });
        setSelectedEquipoId(''); // Resetea el equipo seleccionado
        setSelectedItem(null); // Cierra el panel de detalles si está abierto
        setDetailedData(null); // Limpia los datos detallados del item anterior
        setIsAdding(true);
    };

    const handleEdit = () => {
        setEditFormData({ ...detailedData });
        setIsEditing(true);
        setSelectedEquipoId(equipos.find(eq => eq.usuario === detailedData.usuario && eq.area === detailedData.area && eq.tipo === detailedData.tipo)?.id || '');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditFormData(null);
        setIsAdding(false);
        setSelectedEquipoId(''); // Limpiar selección de equipo
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "equipoId") {
            setSelectedEquipoId(value);
            const selectedEquipo = equipos.find(eq => eq.id === parseInt(value));
            if (selectedEquipo) {
                setEditFormData(prev => ({
                    ...prev,
                    usuario: selectedEquipo.usuario,
                    area: selectedEquipo.area,
                    tipo: selectedEquipo.tipo,
                }));
            } else {
                // Si no se selecciona ningún equipo, limpiar los campos relacionados
                setEditFormData(prev => ({ ...prev, usuario: '', area: '', tipo: '' }));
            }
        } else
            setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNewFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "equipoId") {
            setSelectedEquipoId(value);
            const selectedEquipo = equipos.find(eq => eq.id === parseInt(value));
            if (selectedEquipo) {
                setNewLicenciamientoData(prev => ({
                    ...prev,
                    usuario: selectedEquipo.usuario,
                    area: selectedEquipo.area,
                    tipo: selectedEquipo.tipo,
                    codigo: selectedEquipo.codigo,
                }));
            } else {
                setNewLicenciamientoData(prev => ({ ...prev, usuario: '', area: '', tipo: '', codigo: '' }));
            }
        } else {
            setNewLicenciamientoData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...editFormData, id: detailedData.id };
            await api.put(`/licenciamiento/${detailedData.id}`, payload);
            // Volvemos a pedir los datos para tener la versión más actualizada
            const response = await api.get(`/licenciamiento/${detailedData.id}`);
            setDetailedData(response.data.body);
            setIsEditing(false);
            // Actualizamos la lista principal para reflejar los cambios
            fetchLicenciamientoData();
        } catch (err) {
            console.error("Error saving licenciamiento data:", err);
            setError("Error al guardar los cambios.");
        }
    };

    const handleSaveNew = async (e) => {
        e.preventDefault();
        if (!selectedEquipoId) {
            setError("Por favor, selecciona un equipo para asociar el licenciamiento.");
            return;
        }
        const selectedEquipo = equipos.find(eq => eq.id === parseInt(selectedEquipoId, 10));
        if (!selectedEquipo) {
            setError("El equipo seleccionado no tiene un código de inventario válido. No se puede crear el licenciamiento.");
            return;
        }

        try {
            const dataToSend = {
                ...newLicenciamientoData,
                // Enviamos el ID del equipo para crear la relación
                equipo_id: parseInt(selectedEquipoId, 10)
            };
            await api.post('/licenciamiento', dataToSend);
            setIsAdding(false);
            setNewLicenciamientoData(null);
            await fetchLicenciamientoData();
        } catch (err) {
            console.error("Error creating new licenciamiento:", err);
            setError("Error al crear el nuevo licenciamiento.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el licenciamiento #${detailedData.id}?`)) {
            try {
                await api.delete(`/licenciamiento/${detailedData.id}`);
                setSelectedItem(null); // Cierra el modal
                fetchLicenciamientoData(); // Actualiza la lista
            } catch (err) {
                console.error("Error deleting licenciamiento data:", err);
                setError("Error al eliminar el registro.");
            }
        }
    };

    const handleDownloadPdf = () => {
        if (!detailedData) return;

        const sections = [
            {
                type: 'info',
                title: 'INFORMACIÓN DEL EQUIPO',
                data: [
                    { label: 'CÓDIGO INVENTARIO', value: detailedData.id || 'N/A' },
                    { label: 'USUARIO', value: detailedData.usuario || 'N/A' },
                    { label: 'ÁREA', value: detailedData.area || 'N/A' },
                    { label: 'TIPO DE EQUIPO', value: detailedData.tipo || 'N/A' },
                    { label: '', value: '' },
                    { label: '', value: '' }
                ]
            },
            {
                type: 'info',
                title: 'LICENCIAS DE SOFTWARE',
                data: [
                    { label: 'SISTEMA OPERATIVO', value: detailedData.sistema_operativo || 'No especificado' },
                    { label: 'SOFTWARE DE OFICINA', value: detailedData.software_de_oficina || 'No especificado' },
                    { label: 'OTRO SOFTWARE', value: detailedData.otro_software || 'No especificado' },
                    { label: '', value: '' }
                ]
            },
            {
                type: 'info',
                title: 'DESCRIPCIÓN Y DETALLES',
                data: [
                    { label: 'DESCRIPCIÓN COMPLETA', value: detailedData.descripcion || 'Sin descripción adicional proporcionada.' }
                ]
            }
        ];

        generateReport(
            'PROCESO DE GESTIÓN DE INFORMÁTICA',
            'REPORTE DE LICENCIAMIENTO',
            'FT-LICE-001',
            '1.0',
            sections,
            `Reporte_Licenciamiento_${detailedData.id}.pdf`
        );
    };

    return (
        <div className="licenciamiento-page">
            <div className="page-header">
                <h2 className="page-title">Gestión de Licenciamiento</h2>
                <div className="header-actions">
                    <button className="action-btn save" onClick={handleOpenAddModal} disabled={loading}>
                        Crear Licenciamiento
                    </button>
                    <button className="refresh-btn" onClick={fetchLicenciamientoData} disabled={loading}>
                        {loading ? 'Cargando...' : 'Actualizar Datos'}
                    </button>
                </div>
            </div>


            {error && <div className="error-message">{error}</div>}

            {loading && licenciamientoData.length === 0 && <div className="loading-message">Cargando datos de licenciamiento...</div>}

            {!loading && licenciamientoData.length === 0 && !error && (
                <div className="no-data-message">No hay datos de licenciamiento disponibles.</div>
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

            {!loading && licenciamientoData.length > 0 && (
                <div className="licenciamiento-table-container card">
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Usuario</th>
                                <th>Área</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licenciamientoData
                                .filter(item =>
                                    (item.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                                    (String(item.usuario || '').toLowerCase().includes(searchTerm.toLowerCase()))
                                ).map((item) => (
                                    <tr key={item.id} onClick={() => handleRowClick(item)} className={selectedItem?.id === item.id ? 'selected' : ''}>
                                        <td>{item.id}</td>
                                        <td>{item.usuario}</td>
                                        <td>{item.area}</td>
                                        <td>{item.tipo}</td>
                                        <td>{item.descripcion}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

<LicenciamientoDetailsModal
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
                equipos={equipos}
                selectedEquipoId={selectedEquipoId}
                setSelectedEquipoId={setSelectedEquipoId}
                formatDate={(dateString) => {
                    if (!dateString) return 'N/A';
                    return moment(dateString).format('LL');
                }}
            />

            <CreateLicenciamientoModal
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                newLicenciamientoData={newLicenciamientoData}
                equipos={equipos}
                selectedEquipoId={selectedEquipoId}
                setSelectedEquipoId={setSelectedEquipoId}
                handleFormChange={handleNewFormChange}
                handleSaveNew={handleSaveNew}
                handleCancel={handleCancel}
            />

            <EditLicenciamientoModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                editFormData={editFormData}
                equipos={equipos}
                selectedEquipoId={selectedEquipoId}
                setSelectedEquipoId={setSelectedEquipoId}
                handleFormChange={handleFormChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
            />
        </div>
    );
}

export default LicenciamientoPage;
