const mysql = require('mysql2');
require('dotenv').config();

// Connect to MYSQL database
const connection = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '2022',
      database: 'employeeTracker'
    }
);

connection.connect((err) =>{if(err) throw err;});

module.exports = connection;