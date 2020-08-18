import React, { Component } from 'react'
import Nprogress from 'nprogress';
import {projectDetails, projectTimeline} from '../../Apis/project'
import ProjectTimeline from '../../components/ProjectTimeline/ProjectTimeline'
export class ProjectDetails extends Component {
  
  
  projectId = this.props.match.params.projectId;

  state = {
    project: null,
    projectStatistics: null,
    projectTimeline: null,
    paginationItemsCount: 0
  }


  getProjectTimeLine = async (withLoading = true, page = 1) => {
    
    withLoading && Nprogress.start();
 
    try {

      const response = await projectTimeline(this.projectId, page);

      this.setState({projectTimeline: response.data.timeline, paginationItemsCount: response.data.paginationItemsCount})
      


      withLoading && Nprogress.done();
    } catch (error) {
      Nprogress.done()

      alert(error.response?.data?.error || 'Something Went Wrong, please try again later')
    }

  }

   getProject = async () => {
    await this.getProjectTimeLine(false);

    const response = await projectDetails(this.projectId);
    
    const {project, projectStatistics} = response.data;

    this.setState({project, projectStatistics})
}
  
  async componentDidMount() {

    Nprogress.start()
    try {
      await Promise.all([this.getProject(), this.getProjectTimeLine(false)])
      
      Nprogress.done()

    } catch (error) {
      Nprogress.done()

      alert(error.response?.data?.error || 'Something Went Wrong, please try again later')
    }
  }
  
  render() {
    const {project, projectStatistics, projectTimeline, paginationItemsCount} = this.state



    return (
      <div className='row'>
      {(project && projectStatistics && projectTimeline) &&
        <ProjectTimeline timeline = {projectTimeline} paginationItemsCount = {paginationItemsCount} getProjectTimeLine = {this.getProjectTimeLine}/>
      }
      </div>
    )}
}

export default ProjectDetails
