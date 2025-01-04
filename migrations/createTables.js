const pool = require('../config/db');

const createTables = async () => {
    try {


        console.log('Tables created successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error creating tables:', err.message);
        process.exit(1);
    }
};
