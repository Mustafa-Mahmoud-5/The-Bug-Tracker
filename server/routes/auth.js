const express = require('express'),
	authApis = require('../Apis/auth'),
	router = express.Router(),
	checkValidation = require('../middlewares/checkValidation');

const { body } = require('express-validator');

router.post(
	'/signup',
	[
		body('email', 'Email is not a valid email').isEmail(),
		body('firstName', 'FirstName is required').notEmpty(),
		body('lastName', 'LastName is required').notEmpty(),
		body('password', 'Password must be 9 characters at least').isLength({ min: 9 })
	],
	checkValidation,
	authApis.signUp
);

router.post('/signIn', authApis.signIn);

module.exports = router;
