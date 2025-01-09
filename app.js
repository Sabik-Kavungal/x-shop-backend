require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Importing the pool instance from `pool.js`
const pool = require('./config/db');
const authRouter = require('./routes/authRoutes');
const categoryRoute = require('./routes/categoryRoute');
const itemsRoute = require('./routes/itemsRoutes');
const cartsRoute = require('./routes/cartsRoutes');
const ordersRoute = require('./routes/ordersRoutes');
const promoBrRoute = require('./routes/promotionBrRoutes');
const delOfdayRoute = require('./routes/dealOfdayRoutes');


const app = express();

app.use(cors());

app.use(bodyParser.json()); // Parses JSON payload

app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next();
});




app.use('/user', authRouter);
app.use('/category', categoryRoute);
app.use('/items', itemsRoute);
app.use('/carts', cartsRoute);
app.use('/orders', ordersRoute);
app.use('/promotion/banner', promoBrRoute);
app.use('/deal', delOfdayRoute);


pool.connect();

app.listen(1000, () => {
    console.log('Server is running on port 1000');
});
