const express = require('express');

// Importing the pool instance from `pool.js`
const pool = require('./config/db');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

pool.connect();

app.listen(1000, () => {
    console.log('Server is running on port 1000');
});
