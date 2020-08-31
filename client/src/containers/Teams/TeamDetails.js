import React, { Component, Fragment } from 'react';
import { addMembers, kickMember, teamNotifications, teamDetails } from '../../Apis/team';
import Modal from '../../components/Modal/Modal';
import Nprogrss from 'nprogress';
import Notifications from '../../components/Teams/TeamNotifications';
import { withSnackbar } from 'notistack';
import { Button, Paper, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Statistics from '../../components/Statistics/Statistics';
import TeamProjects from '../../components/Teams/TeamProjects';
import { connect } from 'react-redux';
import { saveCurrentTeamId } from '../../store/actions';
export class TeamDetails extends Component {
	state = {
		loading: false,
		teamStatistics: null,
		team: null, // {name, leader, members: [], projects: { bugs: [ { _id, status } ] } }
		teamNotifications: null,
		modalOpen: false
	};

	teamId = this.props.match.params.teamId;

	async componentDidMount() {
		Nprogrss.start();

		try {
			await this.getTeamData();

			Nprogrss.done();
		} catch (error) {
			Nprogrss.done();

			this.props.enqueueSnackbar(
				error.response && (error.response.data.error || 'Something went wrong', { variant: 'error' })
			);
		}
	}

	getTeamData = async () => {
		await Promise.all([ this.getTeam(), this.getTeamNotifications() ]);
	};

	getTeam = async () => {
		const response = await teamDetails(this.teamId);

		this.props.saveCurrentTeamId(response.data.team._id);

		this.setState({ team: response.data.team, teamStatistics: response.data.teamStatistics });
	};

	getTeamNotifications = async () => {
		const response = await teamNotifications(this.teamId, 1);

		this.setState({ teamNotifications: response.data.notifications });
	};

	paginateTeamNotifiactions = async (page = 1) => {
		Nprogrss.start();
		try {
			const response = await teamNotifications(this.teamId, page);

			this.setState({ teamNotifications: response.data.notifications });

			Nprogrss.done();
		} catch (error) {
			this.props.enqueueSnackbar(error.reponse.data.error || 'Something went wrong', { variant: 'error' });

			Nprogrss.done();
		}
	};

	openModal = () => {
		this.setState({ modalOpen: true });
	};

	closeModal = () => {
		this.setState({ modalOpen: false });
	};

	render() {
		const { team, teamNotifications, teamStatistics, loading, modalOpen } = this.state;

		let leader;
		let memberWord;

		if (team) {
			for (const member of team.members) {
				if (member._id === team.leader) leader = member;
			}

			memberWord = `${team.members.length} Members`;

			if (team.members.length === 1) memberWord = `${team.members.length} Member`;
		}

		return (
			<Fragment>
				{team &&
				teamNotifications &&
				teamStatistics && (
					<Fragment>
						<div id='teamContHeader'>
							<h2 className='teamH'>
								<span>{team.name}</span> |
								<span className='teamMembers'> {memberWord}</span>
							</h2>
							<Tooltip title='Add Members'>
								<Button color='primary' variant='contained' size='small'>
									<Add />members
								</Button>
							</Tooltip>
						</div>
						<hr />
						<br />
						<br />
						<div className='row'>
							<div className='col-md-4'>
								<Notifications teamProjects={team.projects} teamNotifications={teamNotifications} />
							</div>
							<div className='col-md-8'>
								<Statistics statistics={teamStatistics} Statfor='team' />
							</div>
						</div>
						<div id='teamProjects'>
							<div>
								<h2>Team Projects</h2>
								<hr />
							</div>
							<TeamProjects projects={team.projects} />
						</div>
					</Fragment>
				)}
			</Fragment>
		);
	}
}

const mapDispatchesToProps = dispatch => ({
	saveCurrentTeamId: currentTeamId => dispatch(saveCurrentTeamId(currentTeamId))
});

export default connect(null, mapDispatchesToProps)(withSnackbar(TeamDetails));
