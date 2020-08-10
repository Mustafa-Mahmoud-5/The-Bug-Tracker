const express = require('express'),
	isAuth = require('../middlewares/isAuth'),
	checkValidation = require('../middlewares/checkValidation'),
	usersApis = require('../Apis/users'),
	router = express.Router();

const { body } = require('express-validator');
router.get('/personalData', isAuth, usersApis.getPersonalUserData);

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

router.patch('/closeOrReOpenProject', isAuth, usersApis.closeOrReOpenProject);

router.get('/bugDetails/:bugId', isAuth, usersApis.getBugDetails);

router.get('/personalProjects', isAuth, usersApis.getPersonalProjects);

router.patch('/regeneratePrivateKey', isAuth, usersApis.regeneratePrivateKey);

router.get('/projectDetails/:projectId', isAuth, usersApis.getProjectDetails);

router.get('/projectTimeline/:projectId', isAuth, usersApis.getProjectTimeline);
module.exports = router;
