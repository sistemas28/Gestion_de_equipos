const TABLA = 'licenciamiento';
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
            descripcion: r.descripcion,
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
            id: row.id,
            usuario: row.usuario,
            area: row.area,
            tipo: row.tipo,
            descripcion: row.descripcion,
            sistema_operativo: row.sistema_operativo,
            software_de_oficina: row.software_de_oficina,
            otro_software: row.otro_software,
        };
    });
}





async function agregar(body){
    try {
        console.log('=== INICIO AGREGAR LICENCIAMIENTO ===');
        console.log('Datos recibidos:', body);
        
        // Ahora recibimos equipo_id del frontend
        if (!body.equipo_id) {
            throw new Error('El ID del equipo es requerido para crear un licenciamiento');
        }
        
        console.log('Buscando equipo con ID:', body.equipo_id);
        
        // Buscar el código del equipo usando el ID
        const equipos = await db.uno('equipos', body.equipo_id);
        console.log('Resultado de búsqueda de equipo:', equipos);
        
        const equipo = Array.isArray(equipos) ? equipos[0] : equipos;
        
        if (!equipo) {
            throw new Error('Equipo no encontrado');
        }
        
        console.log('Equipo encontrado:', equipo);
        
        // El ID del licenciamiento es exactamente el código del equipo
        const codigoEquipo = String(equipo.codigo_de_equipo || '');
        console.log('Código del equipo extraído:', codigoEquipo);
        
        if (!codigoEquipo) {
            throw new Error('El equipo seleccionado no tiene un código de inventario válido');
        }
        
        const authData = {
            // El ID del licenciamiento es exactamente el código del equipo
            id: codigoEquipo,
            usuario: body.usuario || '',
            area: body.area || '',
            tipo: body.tipo || '',
            descripcion: body.descripcion || '',
            sistema_operativo: body.sistema_operativo || '',
            software_de_oficina: body.software_de_oficina || '',
            otro_software: body.otro_software || '',
        };
        
        console.log('Datos a insertar en licenciamiento:', authData);
        console.log('Tabla objetivo:', TABLA);

        const resultado = await db.agregar(TABLA, authData);
        console.log('Resultado de inserción:', resultado);
        console.log('=== FIN AGREGAR LICENCIAMIENTO ===');
        
        return resultado;
        
    } catch (error) {
        console.error('Error en agregar licenciamiento:', error);
        throw error;
    }
}

function modificar(body){
    const authData = {
        id: body.id,
        usuario: body.usuario,
        area: body.area,
        tipo: body.tipo,
        descripcion: body.descripcion,
        sistema_operativo: body.sistema_operativo,
        software_de_oficina: body.software_de_oficina,
        otro_software: body.otro_software,
    };

    if(body.usuario){
        authData.usuario = body.usuario
    }

    // Usamos la misma operación que agregar (INSERT ... ON DUPLICATE KEY UPDATE)
    return db.agregar(TABLA, authData);
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