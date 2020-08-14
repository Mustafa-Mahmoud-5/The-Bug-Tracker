import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export class SignUp extends Component {
	render() {
		return (
			<div className='container'>
				<Paper id='signpForm' elevation={3} style={{ textAlign: 'center' }}>
					<Typography variant='h4' color='primary'>
						THE-BUG-TRACKER
					</Typography>
					<form>
						<TextField id='outlined-basic' label='Outlined' variant='outlined' fullWidth />
						<TextField id='outlined-basic' label='Outlined' variant='outlined' />
						<TextField id='outlined-basic' label='Outlined' variant='outlined' />
						<TextField id='outlined-basic' label='Outlined' variant='outlined' />
					</form>
				</Paper>
			</div>
		);
	}
}

export default SignUp;
