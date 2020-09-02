import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import { connect } from 'react-redux';
import {userNotifications, seenNotifications} from '../../Apis/user'


class Layout extends Component {

  state = {
    userNotifications: null
  }
  async componentDidMount() {

    try {
      const response = await userNotifications()
      this.setState({userNotifications: response.data.notifications})
      
    } catch (error) {
      console.error(error)
    }
  }


  seeNewNotifications = async () => {

    try {

      const {userNotifications} = this.state;
      
      let newNotifications = false;
      

      for(let n of userNotifications) {
        if(n.seen === false) newNotifications = true
        break;
      }

      
      if(newNotifications) {

        // do the quick optimistic one for user first, then go and update the db 
        this.quickSeeNewNotifications();
        
        
        await seenNotifications();
      }
      
    } catch (error) {
      console.error(error)
    }
  }
  
  quickSeeNewNotifications = () => {
    // UPDATING NESTED ARRAY OBJECTS IMMUTABILLY -_-
    const updatedNotifications = [...this.state.userNotifications];

    updatedNotifications.forEach((n, i) => {
      
      const updatedNotification = {...n};
      
      updatedNotification.seen = true;

      updatedNotifications[i] = updatedNotification;

      this.setState({userNotifications: updatedNotifications});

    })

  }

	render() {
		return (
			<div>
				<Navbar userImg={this.props.userImg} userNotifications = {this.state.userNotifications} seeNewNotifications = {this.seeNewNotifications}>
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
