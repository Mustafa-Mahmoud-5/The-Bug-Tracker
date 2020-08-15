import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './AuthForm.scss';

function AuthForm(props) {
	return (
		<div id='authPage'>
			<Paper id='authForm' elevation={3}>
				<Typography
					variant='h4'
					color='primary'
					style={{ marginBottom: '20px', textAlign: 'center', textTransform: 'capitalize' }}
				>
					{props.type}
				</Typography>

				{/* form */}
				{props.children}
			</Paper>
		</div>
	);
}

export default AuthForm;
