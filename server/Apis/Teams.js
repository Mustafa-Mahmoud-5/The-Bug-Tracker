const sendError = require('../helpers/sendError');
const Team = require('../models/Team'),
	User = require('../models/User'),
	Project = require('../models/Project'),
	Notification = require('../models/Notification');

exports.createTeam = async (req, res, next) => {
	const { userId } = req;

	const { name } = req.body;

	const team = await Team.create({ leader: userId, name });

	res.status(201).json({ message: 'Team Added Successfully', team: team });
};

exports.addMembersToTeam = async (req, res, next) => {
	const { userId } = req;

	try {
		const newTeam = await Team.addMembers(userId, req.body);

		res.status(201).json({ message: 'New members added successfully', updatedTeam: newTeam });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getTeam = async (req, res, next) => {
	const { teamId } = req.params;

	try {
		// unfortunately, i will populate(aggregate) the project bugs in order to fetch the bug status which is mandatory for manipulating the team statistics

		const team = await Team.findById(teamId)
			.populate({
				path: 'projects',
				select: Project.publicProps().join(' ') + ' bugs',
				populate: { path: 'owner', select: User.publicProps().join(' ') },
				populate: { path: 'bugs', select: 'status' }
			})
			.populate({ path: 'leader', select: User.publicProps().join(' ') })
			.populate({ path: 'members', select: User.publicProps().join(' ') })
			.select('-notifications')
			.lean();
		console.log('exports.getTeam -> team', team);

		if (!team) sendError('Team not found', 404);

		const teamStatistics = Team.analyzeTeamStatistics(Project, team);

		res.status(200).json({ team, teamStatistics });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getTeamNotifications = async (req, res, next) => {
	const { teamId } = req.params;

	try {
		const team = await Team.findById(teamId).lean();

		if (!team) sendError('team is not found', 404);

		const teamNotifications = team.notifications;

		if (teamNotifications.length > 0) {
			const notifications = await Notification.find({ _id: { $in: teamNotifications } })
				.populate({ path: 'from', select: User.publicProps().join(' ') })
				.populate({ path: 'to', select: User.publicProps().join(' ') })
				.populate({ path: 'Project', select: Project.publicProps().join(' ') })
				.lean();

			res.status(200).json({ notifications });
		} else {
			res.status(200).json({ notifications: [] });
		}
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.kickMember = async (req, res, next) => {
	const { userId } = req;

	try {
		await Team.kickMember(userId, req.body);
		res.status(200).json({ message: 'User kicked successfully', user: userId });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};
