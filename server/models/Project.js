const mongoose = require('mongoose'),
	Team = require('./Team'),
	User = require('./User'),
	Bug = require('./Bug'),
	Timeline = require('./Timeline');
const sendError = require('../helpers/sendError');

const { Schema } = mongoose;

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

	static async createProject(ownerId, { name, description, type, teamId }) {
		const addedProject = await this.create({ name, description, owner: ownerId, type });

		if (type === 'public') {
			const projectId = addedProject._id;

			const addingResult = await Team.addNewProject({ ownerId, teamId, projectId });

			console.log('ProjectClass -> createProject -> addingResult', addingResult);
		}

		return addedProject;
	}

	static async addBug(userId, { projectId, name, description }) {
		// const user = await User.findById(userId).lean().select(User.publicProps().join(' '));

		const project = await this.findById(projectId);

		if (!project) sendError('Project with given id is not found', 403);

		const { _id: addedBugId } = await Bug.create({ creator: userId, name, description });

		project.bugs.unshift(addedBugId);

		const timeLineObj = { from: userId, content: 'has added a new bug', bug: addedBugId };

		const { _id: addedTimeLineId } = await Timeline.create(timeLineObj);

		project.timeline.unshift(addedTimeLineId);

		return project.save();
	}

	// i should have made one function as i did for closeOrReOpenProject :(
	static async fixBug(userId, { bugId, projectId }) {
		const bug = await Bug.findById(bugId);

		if (!bug) sendError('Bug is not found', 404);

		bug.status = 1; // 1 is fixed 0 is buggy in bugs, 0 is closed 1 is opened in projects
		bug.fixer = userId;

		const timeLineObj = { from: userId, content: 'has fixed a bug', bug: bugId };

		const { _id: addedTimeLineId } = await Timeline.create(timeLineObj);

		const project = await this.findById(projectId);
		project.timeline.unshift(addedTimeLineId);

		await Promise.all([ bug.save(), project.save() ]);
	}

	static async reOpenBug(userId, { bugId, projectId }) {
		const bug = await Bug.findById(bugId);

		if (!bug) sendError('Bug is not found');

		bug.status = 0;
		bug.fixer = null;

		const timeLineObj = { from: userId, content: 'has reopened a bug', bug: bugId };

		const { _id: addedTimeLineId } = await Timeline.create(timeLineObj);

		const project = await this.findById(projectId);
		project.timeline.unshift(addedTimeLineId);

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

		if (project.status === 0) {
			// close this opened project
			project.status = 1;
			if (team) {
				console.log('5555555');
				await Team.newNotification(team, 'projectCreation', 'has been closed', userId, projectId, null);
			}
		} else {
			// open this closed project
			project.status = 0;
			// if the projec is public, send a notification for this team
			if (team) {
				await Team.newNotification(team, 'projectCreation', 'has been reOpened', userId, projectId, null);
			}
		}

		if (team) {
			await team.save();
		}
		await project.save();
	}

	static analyzeProjectStatistics = project => {
		// bug status 0 is buggy, 1 is fixed
		const bugs = { total: 0, fixed: 0, buggy: 0 };

		project.bugs.forEach(bug => {
			bugs.total++;
			if (bug.status === 0) bugs.buggy++;
			if (bug.status === 1) bugs.fixed++;
		});

		return bugs;
	};
}

projectSchema.loadClass(ProjectClass);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
