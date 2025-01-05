const express = require('express');
const {addToCart,getAllcarts, incrementQty} = require('../controllers/cartsController');
const auth = require('../middleware/user');

const router = express.Router();    

router.post('/add', auth, addToCart);
router.get('/', auth, getAllcarts);
router.put('/i', auth, incrementQty);
module.exports = router;