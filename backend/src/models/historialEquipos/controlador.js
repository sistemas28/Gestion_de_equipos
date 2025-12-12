const db = require('../../DB/mysql');

module.exports = function (dbInyectada) {
    let database = dbInyectada;
    if (!database) {
        database = db;
    }

    // Obtener todo el historial
    async function todos(req, res, next) {
        try {
            const query = `
                SELECT h.*, e.tipo, e.marca 
                FROM historial_equipos h
                LEFT JOIN equipos e ON h.equipo_id = e.id
                ORDER BY h.fecha_cambio DESC
            `;
            const historial = await database.rawQuery(query);
            res.json({
                error: false,
                status: 200,
                body: historial
            });
        } catch (err) {
            next(err);
        }
    }

    // Obtener historial por código de inventario
    async function porCodigo(req, res, next) {
        try {
            const { codigo } = req.params;
            const query = `
                SELECT h.*, e.tipo, e.marca 
                FROM historial_equipos h
                LEFT JOIN equipos e ON h.equipo_id = e.id
                WHERE h.codigo_inventario = ?
                ORDER BY h.fecha_cambio DESC
            `;
            const historial = await database.rawQuery(query, [codigo]);
            res.json({
                error: false,
                status: 200,
                body: historial
            });
        } catch (err) {
            next(err);
        }
    }

    // Obtener historial por equipo_id
    async function porEquipo(req, res, next) {
        try {
            const { id } = req.params;
            const query = `
                SELECT h.*, e.tipo, e.marca, e.codigo
                FROM historial_equipos h
                LEFT JOIN equipos e ON h.equipo_id = e.id
                WHERE h.equipo_id = ?
                ORDER BY h.fecha_cambio DESC
            `;
            const historial = await database.rawQuery(query, [id]);
            res.json({
                error: false,
                status: 200,
                body: historial
            });
        } catch (err) {
            next(err);
        }
    }

    // Agregar entrada al historial
    async function agregar(req, res, next) {
        try {
            const datos = req.body;
            const resultado = await database.agregar('historial_equipos', datos);
            res.json({
                error: false,
                status: 201,
                body: resultado
            });
        } catch (err) {
            next(err);
        }
    }

    // Eliminar entrada del historial
    async function eliminar(req, res, next) {
        try {
            const { id } = req.params;
            await database.eliminar('historial_equipos', id);
            res.json({
                error: false,
                status: 200,
                body: 'Entrada de historial eliminada correctamente'
            });
        } catch (err) {
            next(err);
        }
    }

    // Obtener estadísticas de sincronización
    async function estadisticas(req, res, next) {
        try {
            const query = `
                SELECT 
                    (SELECT COUNT(*) FROM equipos) as total_equipos,
                    (SELECT COUNT(DISTINCT equipo_id) FROM historial_equipos) as equipos_con_historial,
                    (SELECT COUNT(*) FROM historial_equipos) as total_cambios
            `;
            const stats = await database.rawQuery(query);
            res.json({
                error: false,
                status: 200,
                body: stats[0]
            });
        } catch (err) {
            next(err);
        }
    }

    return {
        todos,
        porCodigo,
        porEquipo,
        agregar,
        eliminar,
        estadisticas
    };
};
