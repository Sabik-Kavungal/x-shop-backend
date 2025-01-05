const express = require('express');
const { addCategory, getAllCategory, getBycategory, updateCategory } = require('../controllers/categoryController');

const router = express.Router();

router.post('/add', addCategory);
router.get('/', getAllCategory);
router.get('/:id', getBycategory);
router.put('/:id', updateCategory);

module.exports = router;
