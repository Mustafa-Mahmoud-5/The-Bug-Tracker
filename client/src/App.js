import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Outer from './components/Outer/Outer';
import { Component } from 'react';
import AOS from 'aos';
import SignUp from './components/SignUp/SignUp';
import SignIn, { signIn } from './components/SignIn/signIn';
class App extends Component {
	render() {
		return (
			<div className='App'>
				<Switch>
					<Route path='/' exact component={Outer} />
					<Route path='/signup' exact component={SignUp} />
					<Route path='/signin' exact component={signIn} />
				</Switch>
			</div>
		);
	}

	componentDidMount() {
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

export default App;
