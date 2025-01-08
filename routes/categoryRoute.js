const express = require('express');
const { addCategory, getAllCategory, getBycategory, updateCategory, deleteCategory , getItemsByCategory } = require('../controllers/categoryController');

const router = express.Router();

router.post('/add', addCategory);
router.get('/', getAllCategory);
router.get('/:id', getBycategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/items/:id', getItemsByCategory);

module.exports = router;
