const sendError = require('../helpers/sendError'),
	Project = require('../models/Project'),
	Team = require('../models/Team'),
	User = require('../models/User'),
	Bug = require('../models/Bug'),
	fs = require('fs');

exports.editPersonalData = async (req, res, next) => {
	// this api edit the personalData (editing the )
	const { userId, file } = req;

	try {
		const user = await User.editPersonalData(userId, file, req.body);

		file
			? fs.unlink(file.path, err => {
					if (err) console.log('file have not been removed from the file system');
				})
			: null;

		res.status(200).json({ message: 'User updated successfully', userId: userId, result: user });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.createNewProject = async (req, res, next) => {
	const { userId: ownerId } = req;

	console.log('exports.createNewProject -> ownerId', ownerId);

	try {
		const { _id } = await Project.createProject(ownerId, req.body);

		res.status(200).json({ message: 'Project added successfully', projectId: _id });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.addNewBug = async (req, res, next) => {
	const userId = req.userId;

	try {
		await Project.addBug(userId, req.body);

		res.status(201).json({ message: 'Bug added successfully', status: true });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.fixBug = async (req, res, next) => {
	const { userId } = req;

	try {
		await Project.fixBug(userId, req.body);

		res.status(200).json({ message: 'Bug fixed successfully', status: true });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.bugReopen = async (req, res, next) => {
	const { userId } = req;
	try {
		await Project.reOpenBug(userId, req.body);

		res.status(200).json({ message: 'Bug reOpened successfully', status: true });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.closeOrReOpenProject = async (req, res, next) => {
	const { userId } = req;
	try {
		await Project.closeOrReOpenProject(userId, req.body);

		res.status(200).json({ status: true });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.editBugDetails = async (req, res, next) => {
	const { userId } = req;

	try {
		const user = await User.findById().lean();
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

// ____________________________________GET APIS_______________________________________

exports.getUserWithPrivateKey = async (req, res, next) => {
	const { privateKey } = req.params;

	try {
		const user = await User.findOne({ privateKey }).lean().select(User.publicProps().join(' '));
		if (!user) sendError('No Results', 404);
		res.status(200).json({ user });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getPersonalProjects = async (req, res, next) => {
	const { userId } = req;

	try {
		const personalProjects = await Project.find({ $and: [ { owner: userId }, { type: 'private' } ] })
			.select(Project.publicProps().join(' ') + ' bugs')
			.lean();
		// returning bugs for getting the bugs length

		res.status(200).json({ message: 'Projects fetched sussessfully', projects: personalProjects });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getBugDetails = async (req, res, next) => {
	const { bugId } = req.params;

	try {
		const bug = await Bug.findById(bugId)
			.populate({ path: 'creator', select: User.publicProps().join(' ') })
			.populate({ path: 'fixer', select: User.publicProps().join(' ') })
			.lean();

		res.status(200).json({ bug });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};
