import React, { Component, Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import AuthForm from '../AuthForm/AuthForm';
import Button from '@material-ui/core/Button';

export class SignUp extends Component {
	render() {
		return (
			<AuthForm type='Sign Up'>
				<form>
					<div className='inpWrapper'>
						<TextField id='outlined-basic' label='Outlined' variant='outlined' fullWidth />
					</div>
					<div className='inpWrapper'>
						<TextField id='outlined-basic' label='Outlined' variant='outlined' fullWidth />
					</div>
					<div className='inpWrapper'>
						<TextField id='outlined-basic' label='Outlined' variant='outlined' fullWidth />
					</div>
					<div className='inpWrapper'>
						<TextField id='outlined-basic' label='Outlined' variant='outlined' fullWidth />
					</div>
					<div className='inpWrapper'>
						<Button variant='contained' color='primary' fullWidth>
							Sign up
						</Button>
					</div>
				</form>
			</AuthForm>
		);
	}
}

export default SignUp;
