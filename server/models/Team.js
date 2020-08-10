const mongoose = require('mongoose'),
	sendError = require('../helpers/sendError'),
	Notification = require('./Notification'),
	User = require('./User');

console.log(User);
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
	static async addNewProject({ ownerId, teamId, projectId }) {
		const team = await this.findById(teamId);

		if (!team) sendError('Team with given id is not found', 404);

		team.projects.push(projectId);

		await this.newNotification(team, 'projectCreation', 'has added a new project', ownerId, projectId, null);

		return team.save();
	}

	static async addMembers(leaderId, { teamId, members }) {
		const team = await this.findById(teamId);

		if (!team) sendError('Team is not found', 404);

		if (team.leader.toString() !== leaderId) sendError('User is not team leader', 401);

		if (members.length === 0) sendError('Please select members', 403);

		for (const member of members) {
			team.members.push(member);

			await this.newNotification(team, 'memberManipulation', 'has added', leaderId, null, member);
			await User.newNotification(member, leaderId, 'has added you to his team.');
		}

		return team.save();
	}

	static async kickMember(leaderId, { teamId, memberId }) {
		const team = await this.findById(teamId);

		if (!team) sendError('Team is not found', 404);

		const teamLeader = team.leader;

		if (teamLeader.toString() !== leaderId) sendError('User is not team leader', 401);

		team.members.pull(memberId);

		await this.newNotification(team, 'memberManipulation', 'has Kicked', leaderId, null, memberId);

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

		const projects = { total: 0, closed: 0, opened: 0 };
		const bugs = { total: 0, fixed: 0, buggy: 0 };

		team.projects.forEach(project => {
			console.log('project', project);
			projects.total++;

			if (project.status === 0) projects.opened++;
			if (project.status === 1) projects.closed++;

			const projectBugs = ProjectModal.analyzeProjectStatistics(project);

			bugs.total += projectBugs.total;
			bugs.fixed += projectBugs.fixed;
			bugs.buggy += projectBugs.buggy;
		});

		return { projects: projects, bugs: bugs };
	};
}

teamSchema.loadClass(TeamClass);

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
