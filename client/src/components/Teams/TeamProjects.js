import React from 'react';
import { connect } from 'react-redux';
import ProjectBox from '../Boxes/ProjectBox';
function TeamProjects(props) {
	const { projects, userId } = props;
	return <div className='row'>{projects.map((project, i) => <ProjectBox key={i} project={project} />)}</div>;
}

const mapStateToProps = state => ({ userId: state.currentUser._id });

export default TeamProjects;
