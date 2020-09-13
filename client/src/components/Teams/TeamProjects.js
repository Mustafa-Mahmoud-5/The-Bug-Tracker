import React from 'react';
import ProjectBox from '../Boxes/ProjectBox';
function TeamProjects(props) {
	console.log('TeamProjects -> props', props);
	const { projects } = props;
	return (
		<div className='row'>
			{projects.map((project, i) => (
				<ProjectBox key={i} project={project} removeProject={() => props.removeProject(project._id)} />
			))}
		</div>
	);
}

export default TeamProjects;
