import React from 'react';
import Button from '@material-ui/core/Button';
import Particles from '../particles';
import './Header.scss';
import OuterNav from '../OuterNav/OuterNav';
import { Fragment } from 'react';
function header() {
	return (
		<Fragment>
			<OuterNav />
			<div id='About'>
				<Particles />
				<div className='headerBox' data-aos='fade-up'>
					<h1>
						<span className='primaryColor' variant='span'>
							THE BUG TRACKER
						</span>{' '}
						software is a free open source bug tracking application.
					</h1>

					<p className='text-md'>
						The application allows you to work in an isolated environment for tracking your personal
						projects as well as working in a realtime environment with your teams for tracking team
						projects.
					</p>

					<p className='text-md bold'>Every thing happens while working with your team is realtime.</p>
					<p className='text-md italic'>Sign up and start tracking your application bugs now.</p>
					<div className='authBox'>
						<Button color='primary' variant='outlined' style={{ marginRight: '10px' }} size='large'>
							Sign Up
						</Button>
						<Button color='primary' variant='outlined' size='large'>
							Sign In
						</Button>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

export default header;
