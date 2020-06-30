const express = require('express');
const router = express.Router();
const { register, verifyEmail } = require('../controllers/auth');

router.post('/register', register);

router.get('/verify/:emailToken', verifyEmail);

module.exports = router;
