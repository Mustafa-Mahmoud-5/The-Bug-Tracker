import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import { connect } from 'react-redux';
import {userNotifications} from '../../Apis/user'
class Layout extends Component {

  state = {
    userNotifications: null
  }
  async componentDidMount() {

    try {
      const response = await userNotifications()
      console.log("Layout -> componentDidMount -> response", response)
      this.setState({userNotifications: response.data.user})
      
    } catch (error) {
      console.error(error)
    }
  }
	render() {
		return (
			<div>
				<Navbar userImg={this.props.userImg} userNotifications = {this.state.userNotifications}>
					{this.props.children}
				</Navbar>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return { userImg: state.currentUser?.image };
};
export default connect(mapStateToProps)(Layout);
