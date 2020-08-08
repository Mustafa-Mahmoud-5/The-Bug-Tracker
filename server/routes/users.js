const express = require('express'),
	isAuth = require('../middlewares/isAuth'),
	checkValidation = require('../middlewares/checkValidation'),
	multerUploader = require('../middlewares/multerUploader'),
	usersApis = require('../Apis/users'),
	router = express.Router();

const { body } = require('express-validator');

router.patch(
	'/editPersonalData',
	// multerUploader.single('image'),
	isAuth,
	[ body('firstName', 'FirstName is required').notEmpty(), body('lastName', 'LastName is required').notEmpty() ],
	checkValidation,
	usersApis.editPersonalData
);

router.post(
	'/newProject',
	[ body('name', 'Name can`t be empty').notEmpty(), body('description', 'Description can`t be empty').notEmpty() ],
	checkValidation,
	isAuth,
	usersApis.createNewProject
);

router.get('/getUserWithPrivateKey/:privateKey', isAuth, usersApis.getUserWithPrivateKey);

router.post(
	'/addBug',
	isAuth,
	[
		body('name', 'Name must be at most 30 characters').isLength({ max: 30 }),
		body('description', 'Description is required').notEmpty()
	],
	checkValidation,
	usersApis.addNewBug
);

router.patch('/fixBug', isAuth, usersApis.fixBug);

router.patch('/bugReopen', isAuth, usersApis.bugReopen);

module.exports = router;
