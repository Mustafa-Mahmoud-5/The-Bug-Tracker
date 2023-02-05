import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Particles from '../particles';
import './Header.scss';
import { withSnackbar } from 'notistack';
import OuterNav from '../OuterNav/OuterNav';
import { withRouter } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import { useGoogleLogin } from '@react-oauth/google';
import {googleAuth} from "../../Apis/auth"
import axios from "axios";
function Header(props) {
	
	const [loading, setLoading] = useState(false);


	const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
			setLoading(true);
			try {
				const body = {code: codeResponse};
				const res = await googleAuth(body);
        const {token} = res.data;
        if(token) {
					setLoading(false);
          localStorage.setItem('token', token);
					props.enqueueSnackbar(res.data.message, { variant: 'success' });				
					gotToProfile();
					return;
        }
				setLoading(false);
			} catch (error) {
				props.enqueueSnackbar(error.response?.data?.error, { variant: 'error' });
				setLoading(false);
				console.log(error.message);
			}
			
			
      },
    onError: errorResponse => console.log(errorResponse),
  });


	const	gotToProfile = () => {
		props.history.push('/bugtracker/profile');
	}

	const goToAuth = route => {
		props.history.push(route);
	};

	return (
		<header>
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
						<Button
							color='primary'
							variant='contained'
							style={{ marginRight: '10px' }}
							size='large'
							onClick={() => goToAuth('/signup')}
						>
							Sign Up
						</Button>
						<Button color='primary' variant='contained' size='large' onClick={() => goToAuth('/signin')}>
							Sign In
						</Button>
					</div>
					<GoogleButton  id="google-btn" disabled={loading} onClick={googleLogin}/>
				</div>
			</div>
		</header>
	);
}

export default withRouter(withSnackbar(Header));
