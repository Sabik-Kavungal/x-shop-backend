const express = require('express');
const  {placeOrder
    
} = require('../controllers/ordersController');

const auth = require('../middleware/user');

const router = express.Router();

router.post('/place', auth,placeOrder);

module.exports = router;