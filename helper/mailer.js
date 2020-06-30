const nodemailer = require('nodemailer');
const config = require('config');

exports.emailer = async (html, subject, email) => {
	try {
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: config.get('emailer.username'),
				pass: config.get('emailer.password'),
			},
		});
		let info = await transporter.sendMail({
			from: `"THS" <${config.get('emailer.username')}>`,
			to: email,
			subject: subject,
			html: html,
		});
		console.log('Message sent: %s', info.messageId);
	} catch (err) {
		console.log('Mailer Error', err);
	}
};
