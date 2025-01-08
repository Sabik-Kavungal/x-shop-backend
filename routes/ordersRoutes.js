const express = require('express');
const  {placeOrder, getAllOrders
    
} = require('../controllers/ordersController');

const auth = require('../middleware/user');

const router = express.Router();

router.post('/place', auth,placeOrder);

router.get('/place', auth,getAllOrders);

module.exports = router;