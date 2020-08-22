import React, { Component, Fragment } from 'react'
import Nprogress from 'nprogress';
import {projectDetails, projectTimeline} from '../../Apis/project'
import ProjectTimeline from '../../components/ProjectTimeline/ProjectTimeline'
import Statistics from '../../components/Statistics/Statistics'
import './ProjectDetails.scss'
import Bugs from '../../components/Bugs/Bugs';
import Modal from '../../components/Modal/Modal';
import BugDetails from '../../components/Bugs/BugDetails';
import AddBug from '../../components/Bugs/AddBug';
import EditBug from '../../components/Bugs/EditBug';
import {withSnackbar} from 'notistack'
import {fixBug, reOpenBug, newBug, editBug} from '../../Apis/bug'
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
    Nprogress.start();
    try {
      await this.getProjectDetails();
      Nprogress.done()
    } catch (error) {
      Nprogress.done()
      alert(error.response?.data?.error || 'Something Went Wrong, please try again later')
    }
  }

  // PROJECTS FUNCTIONS
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

  // for getting all data
  getProjectDetails = async () => {
      await Promise.all([this.getProject(), this.getProjectTimeLine(false)])
  }



  // BUGS FUNCTIONS
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
  
  addBug = async (e,{name, description}) => {
    e.preventDefault();

    this.setState({loading: true})
    
    const { project } = this.state;

    const body = {name, description, projectId: project._id, teamId: null};

    try {
      const response = await newBug(body);

      await this.getProjectDetails();


      this.props.enqueueSnackbar(response.data.message || 'Something went Wrong', {variant: 'success'})
    this.setState({loading: false, modalOpen: false})

    } catch (error) {
    this.setState({loading: false})

      this.props.enqueueSnackbar(error.response.data.error || 'Something went Wrong', {variant: 'error'})
    }
  }


  editBugDetails = async (e, {newName, newDescription}) => {

    e.preventDefault();

    this.setState({loading: true});

    try {

      const {selectedBug} = this.state
      
      const body = {newName, newDescription, bugId: selectedBug._id};

      const result = await editBug(body);


      this.props.enqueueSnackbar(result.data.message, {variant:'success'})

      this.setState({loading: false, modalOpen: false})


    } catch (error) {
      console.log("editBugDetails -> error", error.response)
      this.props.enqueueSnackbar(error.response.data.error || 'Something Went Wrong', {variant:'error'})
      this.setState({loading: false})
    }
  }

  // MODAL FUNCTIONS
  openBug = (bugId, modalType) => {

    const {project} = this.state;
    
    const selectedBug = project.bugs.find(bug => bug._id === bugId);


    this.setState({ selectedBug })

    this.openModal(modalType)
  }

  openModal = modalType => {
 
    this.setState({ modalType, modalOpen: true})
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
          <div style= {{width: '100%'}}>
            <Statistics statistics = {projectStatistics}  />

          </div>

        </div>
        </div>
      <div className="row" style={{marginTop: '20px'}}>
        <div className="col-md-12">
          <Bugs openModal = {this.openModal} bugs = {project.bugs} openBug  = {this.openBug}/>
        </div>
      </div>
      </div>
      }



      {/* Modal, will include addBug, bugDetails, editBug */}
      {modalOpen && <Modal  modalOpen = {modalOpen} header = { modalType=== ('bugDetails' || modalType === 'editBug')? `${selectedBug.name}`: modalType ==='addBug' ? 'Add Bug': null}closeModal = {() => this.closeModal()}>

       {modalType === 'bugDetails' ?
        <BugDetails updateBugStatus = {this.updateBugStatus} projectType = {project.type} selectedBug ={selectedBug} loading = {loading} />
      
        : modalType === 'addBug' ? <AddBug loading ={loading} addBug = {this.addBug}/>
        
        : modalType === 'editBug' ? <EditBug loading = {loading} selectedBug = {selectedBug}  editBugDetails = {this.editBugDetails} /> : null
      }

      </Modal>}
      </Fragment>
      )}
}

export default withSnackbar(ProjectDetails)
