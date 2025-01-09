const express = require('express');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/user'); // Assuming this middleware exists
const router = express.Router();

const upload = require('../middleware/image/image');

// Public routes
router.post('/register', upload.single('image'), register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;
