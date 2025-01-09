const express = require('express');
const {addDealOfTheDay, deleteDealOfTheDay, getAllDealsOfTheDay ,getDealOfTheDayById ,updateDealOfTheDay} = require('../controllers/dealOfdayController');

const router = express.Router();

router.post('/add', addDealOfTheDay);
router.get('/', getAllDealsOfTheDay);
router.get('/:id', getDealOfTheDayById);
router.put('/:id', updateDealOfTheDay);
router.delete('/:id', deleteDealOfTheDay);


module.exports = router;
