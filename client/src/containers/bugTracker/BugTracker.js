import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import { fetchUser } from '../../store/actions';
import Nprogress from 'nprogress';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Profile from '../Profile/Profile';
import EditProfile from '../Profile/EditProfile';
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
						<Route exact path='/bugtracker/profile' component={Profile} />
						<Route exact path='/bugtracker/profile/edit' component={EditProfile} />
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
