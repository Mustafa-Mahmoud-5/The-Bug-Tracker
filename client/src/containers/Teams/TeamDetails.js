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
import TeamMembers from '../../components/Teams/TeamMembers';
import AddMembers from './AddMembers';
export class TeamDetails extends Component {
	state = {
		loading: false,
		teamStatistics: null,
		team: null, // {name, leader, members: [], projects: { bugs: [ { _id, status } ] } }
		teamNotifications: null,
		paginationItemsCount: 0,
		modalOpen: false,
		modalType: ''
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

		this.setState({
			teamNotifications: response.data.notifications,
			paginationItemsCount: response.data.paginationItemsCount
		});
	};

	paginateTeamNotifiactions = async (page = 1) => {
		Nprogrss.start();
		try {
			const response = await teamNotifications(this.teamId, page);
			console.log('TeamDetails -> paginateTeamNotifiactions -> response', response);

			this.setState({
				teamNotifications: response.data.notifications,
				paginationItemsCount: response.data.paginationItemsCount
			});

			Nprogrss.done();
		} catch (error) {
			this.props.enqueueSnackbar(error.reponse.data.error || 'Something went wrong', { variant: 'error' });

			Nprogrss.done();
		}
	};

	openModal = modalType => {
		this.setState({ modalOpen: true, modalType });
	};

	closeModal = () => {
		this.setState({ modalOpen: false });
	};

	kickMemberFromTeam = async memberId => {
		const teamId = this.teamId;

		Nprogrss.start();
		const body = { teamId, memberId };

		try {
			const response = await kickMember(body);

			await this.getTeamData();

			Nprogrss.done();

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });
			// this.closeModal()
		} catch (error) {
			Nprogrss.done();
			this.props.enqueueSnackbar(error.response.data.error || 'Something Went Wrong.', { variant: 'error' });
		}
	};

	addMembersToTeam = async membersList => {
		// you will receive array of objects, map it to ids only
		const members = membersList.map(member => member._id);

		this.setState({ loading: true });
		try {
			const teamId = this.teamId;

			const body = { teamId, members };

			console.log('TeamDetails -> body', body);
			const response = await addMembers(body);

			await this.getTeamData();

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });
			this.setState({ loading: false });
			this.closeModal();
		} catch (error) {
			this.props.enqueueSnackbar(error.response?.data?.error || 'Something Went wring', { variant: 'error' });
			this.setState({ loading: false });
		}
	};
	render() {
		const {
			team,
			teamNotifications,
			paginationItemsCount,
			teamStatistics,
			loading,
			modalOpen,
			modalType
		} = this.state;

		const { userId } = this.props;

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
								<span className='teamMembers' onClick={() => this.openModal('teamMembers')}>
									{' '}
									{memberWord}
								</span>
							</h2>
							{/* Add Members Buttton */}
							{userId === team.leader && (
								<Tooltip title='Add Members'>
									<Button
										color='primary'
										variant='contained'
										size='small'
										onClick={() => this.openModal('addMembers')}
									>
										<Add />members
									</Button>
								</Tooltip>
							)}
						</div>
						<hr />
						<br />
						<br />
						<div className='row'>
							<div className='col-md-4'>
								<Notifications
									teamProjects={team.projects}
									teamNotifications={teamNotifications}
									paginationItemsCount={paginationItemsCount}
									paginateTeamNotifiactions={this.paginateTeamNotifiactions}
								/>
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

						{modalOpen && (
							<Modal
								modalOpen={modalOpen}
								closeModal={this.closeModal}
								header={
									modalType === 'teamMembers' ? (
										'Team Members'
									) : modalType === 'addMembers' ? (
										'Add Members'
									) : null
								}
							>
								{modalType === 'teamMembers' ? (
									<TeamMembers
										kickMemberFromTeam={this.kickMemberFromTeam}
										members={team.members}
										leader={leader}
									/>
								) : modalType === 'addMembers' ? (
									<AddMembers
										teamId={this.teamId}
										outerLoading={loading}
										addMembersToTeam={this.addMembersToTeam}
									/>
								) : null}
							</Modal>
						)}
					</Fragment>
				)}
			</Fragment>
		);
	}
}

const mapDispatchesToProps = dispatch => ({
	saveCurrentTeamId: currentTeamId => dispatch(saveCurrentTeamId(currentTeamId))
});

const mapStateToProps = state => ({ userId: state.currentUser && state.currentUser._id });

export default connect(mapStateToProps, mapDispatchesToProps)(withSnackbar(TeamDetails));
