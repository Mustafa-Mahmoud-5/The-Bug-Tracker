import React, { Component } from 'react';
import { fetchUser } from '../../store/actions';
import Nprogress from 'nprogress';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

// COMPONENTS
import Layout from '../../components/Layout/Layout';
import Profile from '../Profile/Profile';
import EditProfile from '../Profile/EditProfile';
import PersonalProjects from '../Projects/PersonalProjects';
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import Teams from '../Teams/Teams';
import TeamDetails from '../Teams/TeamDetails';
export class BugTracker extends Component {
	componentDidMount() {
		try {
			this.props.getUserData();
		} catch (error) {
			console.error(error);
		}
	}

	render() {
		if (this.props.loading) {
			Nprogress.start();
		} else {
			Nprogress.done();
			// we are done, userData are there, navigate to his profile
		}

		return (
			<div>
				<Layout>
					<Switch>
						{/* PROFILE */}
						<Route exact path='/bugtracker/profile' component={Profile} />
						<Route exact path='/bugtracker/profile/edit' component={EditProfile} />

						{/* PERSONAL DASHBOARD */}
						<Route exact path='/bugtracker/dashboard' component={PersonalProjects} />
						<Route exact path='/bugtracker/dashboard/project/:projectId' component={ProjectDetails} />

						{/* TEAMS */}
						<Route exact path='/bugtracker/teams' component={Teams} />
						<Route exact path='/bugtracker/teams/:teamId' component={TeamDetails} />
					</Switch>
				</Layout>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return { user: state.currentUser, loading: state.loading };
};

const mapDispatchToProps = dispatch => {
	return {
		getUserData: () => dispatch(fetchUser())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BugTracker);
