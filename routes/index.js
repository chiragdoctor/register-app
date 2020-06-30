const express = require('express');
const router = express.Router();
const ejs = require('ejs');
router.get('/register', function (req, res, next) {
	res.render('register');
});

router.get('/signup', function (req, res, next) {
	res.render('signup');
});

router.get('/verify', function (req, res, next) {
	const html = ejs.renderFile(__dirname + 'emailVerify.ejs', { name: 'chirag', verifyUrl: 'dsfdf' });
	res.send(html);
});

module.exports = router;
