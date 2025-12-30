const mysql = require('mysql2/promise'); // Using promise-based pool for cleaner code
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbconfig);

async function todos(tabla) {
    const [rows] = await pool.query(`SELECT * FROM ${tabla}`);
    return rows;
}


async function uno(tabla, id) {
    const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id]);
    return rows;
}

async function agregar(tabla, data) {
    const [result] = await pool.query(`INSERT INTO ${tabla} SET ?`, data);
    return result;
}


async function eliminar(tabla, id) {
    const [result] = await pool.query(`DELETE FROM ${tabla} WHERE id = ?`, [id]);
    return result;
}

async function query(tabla, consulta) {
    const keys = Object.keys(consulta);
    const values = Object.values(consulta);
    const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
    const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE ${whereClause}`, values);
    return rows[0] || null;
}

async function actualizar(tabla, id, data) {
    const [result] = await pool.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id]);
    return result;
}

async function rawQuery(sql, params = []) {
    const [result] = await pool.query(sql, params);
    return result;
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    query,
    actualizar,
    rawQuery,
    pool, // Exporting pool instead of conexion
}
