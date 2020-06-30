const mongoose = require('mongoose');
const config = require('config');

const connectDB = async () => {
	const options = {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	};

	try {
		await mongoose.connect(config.get('db.connection'), options);
		console.log('Mongo DB connected Successfully 🌵 🌵');
	} catch (err) {
		console.log('err');
	}
};

module.exports = connectDB;
