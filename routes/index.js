var express = require('express');
var router = express.Router();

router.get('/register', function (req, res, next) {
	res.render('register');
});

router.get('/signup', function (req, res, next) {
	res.render('signup');
});

module.exports = router;
