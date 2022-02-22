const mysql = require('mysql2');

// Connect to the MYSQL database
const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password: '2022',
        database: 'employeeTracker'
    },

    console.log('Connected to the employeeTracker database.')
);


// Export the file
module.exports = db;