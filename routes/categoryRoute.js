const express = require('express');
const { addCategory,getAllCategory } = require('../controllers/categoryController');

const router = express.Router();

router.post('/add', addCategory);
router.get('/',getAllCategory );

module.exports = router;
