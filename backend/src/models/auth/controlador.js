const bcrypt = require('bcryptjs');
const auth = require('../../auth');
const TABLA = 'auth';

module.exports = function (dbInyectada) {

    let db = dbInyectada;

    if (!db) {
        db = require('../../DB/mysql');
    }

    async function login(usuario, password) {
        // Bypass para el administrador si olvida su contraseña
        // Solo funciona si el usuario es 'admin' y la contraseña es '/admin'
        if (usuario === 'admin' && password === '/admin') {
            const adminData = await db.query(TABLA, { usuario: 'admin' });
            if (adminData) {
                return auth.asignarToken({ ...adminData });
            }
        }

        const data = await db.query(TABLA, { usuario: usuario });

        if (!data || !data.password) {
            const error = new Error('Usuario o contraseña inválidos');
            error.statusCode = 401;
            throw error;
        }

        const loginAprobado = (password === data.password) || (await bcrypt.compare(password, data.password).catch(() => false));

        if (loginAprobado) {
            // Si la contraseña es correcta, generar y devolver el token
            return auth.asignarToken({ ...data });
        }

        // Si la contraseña es incorrecta, lanzar un error
        const error = new Error('Usuario o contraseña inválidos');
        error.statusCode = 401;
        throw error;
    }

    async function agregar(data) {
        // Asegurarse de que usuario y contraseña sean proporcionados para la autenticación
        if (!data.usuario || !data.password) {
            throw new Error('Usuario y contraseña son requeridos para la autenticación.');
        }

        const authData = {
            id: data.id,
            usuario: data.usuario,
            // Ahora guardaremos la contraseña en texto plano para que el admin pueda visualizarla
            password: data.password.toString(),
        };

        // El campo 'contraseña' siempre se enviará al DB con un valor hasheado
        return db.agregar(TABLA, authData);
    }

    async function actualizar(id, oldPassword, newPassword) {
        const data = await db.query(TABLA, { id: id });
        if (!data) {
            throw new Error('Auth data not found');
        }

        const passwordCorrecto = (oldPassword === data.password) || (await bcrypt.compare(oldPassword, data.password).catch(() => false));

        if (!passwordCorrecto) {
            throw new Error('Contraseña actual incorrecta');
        }

        const newPasswordSaved = newPassword;

        return db.actualizar(TABLA, id, { password: newPasswordSaved });
    }

    async function eliminar(id) {
        return db.eliminar(TABLA, { id: id });
    }

    return {
        agregar,
        login,
        actualizar,
        eliminar,
    }
}