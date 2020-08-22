import React from 'react';
import './ProjectBox.scss';
import Paper from '@material-ui/core/Paper';
import { toDate } from '../../helpers';
import { DeleteForever, LockOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { LockOpenOutlined } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
function ProjectBox(props) {
	const { project } = props;

	let bugText = project.bugs.length === 1 ? 'Bug' : 'Bugs';

	const goToDetails = () => {
		props.history.push(`/bugtracker/dashboard/project/${project._id}`);
	};

	return (
		<div className='col-md-4'>
			<Paper elevation={3} className='ProjectBox' onClick={goToDetails}>
				<h2 className='capitalize'>{project.name}</h2>
				<h4>
					{' '}
					<span> {project.bugs.length} </span> {bugText}
				</h4>
				<p className='secondary' style={{ fontStyle: 'italic' }}>
					Created at {toDate(project.createdAt)}
				</p>
				<div className=''>
					<Tooltip title='Delete Project'>
						<IconButton>
							<DeleteForever color='secondary' />
						</IconButton>
					</Tooltip>
				</div>
				<div className='status'>
					{project.status === 1 ? (
						<Tooltip title='Status: Closed'>
							<LockOutlined style={{ color: '#5cb85c' }} />
						</Tooltip>
					) : (
						<Tooltip title='Status: Opened'>
							<LockOpenOutlined color='secondary' />
						</Tooltip>
					)}
				</div>
			</Paper>
		</div>
	);
}

export default withRouter(ProjectBox);
