import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './HistorialEquiposPage.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/LOGO_INSTITUCIONAL.jpg';
import moment from 'moment';
import { generateReport } from '../../utils/reportGenerator';

function HistorialEquiposPage() {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredHistorial, setFilteredHistorial] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchHistorial();
        fetchStats();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = historial.filter(item =>
                (String(item.codigo_inventario || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
                (String(item.usuario_anterior || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
                (String(item.usuario_nuevo || '').toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredHistorial(filtered);
        } else {
            setFilteredHistorial(historial);
        }
    }, [searchTerm, historial]);

    const fetchHistorial = async () => {
        try {
            setLoading(true);
            const response = await api.get('/historial-equipos');
            setHistorial(response.data.body || []);
            setError(null);
        } catch (err) {
            console.error("Error al obtener historial:", err);
            setError('No se pudo cargar el historial de equipos.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/historial-equipos/estadisticas');
            setStats(response.data.body || null);
        } catch (err) {
            console.error("Error al obtener estadísticas:", err);
        }
    };

    const getDisplayValue = (val) => (val && typeof val === 'string' && val.trim() !== '') ? val : 'N/A';

    const handleDownloadPDF = () => {
        const sections = [
            {
                type: 'table',
                headers: ['Código', 'Usuario Anterior', 'Usuario Nuevo', 'Área Anterior', 'Área Nueva', 'Fecha', 'Motivo'],
                body: filteredHistorial.map(item => [
                    getDisplayValue(item.codigo_inventario),
                    getDisplayValue(item.usuario_anterior),
                    getDisplayValue(item.usuario_nuevo),
                    getDisplayValue(item.area_anterior),
                    getDisplayValue(item.area_nueva),
                    moment(item.fecha_cambio).format('DD/MM/YYYY HH:mm'),
                    getDisplayValue(item.motivo_cambio)
                ])
            }
        ];

        generateReport(
            'PROCESO DE GESTIÓN DE INFORMÁTICA',
            'HISTORIAL DE EQUIPOS',
            'FT-HIST-001',
            '1.0',
            sections,
            `Historial_Equipos_${moment().format('YYYY-MM-DD')}.pdf`
        );
    };

    const handleDownloadPDFByCodigo = (codigo) => {
        const historialCodigo = filteredHistorial.filter(item => item.codigo_inventario === codigo);

        if (historialCodigo.length === 0) {
            alert('No hay historial para este código de inventario');
            return;
        }

        const primerRegistro = historialCodigo[0];

        const sections = [
            {
                type: 'info',
                title: 'INFORMACIÓN DEL EQUIPO',
                data: [
                    { label: 'CÓDIGO DE INVENTARIO', value: codigo },
                    { label: 'TIPO', value: getDisplayValue(primerRegistro.tipo) },
                    { label: 'MARCA', value: getDisplayValue(primerRegistro.marca) },
                    { label: 'TOTAL CAMBIOS', value: String(historialCodigo.length) }
                ]
            },
            {
                type: 'table',
                headers: ['Usuario Anterior', 'Usuario Nuevo', 'Área Anterior', 'Área Nueva', 'Fecha', 'Motivo'],
                body: historialCodigo.map(item => [
                    getDisplayValue(item.usuario_anterior),
                    getDisplayValue(item.usuario_nuevo),
                    getDisplayValue(item.area_anterior),
                    getDisplayValue(item.area_nueva),
                    moment(item.fecha_cambio).format('DD/MM/YYYY HH:mm'),
                    getDisplayValue(item.motivo_cambio)
                ])
            }
        ];

        generateReport(
            'PROCESO DE GESTIÓN DE INFORMÁTICA',
            `HISTORIAL DEL EQUIPO - ${codigo}`,
            `FT-HIST-${codigo}`,
            '1.0',
            sections,
            `Historial_${codigo}_${moment().format('YYYY-MM-DD')}.pdf`
        );
    };



    return (
        <div className="historial-equipos-page">
            <div className="page-header">
                <div>
                    <h1>Historial de Equipos</h1>
                    <p>Consulta el historial completo de cambios de usuarios y áreas de los equipos</p>
                    {stats && (
                        <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '14px', color: '#6c757d' }}>
                            <span>📦 <strong>{stats.total_equipos}</strong> equipos totales</span>
                            <span>📊 <strong>{stats.equipos_con_historial}</strong> con historial</span>
                            <span>🔄 <strong>{stats.total_cambios}</strong> cambios registrados</span>
                            {stats.total_equipos === stats.equipos_con_historial && (
                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Sincronizado</span>
                            )}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="action-btn save" onClick={handleDownloadPDF} disabled={loading || filteredHistorial.length === 0}>
                        Descargar PDF Completo
                    </button>
                    <button className="refresh-btn" onClick={fetchHistorial} disabled={loading}>
                        {loading ? 'Cargando...' : 'Actualizar'}
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por código de inventario o usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {loading && historial.length === 0 ? (
                <div className="loading-message">Cargando historial...</div>
            ) : (
                <div className="historial-container card">
                    {filteredHistorial.length === 0 ? (
                        <div className="no-data-message">
                            {searchTerm ? 'No se encontraron resultados para la búsqueda' : 'No hay historial de equipos disponible'}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Código Inventario</th>
                                        <th>Usuario Anterior</th>
                                        <th>Usuario Nuevo</th>
                                        <th>Área Anterior</th>
                                        <th>Área Nueva</th>
                                        <th>Fecha Cambio</th>
                                        <th>Motivo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHistorial.map((item) => (
                                        <tr key={item.id}>
                                            <td><strong>{item.codigo_inventario || 'N/A'}</strong></td>
                                            <td>{(item.usuario_anterior && item.usuario_anterior.trim()) ? item.usuario_anterior : 'N/A'}</td>
                                            <td>{(item.usuario_nuevo && item.usuario_nuevo.trim()) ? item.usuario_nuevo : 'N/A'}</td>
                                            <td>{(item.area_anterior && item.area_anterior.trim()) ? item.area_anterior : 'N/A'}</td>
                                            <td>{(item.area_nueva && item.area_nueva.trim()) ? item.area_nueva : 'N/A'}</td>
                                            <td>{moment(item.fecha_cambio).format('DD/MM/YYYY HH:mm')}</td>
                                            <td>{(item.motivo_cambio && item.motivo_cambio.trim()) ? item.motivo_cambio : 'Sin especificar'}</td>
                                            <td className="actions-cell">
                                                <button
                                                    className="action-btn-sm edit"
                                                    onClick={() => handleDownloadPDFByCodigo(item.codigo_inventario)}
                                                    title="Descargar PDF de este equipo"
                                                >
                                                    PDF
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default HistorialEquiposPage;
