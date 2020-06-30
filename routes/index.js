const express = require('express');
const router = express.Router();
const ejs = require('ejs');
router.get('/register', function (req, res) {
	res.render('register');
});

router.get('/signup', function (req, res) {
	res.render('signup');
});

router.get('/forgot-password', function (req, res) {
	res.render('forgot-password');
});

router.get('/reset-password', function (req, res) {
	res.render('forgot-password');
});

module.exports = router;
