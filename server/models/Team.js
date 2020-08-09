const mongoose = require('mongoose');
const sendError = require('../helpers/sendError');
const Notification = require('./Notification');

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
}

teamSchema.loadClass(TeamClass);

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
