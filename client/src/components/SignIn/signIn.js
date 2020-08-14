import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import AuthForm from '../AuthForm/AuthForm';
import Button from '@material-ui/core/Button';

export class signIn extends Component {
	render() {
		return (
			<AuthForm type='Sign In'>
				<form>
					<div className='inpWrapper'>
						<TextField id='outlined-basic' label='Outlined' variant='outlined' fullWidth />
					</div>
					<div className='inpWrapper'>
						<TextField id='outlined-basic' label='Outlined' variant='outlined' fullWidth />
					</div>
					<Button variant='contained' color='primary' fullWidth>
						Sign in
					</Button>
				</form>
			</AuthForm>
		);
	}
}

export default signIn;
