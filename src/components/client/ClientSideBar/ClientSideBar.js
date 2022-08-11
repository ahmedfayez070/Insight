import React, { Component, Fragment } from 'react'
import axios from 'axios'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlGetProfile } from '../../../api'

import $ from 'jquery'

import Popup from '../../popup/Popup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { BeatLoader } from 'react-spinners'

class ClientSideBar extends Component {

  state = {
    token: '',
    childName: '',
    profilePic: null
  }

  componentDidMount() {
    axios.get(apiUrlGetProfile, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      if (this.props.childName != undefined && this.props.childName != '' && res.data.client.children.length) {
        console.log(res.data.client.children[0]);
        console.log(this.props.childId);
        this.setState({
          childName: res.data.client.children[this.props.childId - 1].name,
          profilePic: res.data.client.children[this.props.childId - 1].profile_image ?? null,
          token: this.props.token
        })
      } else {
        this.setState({
          token: this.props.token,
          childName: this.props.childName,
          profilePic: null,
        })
      }

    }).catch(
      this.setState({
        token: this.props.token,
        childName: this.props.childName
      })
    )
  }

  render() {

    const path = this.props.path
    const sidebarAllbuttons = document.querySelectorAll('.profile-hover')
    const targetButton = document.querySelector('.' + path)

    if (sidebarAllbuttons) {
      sidebarAllbuttons.forEach((eve) => {
        $(eve).removeClass('active')
      })
    }

    if (targetButton) {
      targetButton.classList.add('active')
    }
    
    return (
      <div className="slide-menu side-bar slide-menu-profile">
        <span className="gear-container gear-profile">
          <FontAwesomeIcon icon={faGear}/>
        </span>
        
        <div className="nav flex-column nav-pills side-bar-dashboard"
          id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <div className='side-bar-img'>
            <img className='wh' src={this.state.profilePic ?? '../../imgs/all/male_avatar.svg'}/>
          </div>
          <h2 className='line'>
            {this.state.childName ? this.state.childName : '-'}
          </h2>
          <button className="profile-hover button client-dashboard">
            <Link to='/client-dashboard'>My Dashboard</Link>
          </button>
          <button className="profile-hover button client-profile">
            <Link to='/client-profile'>My Profile</Link>
          </button>
          <button className="profile-hover button client-add-child">
            <Link to='/client-add-child'>Add Child</Link>
          </button>
          <button className="profile-hover button client-reservations">
            <Link to='/client-reservations'>All Reservations</Link>
          </button>
          <button className="profile-hover button client-subscriptions">
            <Link to='/client-subscriptions'>All subscription</Link>
          </button>
        </div>
        
      </div>
    )
  }
}

function mapStateToProps({ loginReducer, childReducer }) {
  return {
    token: loginReducer.token,
    childName: childReducer.childName,
    childId: childReducer.childId,
  }
}

export default connect(mapStateToProps)(ClientSideBar)