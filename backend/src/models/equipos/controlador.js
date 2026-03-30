const TABLA = 'equipos';

module.exports = function (dbInyectada) {
    let db = dbInyectada;

    if (!db) {
        db = require('../../DB/mysql');
    }

    function todos() {
        // Mapeamos los nombres de las columnas de la BD a los que espera el frontend
        return db.todos(TABLA).then(equipos => {
            return equipos.map(equipo => ({
                ...equipo, // Incluir todos los campos originales de la BD
                id: equipo.id,
                usuario: equipo.nombre_de_usuario_asignado,
                area: equipo.Area,
                tipo: equipo.tipo,
                marca: equipo.marca,
                codigo: String(equipo.id), // Usamos el ID como código de inventario
                so: equipo.sistema_operativo,
                procesador: equipo.procesador,
                ram: equipo.ram,
                disco_duro: equipo.disco_duro,
                modelo: equipo.modelo || '',
                serial: equipo.serial || '',
                licencia: equipo.licencia || ''
            }));
        });
    }

    function uno(id) {
        // Hacemos lo mismo para un solo registro
        return db.uno(TABLA, id).then(equipos => {
            const equipo = equipos[0];
            if (!equipo) return null;
            return {
                ...equipo, // Incluir todos los campos originales
                id: equipo.id,
                usuario: equipo.nombre_de_usuario_asignado,
                area: equipo.Area,
                tipo: equipo.tipo,
                marca: equipo.marca,
                codigo: String(equipo.id), // Usamos el ID como código de inventario
                so: equipo.sistema_operativo,
                procesador: equipo.procesador,
                ram: equipo.ram,
                disco_duro: equipo.disco_duro,
                modelo: equipo.modelo || '',
                serial: equipo.serial || '',
                licencia: equipo.licencia || ''
            };
        });
    }

    async function agregar(body) {
        // Mapeamos los datos del frontend a los nombres de columna de la BD
        // No validamos el código ya que será el ID auto-generado
        const equipo = {
            nombre_de_usuario_asignado: body.usuario,
            Area: body.area,
            tipo: body.tipo,
            marca: body.marca,
            // No guardamos codigo_de_equipo, usaremos el ID como código de inventario
            sistema_operativo: body.sistema_operativo || body.so,
            procesador: body.procesador,
            ram: body.memoria_ram || body.ram,
            disco_duro: body.disco_duro,
            modelo: body.modelo || '',
            serial: body.serial || '',
            licencia: body.licencia || '',
            caracteristicas_especificas: body.caracteristicas_especificas || ''
        };

        const resultado = await db.agregar(TABLA, equipo);

        // Crear entrada inicial en el historial
        if (resultado && resultado.insertId) {
            const historial = {
                equipo_id: resultado.insertId,
                codigo_inventario: String(resultado.insertId), // Usamos el ID como código de inventario
                usuario_anterior: 'Sistema',
                usuario_nuevo: body.usuario,
                area_anterior: 'Sin asignar',
                area_nueva: body.area,
                motivo_cambio: 'Registro inicial del equipo',
                observaciones: 'Equipo agregado al sistema'
            };

            await db.agregar('historial_equipos', historial);
        }

        return resultado;
    }

    async function modificar(id, body) {
        // Primero obtenemos el equipo actual para comparar
        const equipoActual = await uno(id);

        // No validamos el código ya que será el ID auto-generado
        // La función de modificar también necesita mapear los campos
        const equipo = {
            nombre_de_usuario_asignado: body.usuario,
            Area: body.area,
            tipo: body.tipo,
            marca: body.marca,
            // No actualizamos codigo_de_equipo, usaremos el ID como código de inventario
            sistema_operativo: body.sistema_operativo || body.so,
            procesador: body.procesador,
            ram: body.memoria_ram || body.ram,
            disco_duro: body.disco_duro,
            modelo: body.modelo || '',
            serial: body.serial || '',
            licencia: body.licencia || '',
            caracteristicas_especificas: body.caracteristicas_especificas || ''
        };

        // Verificar si hubo cambio de usuario o área
        if (equipoActual && (equipoActual.usuario !== body.usuario || equipoActual.area !== body.area)) {
            // Registrar en el historial
            const historial = {
                equipo_id: id,
                codigo_inventario: String(id), // Usamos el ID como código de inventario
                usuario_anterior: equipoActual.usuario,
                usuario_nuevo: body.usuario,
                area_anterior: equipoActual.area,
                area_nueva: body.area,
                motivo_cambio: body.motivo_cambio || 'Actualización de equipo',
                observaciones: body.observaciones || null
            };

            await db.agregar('historial_equipos', historial);
        }

        return db.actualizar(TABLA, id, equipo);
    }

    function eliminar(id) {
        return db.eliminar(TABLA, id);
    }

    return { todos, uno, agregar, modificar, eliminar };
}