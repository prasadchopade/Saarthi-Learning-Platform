const express = require('express');
const { googleLogin, isAuthenticated, logout } = require('../controllers/authController');
const router = express.Router();

router.get('/login', googleLogin);
router.get('/isAuthenticated', isAuthenticated);
router.post('/logout', logout);
module.exports = router;
