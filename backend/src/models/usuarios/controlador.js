const TABLA = 'usuarios';
const auth = require('../auth');

module.exports = function (dbInyectada) {

    let db = dbInyectada;

    if (!db) {
        db = require('../../DB/mysql');
    }

    async function todos() {
        return db.rawQuery(`SELECT u.id, u.nombre, u.correo, a.usuario, a.password FROM usuarios u JOIN auth a ON u.id = a.id`);
    }

    async function uno(id) {
        const result = await db.rawQuery(`SELECT u.id, u.nombre, u.correo, a.usuario, a.password FROM usuarios u JOIN auth a ON u.id = a.id WHERE u.id = ?`, [id]);
        return result[0] || null;
    }

    async function agregar(body) {
        const usuario = {
            id: body.id,
            nombre: body.nombre,
            correo: body.correo,
            role: body.role || 'user',
            activo: body.activo !== undefined ? body.activo : 1,
        }

        const respuesta = await db.agregar(TABLA, usuario);

        await auth.agregar({
            id: respuesta.insertId, // Usamos el ID del usuario recién creado
            usuario: body.usuario,
            password: body.password,
        });

        return respuesta;
    }

    async function actualizar(id, body) {
        const usuarioData = {
            nombre: body.nombre,
            correo: body.correo,
        };

        await db.actualizar(TABLA, id, usuarioData);

        if (body.usuario || body.password) {
            const authData = {};
            if (body.usuario) authData.usuario = body.usuario;
            if (body.password) authData.password = body.password.toString();
            await db.actualizar('auth', id, authData);
        }

        return { message: 'Usuario actualizado correctamente' };
    }

    async function changePassword(id, oldPassword, newPassword) {
        const authRecord = await db.uno('auth', id);
        if (!authRecord) throw new Error('Usuario no encontrado');

        if (oldPassword !== authRecord.password) {
            const bcrypt = require('bcryptjs');
            const isHashValid = await bcrypt.compare(oldPassword, authRecord.password).catch(() => false);
            if (!isHashValid) throw new Error('Contraseña antigua incorrecta');
        }

        await db.actualizar('auth', id, { password: newPassword });

        return { message: 'Contraseña cambiada correctamente' };
    }

    async function eliminar(id) {
        await db.eliminar(TABLA, id);
        await db.eliminar('auth', id);
        return { message: 'Usuario eliminado correctamente' };
    }

    return { todos, uno, agregar, actualizar, eliminar, changePassword };
} 
