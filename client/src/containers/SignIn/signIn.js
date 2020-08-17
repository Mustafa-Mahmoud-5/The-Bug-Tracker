import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import AuthForm from '../../components/AuthForm/AuthForm';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import { withSnackbar } from 'notistack';
import { signin } from '../../Apis/auth';
export class SignIn extends Component {
	state = {
		email: '',
		password: '',
		loading: false
	};

	submitHandler = async e => {
		e.preventDefault();

		this.setState({ loading: true });
		const { email, password } = this.state;

		const body = { email, password };

		try {
			const response = await signin(body);

			this.setState({ loading: false });

			this.props.history.push('/dashboard');

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });

			localStorage.setItem('token', response.data.token);
		} catch (error) {
			this.setState({ loading: false });
			this.props.enqueueSnackbar(error.response.data.error, { variant: 'error' });
		}
	};

	writeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		return (
			<AuthForm type='Sign In'>
				<form onSubmit={this.submitHandler}>
					<div className='inpWrapper'>
						<TextField
							type='email'
							id='outlined-basic'
							name='email'
							value={this.state.email}
							label='Email'
							variant='outlined'
							fullWidth
							required
							onChange={this.writeHandler}
						/>
					</div>
					<div className='inpWrapper'>
						<TextField
							type='password'
							id='outlined-basic'
							name='password'
							label='Password'
							variant='outlined'
							fullWidth
							required
							value={this.state.password}
							onChange={this.writeHandler}
						/>
					</div>
					<LoadingBtn loading={this.state.loading} type='submit' name='sign up' />
				</form>
			</AuthForm>
		);
	}
}

export default withSnackbar(SignIn);
