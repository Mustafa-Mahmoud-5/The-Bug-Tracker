const mongoose = require('mongoose'),
	Team = require('./Team'),
	Bug = require('./Bug'),
	Timeline = require('./Timeline');
const sendError = require('../helpers/sendError');
const { getIo } = require('../helpers/socket');
const User = require('./User');

const Schema = mongoose.Schema;

const projectSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		owner: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		type: {
			type: String,
			required: true
		},
		status: {
			// status will also be 0(opened) or 1(closed) to put the opened at the top of the view list
			type: Number,
			default: 0
		},
		bugs: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Bug'
			}
		],
		timeline: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Timeline'
			}
		]
	},
	{ timestamps: true }
);

class ProjectClass {
	static publicProps = () => {
		return [ 'name createdAt owner status type' ];
	};

	static async createProject(ownerId, { name, type, teamId }) {
		const { _id: projectId } = await this.create({ name, owner: ownerId, type });

		if (type === 'public') {
			const addingResult = await Team.addNewProject({ ownerId, teamId, projectId, name });

			console.log('ProjectClass -> createProject -> addingResult', addingResult);
		}

		return addedProject;
	}

	static async addBug(userId, { projectId, name, description, teamId }) {
		// teamId will be passed if its project is of public type.

		const project = await this.findById(projectId);

		const creator = await User.findById(userId).select(User.publicProps().join(' ')).lean();

		if (!project) sendError('Project with given id is not found', 403);

		const { _id: addedBugId } = await Bug.create({ creator: userId, name, description });

		project.bugs.unshift(addedBugId);

		const bugContent = 'has added a new bug';

		const timeLineObj = { from: userId, content: bugContent, bug: addedBugId };

		const { _id: addedTimeLineId } = await Timeline.create(timeLineObj);

		project.timeline.unshift(addedTimeLineId);

		if (project.type === 'public') {
			const socketObject = {
				teamId,
				projectId,
				bug: {
					_id: addedBugId,
					fixer: null,
					status: 0,
					name,
					description,
					createdAt: new Date(),
					creator
				},
				newTimeLine: {
					from: creator,
					content: bugContent,
					date: new Date(),
					bug: {
						_id: addedBugId,
						name,
						createdAt: new Date()
					}
				},
				createdAt: new Date()
			};

			getIo().emit('newPublicBug', socketObject);
		}

		return project.save();
	}

	// i should have made one function as i did for closeOrReOpenProject :(
	static async fixBug(userId, { bugId, projectId, teamId }) {
		const bug = await Bug.findById(bugId);

		const fixer = await User.findById(userId).select(User.publicProps().join()).lean();

		if (!bug) sendError('Bug is not found', 404);

		bug.status = 1; // 1 is fixed 0 is buggy in bugs, 0 is closed 1 is opened in projects
		bug.fixer = userId;

		const bugContent = 'has fixed a bug';

		const timeLineObj = { from: userId, content: bugContent, bug: bugId };

		const { _id: addedTimeLineId } = await Timeline.create(timeLineObj);

		const project = await this.findById(projectId);

		project.timeline.unshift(addedTimeLineId);

		if (project.type === 'public') {
			const socketObject = {
				teamId,
				projectId,
				bugId,
				newTimeLine: {
					from: fixer,
					content: bugContent,
					date: new Date(),
					bug: {
						_id: bugId,
						name: bug.name
					}
				}
			};

			getIo().emit('publicBugFixed', socketObject);
		}

		await Promise.all([ bug.save(), project.save() ]);
	}

	static async reOpenBug(userId, { bugId, projectId, teamId }) {
		const bug = await Bug.findById(bugId);

		const reOpener = await User.findById(userId).select(User.publicProps().join(' ')).lean();

		if (!bug) sendError('Bug is not found');

		bug.status = 0;
		bug.fixer = null;

		const bugContent = 'has reopened a bug';

		const timeLineObj = { from: userId, content: bugContent, bug: bugId };

		const { _id: addedTimeLineId } = await Timeline.create(timeLineObj);

		const project = await this.findById(projectId);

		project.timeline.unshift(addedTimeLineId);

		if (project.type === 'public') {
			const socketObject = {
				teamId,
				projectId,
				bugId,
				newTimeLine: {
					from: reOpener,
					content: bugContent,
					date: new Date(),
					bug: {
						_id: bugId,
						name: bug.name
					}
				}
			};

			getIo().emit('publicBugFixed', socketObject);
		}

		await Promise.all([ bug.save(), project.save() ]);
	}

	static async closeOrReOpenProject(userId, { projectId, teamId }) {
		// HOW THIS FUNC WORK ?
		// if the project is closed, open it, if it is opened close it
		// if the project is a public project, then it must be in a team, get the teamId and make a newNotification for this team saying that project X has been closed
		// this func will have alot of if statments :)

		const project = await this.findById(projectId).select(this.publicProps().join(' '));

		if (!project) sendError('Project is not found', 404);

		if (project.owner.toString() !== userId) sendError('User is not project owner', 401);

		let team;
		if (project.type === 'public') {
			team = await Team.findById(teamId);
			if (!team) sendError('Team is not found', 404);
		}
		const notificationType = 'projectCreation';

		const socketObject = {
			teamId,
			projectId,
			newTeamNotification: {
				from: project.owner,
				createdAt: new Date(),
				notificationType
			}
		};

		if (project.status === 0) {
			// close this opened project
			project.status = 1;
			if (team) {
				const notificationContent = 'has been closed';

				const notificationId = await Team.newNotification(
					team,
					notificationType,
					notificationContent,
					userId,
					projectId,
					null
				);

				socketObject.newTeamNotification._id = notificationId;
				socketObject.newTeamNotification.content = notificationContent;
				socketObject.updatedStatus = 1;
			}
		} else {
			// open this closed project
			project.status = 0;
			// if the projec is public, send a notification for this team
			if (team) {
				const notificationContent = 'has been re opened';

				const notificationId = await Team.newNotification(
					team,
					notificationType,
					notificationContent,
					userId,
					projectId,
					null
				);

				// changing the new quick notification data for socket
				socketObject.newTeamNotification._id = notificationId;
				socketObject.newTeamNotification.content = notificationContentl;
				socketObject.updatedStatus = 0;
			}
		}

		if (team) {
			await team.save();
		}
		await project.save();
	}

	static analyzeProjectStatistics(project) {
		console.log('project(N)', project);
		// bug status 0 is buggy, 1 is fixed
		const bugs = { total: 0, fixed: 0, buggy: 0 };

		project.bugs.forEach(bug => {
			bugs.total++;
			if (bug.status === 0) bugs.buggy++;
			if (bug.status === 1) bugs.fixed++;
		});

		return bugs;
	}
}

projectSchema.loadClass(ProjectClass);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
