const mysql = require('mysql2')
require('dotenv')

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: 'live_chat'
})

connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('connect')
    }
})

module.exports = connection