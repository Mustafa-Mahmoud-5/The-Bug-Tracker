const jwt = require('jsonwebtoken'),
	User = require('../models/User'),
	sendError = require('../helpers/sendError');

const isAuth = (req, res, next) => {
	console.log('isAuth -> req.props', req.body);
	try {
		const authHeader = req.get('Authorization');
		console.log('isAuth -> authHeader', authHeader);

		if (!authHeader) sendError('User is not authenticated', 401);

		const token = authHeader.split(' ')[1];

		if (!token) sendError('Token was not passed', 401);

		const decodedToken = jwt.decode(token, `${process.env.TOKEN_SECRET}`);
		console.log('isAuth -> decodedToken', decodedToken);

		if (!decodedToken) sendError('Token is fake', 401);

		req.userId = decodedToken.userId;

		next();
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		throw error; // this function is sync(not async) then we handle the error by throwing it normally (not with next(error) and the errorHandler will catch this error
	}
};

module.exports = isAuth;
