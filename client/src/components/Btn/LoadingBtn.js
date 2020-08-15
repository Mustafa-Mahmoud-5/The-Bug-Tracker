import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

/*
REQUIRED PROPS
  name
  type
  loading
*/

function LoadingBtn(props) {
	let btnData = props.name;

	if (props.loading) {
		btnData = <CircularProgress variant='indeterminate' disableShrink color='primary' size={25} thickness={4} />;
	}

	return (
		<Button variant='contained' color='primary' fullWidth type={props.type} disabled={props.loading}>
			{btnData}
		</Button>
	);
}

export default LoadingBtn;
