import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
const useStyles = makeStyles(theme => ({
	modal: {
		display: 'flex',
		justifyContent: 'center',
		paddingTop: '5%',
		border: 'none'
	},
	modalPaper: {
		padding: '20px',
		backgroundColor: '#11161A',
		width: '80%',
		height: '80%',
		border: 'none',
		outline: 'none',
		color: 'white',
		overflowY: 'scroll'
	}
}));

/*
 modalOpen <bool> --> the modal is opened or not 
 closeModal <func> --> to close the modal
 header <string> --> the modal header 	
 */
export default function TransitionsModal(props) {
	const classes = useStyles();

	return (
		<div>
			<Modal
				aria-labelledby='transition-modal-title'
				aria-describedby='transition-modal-description'
				className={classes.modal}
				open={props.modalOpen}
				onClose={props.closeModal}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={props.modalOpen}>
					<Paper elevation={3} className={classes.modalPaper}>
						<h2 id='transition-modal-title' style={{ textAlign: 'center', color: '#03a9f4' }}>
							{props.header}
						</h2>
						{props.children}
					</Paper>
				</Fade>
			</Modal>
		</div>
	);
}
