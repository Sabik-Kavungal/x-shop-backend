const express = require('express');
const { addItems, getAllItems } = require('../controllers/itemsController');

const router = express.Router();

router.post('/add', addItems);

router.get('/', getAllItems);

module.exports = router;