const ejs = require('ejs');

const User = require('../models/User');
const { emailer } = require('../helper/mailer');

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
		const isTokenExpired = new Date().getTime() > user.emailTokenExpiresIn;
		if (isTokenExpired) {
			return res.status(400).json({
				error: 'Verification link has expired',
			});
		}

		await User.findOneAndUpdate({ _id: user._id }, { $set: { activate: true } });
		user_activated.hashed_password = undefined;
		res.send('Your accout has been activated');
	} catch (err) {
		if (err) {
			return res.status(400).json({
				error: err,
			});
		}
	}
};
