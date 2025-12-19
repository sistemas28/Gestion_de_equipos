
const TABLA = 'CopiasDeSeguridad';
module.exports = function (dbInyectada){

    let db = dbInyectada;

if(!db){
    db = require('../../DB/mysql');
}

function todos(){
    return db.todos(TABLA);
}

function uno(id){
    return db.uno(TABLA, id);
}

function agregar(body){
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

function modificar(id, body){
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const copiaData = {
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
        fecha_actualizacion: now,
    };

    return db.actualizar(TABLA, id, copiaData);
}

function eliminar(id){
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
