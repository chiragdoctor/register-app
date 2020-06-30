const mongoose = require('mongoose');
const randonstring = require('randomstring');
const bcrypt = require('bcrypt');
const config = require('config');

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		hashed_password: {
			type: String,
			required: true,
		},
		emailToken: {
			type: String,
			default: randonstring.generate(),
		},
		emailTokenExpiresIn: {
			type: Number,
			default: new Date().setMinutes(new Date().getMinutes() + 2),
		},
		activate: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

// virtual fields

userSchema
	.virtual('password')
	.set(function (password) {
		this._password = password;
		const salt = bcrypt.genSaltSync(config.get('salt_rounds'));
		this.hashed_password = this.encryptPassword(password, salt);
	})
	.get(function () {
		return this._password;
	});

userSchema.methods = {
	encryptPassword: function (password, salt) {
		if (!password) return '';
		try {
			return bcrypt.hashSync(password, salt);
		} catch (err) {
			return '';
		}
	},
};

module.exports = mongoose.model('User', userSchema);
