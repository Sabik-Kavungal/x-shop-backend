// Importing the `Pool` class from the `pg` library
const { Pool } = require('pg');

// Creating a new pool instance with the configuration details for connecting to PostgreSQL
const pool = new Pool({
    user: "postgres",     // PostgreSQL username
    host: "localhost",    // Hostname of the PostgreSQL server
    database: "x-shop", // Database name
    password: "sabik123", // Password for the PostgreSQL user
    port: 5432,           // Port number for PostgreSQL
});

// Adding an event listener to log a message on a successful connection
pool.on('connect', () => {
    console.log('Connected to the database');
});

// Adding an event listener to handle errors in the connection pool
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err.message);
});

// Exporting the pool instance for use in other files
module.exports = pool;
