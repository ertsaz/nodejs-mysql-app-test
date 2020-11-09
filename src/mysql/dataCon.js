const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./setCon');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('CONECCIÓN DE BASE DE DATOS CERRADA')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.log('MUCHAS CONECCIONES REALIZADAS')
        }
        if (err.code === 'ECONNREFUSED') {
            console.log('BASE DE DATOS RECHAZADA')
        }
    }
    if (connection) connection.release();
    console.log('BASE DE DATOS CONECTADA')
});

pool.query = promisify(pool.query);

module.exports = pool;