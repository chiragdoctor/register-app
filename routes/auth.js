const express = require('express');
const router = express.Router();
const { register, verifyEmail, forgotPassword, resetPassword } = require('../controllers/auth');

router.post('/register', register);

router.get('/verify/:emailToken', verifyEmail);

router.post('/forgot', forgotPassword);

router.get('/reset-password', resetPassword);


module.exports = router;
