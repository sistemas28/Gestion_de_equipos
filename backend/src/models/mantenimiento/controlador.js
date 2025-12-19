const TABLA = 'mantenimiento';
module.exports = function (dbInyectada){
    let db = dbInyectada;

if(!db){
    db = require('../../DB/mysql');
}



function todos(){
    // db.todos devuelve un array de filas. Mapeamos para exponer solo los campos solicitados.
    return db.todos(TABLA).then(rows => {
        return rows.map(r => ({
            id: r.id,
            usuario: r.usuario,
            area: r.area,
            tipo: r.tipo,
            codigo: r.id, // El ID es el código del equipo
            fecha_ultimo_mantenimiento: r.fecha_ultimo_mantenimiento,
            fecha_actual_de_mantenimiento: r.fecha_actual_de_mantenimiento,
        }));
    });
}




function uno(id){
    // db.uno devuelve un array con la(s) fila(s) que coinciden. Normalmente será un array con un elemento.
    return db.uno(TABLA, id).then(result => {
        // Aceptar tanto que result sea un array o un objeto según implementación
        const row = Array.isArray(result) ? result[0] : result;
        if(!row){
            return null;
        }
        return {
            id: row.id.toString(), // Convertir a string para consistencia con frontend
            usuario: row.usuario,
            area: row.area,
            tipo: row.tipo,
            codigo: row.codigo || row.id.toString(), // Usar el campo codigo si existe
            fecha_ultimo_mantenimiento: row.fecha_ultimo_mantenimiento,
            fecha_actual_de_mantenimiento: row.fecha_actual_de_mantenimiento,
            firmas_tecnico: row.firmas_tecnico,
            firmas_aprobo: row.firmas_aprobo,
            firmas_reviso: row.firmas_reviso,
            marca: row.marca,
            actividades_realizadas: row.actividades_realizadas,
            observaciones: row.observaciones,
            fecha_de_elaboracion: row.fecha_de_elaboracion,
            fecha_de_ejecucion: row.fecha_de_ejecucion ? new Date(row.fecha_de_ejecucion * 1000).toISOString().split('T')[0] : null, // Convertir timestamp a fecha
        };
    });
}











function agregar(body){
    console.log('=== DEBUG CONTROLADOR AGREGAR ===');
    console.log('body recibido:', JSON.stringify(body, null, 2));
    
    // El ID del mantenimiento DEBE ser el código del equipo (body.id contiene el código del equipo)
    if (!body.id) {
        throw new Error('El código del equipo es requerido para crear un mantenimiento');
    }
    
    // Convertir el ID de string a número para la tabla existente
    const idNumerico = parseInt(body.id, 10);
    if (isNaN(idNumerico)) {
        throw new Error('El código del equipo debe ser un número válido');
    }
    
    const authData = {
        // Adaptado para la estructura de tabla existente
        id: idNumerico, // INT en la tabla
        usuario: body.usuario || 'Usuario no especificado',
        area: body.area || 'Área no especificada', 
        tipo: body.tipo || 'Tipo no especificado',
        codigo: body.id, // Guardamos el código del equipo como string
        fecha_ultimo_mantenimiento: body.fecha_ultimo_mantenimiento || '1900-01-01',
        fecha_actual_de_mantenimiento: body.fecha_actual_de_mantenimiento || '1900-01-01',
        firmas_tecnico: body.firmas_tecnico || 'Sin firma',
        firmas_aprobo: body.firmas_aprobo || 'Sin firma',
        firmas_reviso: body.firmas_reviso || 'Sin firma',
        marca: body.marca || 'Marca no especificada',
        actividades_realizadas: body.actividades_realizadas || 'Sin actividades especificadas',
        observaciones: body.observaciones || 'Sin observaciones',
        fecha_de_elaboracion: body.fecha_de_elaboracion || new Date().toISOString().split('T')[0],
        fecha_de_ejecucion: body.fecha_de_ejecucion ? Math.floor(new Date(body.fecha_de_ejecucion).getTime() / 1000) : 0, // INT timestamp en la tabla
        // No enviamos equipo_id ya que la relación es directa por ID
    };
    
    console.log('authData a insertar:', JSON.stringify(authData, null, 2));

    return db.agregar(TABLA, authData);
}




function modificar(id, body){
    const authData = {
        // Construimos el objeto explícitamente para evitar campos no deseados
        usuario: body.usuario,
        area: body.area,
        tipo: body.tipo,
        codigo: id, // El ID es el código del equipo
        fecha_ultimo_mantenimiento: body.fecha_ultimo_mantenimiento,
        fecha_actual_de_mantenimiento: body.fecha_actual_de_mantenimiento,
        firmas_tecnico: body.firmas_tecnico,
        firmas_aprobo: body.firmas_aprobo,
        firmas_reviso: body.firmas_reviso,
        marca: body.marca,
        actividades_realizadas: body.actividades_realizadas,
        observaciones: body.observaciones,
        fecha_de_elaboracion: body.fecha_de_elaboracion,
        fecha_de_ejecucion: body.fecha_de_ejecucion,
        // Nota: No incluimos equipo_id - la relación es directa por ID
    };

    // Usamos UPDATE para modificar el registro existente
    // El ID no se modifica (es el código del equipo)
    return db.actualizar(TABLA, id, authData);
}

function eliminar(id){
    return db.eliminar(TABLA, id);
}



function historialPorEquipo(codigoEquipo) {
    // Usamos la función query para obtener todos los registros que coincidan con el ID (código de equipo)
    // El codigoEquipo puede ser string o número, lo convertimos a número
    const idNumerico = parseInt(codigoEquipo, 10);
    if (isNaN(idNumerico)) {
        return Promise.resolve([]); // Si no es un número válido, retornamos array vacío
    }
    return db.query(TABLA, { id: idNumerico });
}


return {
    todos,
    uno,
    agregar,
    modificar,
    eliminar,
    historialPorEquipo,
}
}