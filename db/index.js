const mysql = require('mysql');

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin1234',
    database:'accessory_stores'
})

module.exports = db;