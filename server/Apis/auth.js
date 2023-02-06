const sendError = require('../helpers/sendError');
const User = require('../models/User');
const {OAuth2Client} = require("google-auth-library");
const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;


const oAuth2Client = new OAuth2Client(
  client_id,
  client_secret,
  'postmessage',
);



exports.googleSignIn = async (req, res, next) => {
	try {
		const { tokens} = await oAuth2Client.getToken(req.body.code);

		const token = await User.googleSignUpOrSignIn(tokens);

		res.status(200).json({message: 'User logged in successfully', token}); 
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
}



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

exports.forgetPassword = async (req, res, next) => {
	try {
		await User.forgetPasswordCodeCreation(req.body);

		res.status(200).json({ message: 'Please check your email for your password recovery code' });
	} catch (error) {
		error.statusCode = error.statusCode || 500;
		next(error);
	}
};

exports.receivePasswordRecoveryCode = async (req, res, next) => {
	try {
		const slug = await User.passwordCodeSubmition(req.body);
		res.status(200).json({ message: 'Valid Code', slug });
	} catch (error) {
		error.statusCode = error.statusCode || 500;
		next(error);
	}
};

exports.changePassword = async (req, res, next) => {
	try {
		await User.changePassword(req.body);

		res.status(200).json({ message: 'Your password has been changed successfully' });
	} catch (error) {
		error.statusCode = error.statusCode || 500;
		next(error);
	}
};
