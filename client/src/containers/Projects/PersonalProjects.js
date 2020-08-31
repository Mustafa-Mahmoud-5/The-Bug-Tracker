import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import Nprogress from 'nprogress';
import { personalProjects } from '../../Apis/user';
import ProjectBox from '../../components/Boxes/ProjectBox';
import Alert from '@material-ui/lab/Alert';
export class PersonalProjects extends Component {
	state = {
		projects: null
	};

	async componentDidMount() {
		try {
			Nprogress.start();

			const response = await personalProjects();
			console.log('PersonalProjects -> componentDidMount -> response', response);
			Nprogress.done();

			this.setState({ projects: response.data.projects });
		} catch (error) {
			Nprogress.done();
			// alert(error.response.data.error || 'Something went wrong, please try again later');
		}
	}

	render() {
		const { projects } = this.state;

		let personalProjects;

		if (projects) {
			if (projects.length > 0) {
				personalProjects = (
					<div className='row'>
						{projects.map(project => {
							return <ProjectBox key={project._id} project={project} />;
						})}
					</div>
				);
			} else {
				personalProjects = (
					<Alert severity='warning'>
						You have no projects! start adding some from the navbar at the top.
					</Alert>
				);
			}
		}

		return <div id='personalProjects'>{personalProjects}</div>;
	}
}

export default PersonalProjects;
