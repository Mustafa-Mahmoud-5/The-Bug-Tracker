import React, { Component, Fragment } from 'react'
import Nprogress from 'nprogress';
import {projectDetails, projectTimeline} from '../../Apis/project'
import ProjectTimeline from '../../components/ProjectTimeline/ProjectTimeline'
import Statistics from '../../components/Statistics/Statistics'
import './ProjectDetails.scss'
import Bugs from '../../components/Bugs/Bugs';
import Modal from '../../components/Modal/Modal';
import { toDate } from '../../helpers';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import BugDetails from '../../components/Bugs/BugDetails';

import {withSnackbar} from 'notistack'
import {fixBug, reOpenBug} from '../../Apis/bug'
export class ProjectDetails extends Component {
  
  
  projectId = this.props.match.params.projectId;

  state = {
    project: null,
    projectStatistics: null,
    projectTimeline: null,
    paginationItemsCount: 0,
    modalOpen: false,
    selectedBug: null,
    loading: false,
    modalType: ''
  }



  async componentDidMount() {

    try {
      await this.getProjectDetails();  
    } catch (error) {
      Nprogress.done()
      alert(error.response?.data?.error || 'Something Went Wrong, please try again later')
    }
  }


  getProjectTimeLine = async (withLoading = true, page = 1) => {
    // try&catch because i will also use this function individually
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
    //  no try&catch because this func will be called by other func
    await this.getProjectTimeLine(false);

    const response = await projectDetails(this.projectId);
    
    const {project, projectStatistics} = response.data;

    this.setState({project, projectStatistics})
  }


  getProjectDetails = async (withLoading = true) => {
    // try&catch because i will call this func individualy after updating
    withLoading && Nprogress.start()

    try {
      await Promise.all([this.getProject(), this.getProjectTimeLine(false)])
      withLoading && Nprogress.done()
      
    } catch (error) {
      Nprogress.done()
      alert(error.response?.data?.error || 'Something Went Wrong, please try again later')
      
    } 
  }

  updateBugStatus = async () => {
    const {project, selectedBug} = this.state;
  
    this.setState({loading: true})
    
    const body =  {teamId: null, bugId: selectedBug._id, projectId: project._id }
    
    try {

      // fixed
     
      if(selectedBug.status === 1){
        
        await reOpenBug(body)

        this.props.enqueueSnackbar('Bug has been re opened Successfully', { variant: 'success' });

      } else {
        // buggy
        
        await fixBug(body)
        
        this.props.enqueueSnackbar('Bug has been fixed Successfully', { variant: 'success' });
      }
      
      await this.getProjectDetails(false);


      this.setState({loading: false, modalOpen: false})

    } catch (error) {
      this.props.enqueueSnackbar(error.response.data.error, { variant: 'error' });
      
      this.setState({loading: false})

    }

  }

  



  openBugDetails = bugId => {

    const {project} = this.state;
    
    const selectedBug = project.bugs.find(bug => bug._id === bugId);


    this.setState({ selectedBug })
    this.openModal('bugDetails')
  }

  openModal = modalType => {
 
    this.setState({modalOpen: true, modalType})
  }

  closeModal = () => {
   this.setState({modalOpen: false})
  }



  
  render() {
    const {project, projectStatistics, projectTimeline, paginationItemsCount, modalOpen, selectedBug, loading, modalType} = this.state

    return (
      
      <Fragment>
      {(project && projectStatistics && projectTimeline) &&
      <div>

        <div className="row">
        <div className="col-md-4">
        <ProjectTimeline timeline = {projectTimeline} paginationItemsCount = {paginationItemsCount} getProjectTimeLine = {this.getProjectTimeLine}/>

        </div>
        <div className="col-md-8" id = 'separator'>
          <div className style= {{width: '100%'}}>
            <Statistics statistics = {projectStatistics}  />

          </div>

        </div>
        </div>
      <div className="row" style={{marginTop: '20px'}}>
        <div className="col-md-12">
          <Bugs bugs = {project.bugs} openBugDetails  = {this.openBugDetails}/>
        </div>
      </div>
      </div>
      }



      {/* Modal, will include addBug, bugDetails, editBug */}
      {modalOpen && <Modal  modalOpen = {modalOpen} header = {`${selectedBug.name}`}closeModal = {() => this.closeModal()}>

       {modalType === 'bugDetails' &&

        <BugDetails updateBugStatus = {this.updateBugStatus} projectType = {project.type} selectedBug ={selectedBug} loading ={loading}/>
      }

      </Modal>}
      </Fragment>
      )}
}

export default withSnackbar(ProjectDetails)
