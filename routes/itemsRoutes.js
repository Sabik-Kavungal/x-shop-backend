const express = require('express');
const { addItems, getAllItems, getItemById } = require('../controllers/itemsController');

const router = express.Router();

router.post('/add', addItems);

router.get('/', getAllItems);

router.get('/:id', getItemById);

module.exports = router;