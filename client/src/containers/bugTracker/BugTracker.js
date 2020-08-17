import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import { fetchUser } from '../../store/actions';
import Nprogress from 'nprogress';

import { connect } from 'react-redux';
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
		}

		return (
			<div>
				<Layout>
					<h1>app body</h1>
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
