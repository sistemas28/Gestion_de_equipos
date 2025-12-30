
const TABLA = 'CopiasDeSeguridad';
module.exports = function (dbInyectada) {

    let db = dbInyectada;

    if (!db) {
        db = require('../../DB/mysql');
    }

    function todos() {
        return db.todos(TABLA);
    }

    function uno(id) {
        return db.uno(TABLA, id);
    }

    function agregar(body) {
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const copiaData = {
            id: body.id,
            equipo_id: body.equipo_id,
            usuario: body.usuario || '',
            area: body.area || '',
            tipo: body.tipo || '',
            marca: body.marca || '',
            codigo: body.codigo || '',
            fecha: body.fecha,
            estado_copia: body.estado_copia || 'Pendiente',
            hora_inicio: body.hora_inicio || null,
            hora_fin: body.hora_fin || null,
            tipo_copia: body.tipo_copia || 'Completa',
            ubicacion_almacenamiento: body.ubicacion_almacenamiento || '',
            tamaño_datos: body.tamaño_datos || '',
            tiempo_duracion: body.tiempo_duracion || '',
            observaciones: body.observaciones || '',
            responsable: body.responsable || '',
            fecha_creacion: now,
            fecha_actualizacion: now,
        };

        return db.agregar(TABLA, copiaData);
    }

    function modificar(id, body) {
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const copiaData = {};

        if (body.equipo_id !== undefined) copiaData.equipo_id = body.equipo_id;
        if (body.usuario !== undefined) copiaData.usuario = body.usuario;
        if (body.area !== undefined) copiaData.area = body.area;
        if (body.tipo !== undefined) copiaData.tipo = body.tipo;
        if (body.marca !== undefined) copiaData.marca = body.marca;
        if (body.codigo !== undefined) copiaData.codigo = body.codigo;
        if (body.fecha !== undefined) copiaData.fecha = body.fecha;
        if (body.estado_copia !== undefined) copiaData.estado_copia = body.estado_copia;
        if (body.hora_inicio !== undefined) copiaData.hora_inicio = body.hora_inicio;
        if (body.hora_fin !== undefined) copiaData.hora_fin = body.hora_fin;
        if (body.tipo_copia !== undefined) copiaData.tipo_copia = body.tipo_copia;
        if (body.ubicacion_almacenamiento !== undefined) copiaData.ubicacion_almacenamiento = body.ubicacion_almacenamiento;
        if (body.tamaño_datos !== undefined) copiaData.tamaño_datos = body.tamaño_datos;
        if (body.tiempo_duracion !== undefined) copiaData.tiempo_duracion = body.tiempo_duracion;
        if (body.observaciones !== undefined) copiaData.observaciones = body.observaciones;
        if (body.responsable !== undefined) copiaData.responsable = body.responsable;

        copiaData.fecha_actualizacion = now;

        return db.actualizar(TABLA, id, copiaData);
    }

    function eliminar(id) {
        return db.eliminar(TABLA, id);
    }


    return {
        todos,
        uno,
        agregar,
        modificar,
        eliminar,
    }
}
