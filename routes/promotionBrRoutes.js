const express = require('express');
const { addPromotionBanner, deletePromotionBanner, getAllPromotionBanners, getPromotionBannerById, updatePromotionBanner

} = require('../controllers/promotionBrController');

const auth = require('../middleware/user');

const router = express.Router();

router.post('/add', addPromotionBanner);

router.delete('/:id', deletePromotionBanner);
router.get('/:id', getPromotionBannerById);

router.get('/', getAllPromotionBanners);
router.put('/:id', updatePromotionBanner);

module.exports = router;