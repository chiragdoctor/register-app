const ejs = require('ejs');
const randomstring = require('randomstring');

const User = require('../models/User');
const { emailer } = require('../helper/mailer');
const { reset } = require('nodemon');

exports.register = async (req, res) => {
	const user = new User(req.body);
	try {
		const saved_user = await user.save();
		const verifyUrl = `http://localhost:5000/api/verify/${saved_user.emailToken}`;
		const subject = 'THS Email Verfication';
		const html = await ejs.renderFile(__dirname + '/../views/emailVerify.ejs', { name: saved_user.name, verifyUrl });
		emailer(html, subject, saved_user.email);
		res.json(saved_user);
	} catch (err) {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
	}
};

exports.verifyEmail = async (req, res) => {
	const { emailToken } = req.params;
	try {
		const user = await User.findOne({ emailToken });
		if (!user) {
			return res.status(400).json({
				error: 'You are not registered user.',
			});
		}
		const isTokenExpired = new Date().getTime() > user.tokenExpiresIn;
		if (isTokenExpired) {
			return res.status(400).json({
				error: 'Verification link has expired',
			});
		}

		await User.findOneAndUpdate({ _id: user._id }, { $set: { account_activated: true } });
		res.send('Your account has been activated');
	} catch (err) {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
	}
};

exports.forgotPassword = async (req, res) => {
	const { email } = req.body;
	console.log('email ', email);
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(400).json({
			error: 'You are not registered user.',
		});
	}

	const resetToken = randomstring.generate();
	const passwordResetLink = `http://localhost:5000/api/reset-password/${resetToken}`;

	user.passwordResetToken = resetToken;
	user.tokenExpiresIn = new Date().setHours(new Date().getHours() + 2);
	await user.save();

	const subject = 'THS Password Reset';
	const html = await ejs.renderFile(__dirname + '/../views/passwordReset.ejs', { name: user.name, passwordResetLink });
	emailer(html, subject, user.email);
	res.json(user);
};

exports.resetPassword = async (req, res) => {
	const { passwordResetToken } = req.params;
	try {
		const user = await User.findOne({ passwordResetToken });
		if (!user) {
			return res.status(400).json({
				error: 'You are not registered user.',
			});
		}

		if (user.password_reseted) {
			return res.status(400).json({
				error: 'Password reset link already used',
			});
		}

		const isTokenExpired = new Date().getTime() > user.tokenExpiresIn;
		if (isTokenExpired) {
			return res.status(400).json({
				error: 'Password reset link has expired',
			});
		}

		await User.findOneAndUpdate({ _id: user._id }, { $set: { password_reseted: true } });
		res.render('updatePassword');
	} catch (err) {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
	}
};
