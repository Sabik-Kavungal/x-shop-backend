// const { Pool } = require('pg');

// const pool = new Pool({
//     user: "root",
//     host: "dpg-ctv1phtds78s738m5ibg-a.singapore-postgres.render.com",
//     database: "shop_qddd",
//     password: "FzF8f64Gq6WV6niPz17YJPSECkURd7B2",
//     port: 5432,
//     ssl: {
//         rejectUnauthorized: false,
//     },
// });

// (async () => {
//     try {
//         const client = await pool.connect();
//         console.log('Database connected successfully');
//         client.release();
//     } catch (error) {
//         console.error('Connection failed:', error.message);
//     }
// })();
require('dotenv').config(); // Load environment variables

const { Pool } = require('pg');

// Create a new Pool instance using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Add event listeners for debugging and connection status
pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client:', err.message);
});

// Export the pool instance for use in other files
module.exports = pool;



// Exporting the pool instance for use in other files
//module.exports = pool;



// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     ssl: {
//         rejectUnauthorized: false,
//     },
// });

// (async () => {
//     try {
//         const client = await pool.connect();
//         console.log('Connected successfully!');
//         client.release();
//     } catch (err) {
//         console.error('Database connection failed:', err.message);
//     }
// })();


// // Exporting the pool instance for use in other files
// module.exports = pool;
