const sendError = require('../helpers/sendError');
const User = require('../models/User');

exports.signUp = async (req, res, next) => {
	try {
		const { _id } = await User.signUp(req.body);

		res.status(201).json({ message: 'User Signed Up Successfully', userId: _id });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.signIn = async (req, res, next) => {
	try {
		const token = await User.signIn(req.body);

		res.status(200).json({ message: 'User logged in successfully', token: token });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};
