import React, { Component } from 'react'
import Form from '../../components/Form/Form';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import { TextField } from '@material-ui/core';
import {withSnackbar} from 'notistack';

export class ForgetPassword extends Component {


  state = {
    loading: false,
    email: '',

  }


  submitHandler = e => {
    e.preventDefault();
    
    this.setState({loading: true})







    try {
      this.setState({loading: false})
    } catch (error) {
      this.props.enqueueSnackbar(error.response?.data.error, {variant: 'error'})
      this.setState({loading: false})
    }
  }



  render() {

    const {loading, email} = this.state;
    return (
      <Form type = 'Forget Password'>
        <form>
          <TextField id="outlined-basic" name = 'email' label="Email" variant="outlined" required value = {email} fullWidth/>
          <br/>
          <br/>
          <LoadingBtn name = 'Send Email' fullWidth = {true} loading = {loading} />
        </form>

      </Form>
    )
  }
}

export default withSnackbar(ForgetPassword);
