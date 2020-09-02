import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Outer from './components/Outer/Outer';
import { Component } from 'react';
import AOS from 'aos';
import SignUp from './containers/SignUp/SignUp';
import SignIn from './containers/SignIn/signIn';
import BugTracker from './containers/bugTracker/BugTracker';
class App extends Component {
	render() {
		const userToken = localStorage.getItem('token');

		const routes =
			userToken === null ? (
				<Switch>
					<Route path='/' exact component={Outer} />
					<Route path='/signup' exact component={SignUp} />
					<Route path='/signin' exact component={SignIn} />
					<Redirect to='/' />
				</Switch>
			) : (
				<Switch>
					<Route path='/bugtracker' component={BugTracker} />
					<Redirect to='/bugtracker/profile' />
				</Switch>
			);

		return <div id='App'>{routes}</div>;
	}

	detectTokenPlaying = event => {
		if (event.key === 'token' && event.oldValue !== event.newValue) {
			localStorage.removeItem('token');
			this.props.history.push('/');
		}
	};

	componentDidMount() {
		window.addEventListener('storage', this.detectTokenPlaying, false);

		AOS.init({
			offset: 120, // offset (in px) from the original trigger point
			delay: 0, // values from 0 to 3000, with step 50ms
			duration: 1200, // values from 0 to 3000, with step 50ms
			easing: 'ease', // default easing for AOS animations
			once: false, // whether animation should happen only once - while scrolling down
			mirror: true // whether elements should animate out while scrolling past them
		});
	}
}

export default withRouter(App);
