const mongoose = require('mongoose'),
	sendError = require('../helpers/sendError'),
	Notification = require('./Notification'),
	User = require('./User');

const getIo = require('../helpers/socket').getIo;

const { Schema } = mongoose;

const teamSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		leader: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		members: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
		projects: [ { type: Schema.Types.ObjectId, ref: 'Project' } ],
		notifications: [ { type: Schema.Types.ObjectId, ref: 'Notification' } ]
		// team notifications will be concerned with 1- a user created a project, admin added/kick a member
	},
	{ timestamps: false }
);

class TeamClass {
	static async addNewProject({ ownerId, teamId, projectId, name }) {
		const team = await this.findById(teamId);

		const owner = await User.findById(ownerId).select(User.publicProps().join(' ')).lean();

		const socketObject = {
			teamMembers: team.members,
			project: { _id: projectId, owner, status: 0, name, bugs: [], createdAt: new Date() }
		};

		team.projects.push(projectId);

		const content = 'added a new project',
			notificationType = 'projectCreation';

		const notificationId = await this.newNotification(team, notificationType, content, ownerId, projectId, null);

		socketObject.newTeamNotification = {
			_id: notificationId,
			createdAt: Date.now(),
			content,
			notificationType,
			from: owner
		};

		getIo().emit('newTeamProject', socketObject);

		return team.save();
	}

	// SOCKET
	static async addMembers(leaderId, { teamId, members }) {
		console.log('addMembers -> teamId', teamId);
		const team = await this.findById(teamId).populate({ path: 'leader', select: User.publicProps().join(' ') });
		console.log('addMembers -> team', team);

		if (!team) sendError('Team is not found', 404);

		if (team.leader._id.toString() !== leaderId) sendError('User is not team leader', 401);

		if (members.length === 0) sendError('Please select members', 403);

		const usersToAdd = await User.find({ _id: { $in: members } }).select(User.publicProps().join(' ')).lean();

		const socketObject = {
			teamMembers: team.members,
			team: { _id: team._id, name: team.name },
			newTeamNotifications: [],
			usersToAdd,
			leaderId
		};

		const notificationType = 'memberManipulation',
			content = 'added';

		for (const member of members) {
			team.members.push(member);

			const notificationId = await this.newNotification(team, notificationType, content, leaderId, null, member);

			await User.newNotification(member, leaderId, 'has added you to his team.');

			const to = usersToAdd.find(user => user._id.toString() === member.toString());

			const teamNotificationForSocket = {
				_id: notificationId,
				from: team.leader,
				content,
				to,
				notificationType,
				createdAt: new Date()
			};

			// :( , i know. unshift is bad in terms of bigO, but i have to.
			socketObject.newTeamNotifications.unshift(teamNotificationForSocket);
		}

		getIo().emit('newMembersForTeam', socketObject);

		return team.save();
	}

	// SOCKET
	static async kickMember(leaderId, { teamId, memberId }) {
		const team = await this.findById(teamId).populate({ path: 'leader', select: User.publicProps().join(' ') });

		if (!team) sendError('Team is not found', 404);

		if (team.leader._id.toString() !== leaderId) sendError('User is not team leader', 401);

		const socketObject = { team: { _id: team._id }, kickedUser: memberId, leaderId };

		team.members.pull(memberId);

		const content = 'kicked',
			notificationType = 'memberManipulation';

		const result = await Promise.all([
			this.newNotification(team, notificationType, content, leaderId, null, memberId),
			User.newNotification(memberId, leaderId, 'kicked you out of his team.'),
			User.findById(memberId).select(User.publicProps().join(' ')).lean()
		]);

		const newTeamNotificationId = result[0];

		socketObject.newTeamNotification = {
			_id: newTeamNotificationId,
			from: team.leader,
			to: result[2],
			content,
			notificationType,
			createdAt: new Date()
		};

		getIo().emit('userHasKicked', socketObject);

		await team.save();
	}

	static async newNotification(team, notificationType, content, from, project, to) {
		let notificationsObj;

		if (notificationType === 'projectCreation') {
			notificationsObj = { notificationType, from, content, project };
		} else {
			// memberManipulating
			notificationsObj = { notificationType, from, content, to };
		}

		const { _id: notificationId } = await Notification.create(notificationsObj);

		team.notifications.unshift(notificationId);

		return notificationId;
		// always save in the outer function in order to take advantage of promise.all
	}

	static analyzeTeamStatistics = (ProjectModal, team) => {
		/*
			Requiring the ProjectModal is because of the circular dependency issue
			
			THIS ISSUE IS NOT RELATED TO JS OR NODEJS, IT CAN HAPPEN IN ANY LANGUAGE.
			this issue sometimes happen if you have two modules, and you import the first in the second and vice versa(imported the second in the first)
			one of the returned values will be empty object :(
			hence i had to pass the second module dynamically as a prameter..
			YOU CAN GOOGLE THIS ISSUE IF YOU ARE INTERESTED >> CIRCULAR DEPENDANCY <<
		*/

		const projects = { totalProjects: 0, closedProjects: 0, openedProjects: 0 };
		const bugs = { totalBugs: 0, fixedBugs: 0, buggyBugs: 0 };

		team.projects.forEach(project => {
			console.log('project', project);
			projects.totalProjects++;

			if (project.status === 0) projects.openedProjects++;
			if (project.status === 1) projects.closedProjects++;

			const projectBugs = ProjectModal.analyzeProjectStatistics(project);

			bugs.totalBugs += projectBugs.total;
			bugs.fixedBugs += projectBugs.fixed;
			bugs.buggyBugs += projectBugs.buggy;
		});

		return { projects: projects, bugs: bugs };
	};
}

teamSchema.loadClass(TeamClass);

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
