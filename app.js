const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Importing the pool instance from `pool.js`
const pool = require('./config/db');
const authRouter = require('./routes/authRoutes');
const categoryRoute = require('./routes/categoryRoute');
const itemsRoute = require('./routes/itemsRoutes');


const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));



app.use('/user', authRouter);
app.use('/category', categoryRoute);
app.use('/items', itemsRoute);


pool.connect();

app.listen(1000, () => {
    console.log('Server is running on port 1000');
});
