// Description: This file contains the code to connect to the MySQL database.
const mysql = require('mysql2/promise');

// Create a function to establish a database connection
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'mydatabase'
        });
        console.log('Connected to the database');
        return connection;
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err; // Throw the error to be caught by the caller
    }
}

// Export the function to be used in other files
module.exports = connectToDatabase;