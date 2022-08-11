import React, { Component } from 'react'
import axios from 'axios'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlShowProvider } from '../../../../api'

import $ from 'jquery'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

class ProviderSidebar extends Component {

  state = {
    nurseryId: '',
    nurseryName: '',
    profilePic: null,
    token: ''
  }

  componentDidMount() {
    axios.get(apiUrlShowProvider, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        profilePic: res.data.data.profile_image,
        nurseryId: this.props.nurseryId,
        nurseryName: this.props.nurseryName,
        token: this.props.token
      })
    }).catch(
      this.setState({
        nurseryId: this.props.nurseryId,
        nurseryName: this.props.nurseryName,
        token: this.props.token
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
            <img src={this.state.profilePic ?? '../../imgs/all/male_avatar.svg'} className='wh'/>
            {/* <img src='../../imgs/all/white logo.svg'/> */}
          </div>
          <h2 className='line'>
            {this.props.nurseryName ? this.props.nurseryName : '-'}
          </h2>
          <button className="profile-hover button provider-dashboard">
            <Link to='/provider-dashboard'>Dashborad</Link>
          </button>
          <button className="profile-hover button provider-nursery-profile">
            <Link to='/provider-nursery-profile'>Nursery Profile</Link>
          </button>
          <button className="profile-hover button provider-child-info">
            <Link to='/provider-child-info'>Child Info</Link>
          </button>
          <button className="profile-hover button provider-reservations">
            <Link to='/provider-reservations'>Reservations</Link>
          </button>
          <button className="profile-hover button provider-subscriptions">
            <Link to='/provider-subscriptions'>Subscriptions</Link>
          </button>
          <button className="profile-hover button provider-children">
            <Link to='/provider-children'>Children</Link>
          </button>
          <button className="profile-hover button provider-timetable">
            <Link to='/provider-timetable'>Timetable</Link>
          </button>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ loginReducer, providerReducer }) {
  return {
    token: loginReducer.token,
    nurseryId: providerReducer.nurseryId,
    nurseryName: providerReducer.nurseryName,
  }
}

export default connect(mapStateToProps)(ProviderSidebar)