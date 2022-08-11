import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './ProviderNavbar.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlProviderNotifications,apiUrlViewMoreProvider, apiUrlLogout } from '../../../../api'
import Notification from '../../../Notification/Notification'
import Popup from '../../../popup/Popup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faTableColumns } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

class ProviderNavbar extends Component {

  state = {
    notifications: [],
    profilePic: null,
    token: '',
    logoutRedircet: false,
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlProviderNotifications, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      console.log(res.data.data.data);
      this.setState({
        token: this.props.token,
        notifications: res.data.data.data
      })
    })

    axios.get(apiUrlViewMoreProvider, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        profilePic: res.data.data.profile_image ?? null
      })
    }).catch(err => console.log(err))
  }

  handleLogout = () => {
    const action = {
      type: 'LOG_OUT',
      data: ''
    }

    const { dispatch } = this.props;
    dispatch(action)

    axios.post(apiUrlLogout, {}, { headers: {Authorization: 'Bearer ' + this.state.token}})
      .then(
        this.handleOpenPop('You loged out', 'true')
      )
  }

  handleOpenPop = (txt, deleteToken) => {
    this.setState({
      isOpen: true,
      txt
    })
    if (deleteToken === 'true') {
      this.setState({ token: '', logoutRedircet: true })
    }
  }

  handleClosePop = () => {
    this.setState({
      isOpen: false,
      txt: ''
    })
  }

  render() {

    console.log(this.state.token);

    const {logoutRedircet} = this.state;
    if (logoutRedircet) {
      return <Navigate to="/"></Navigate>
    }

    const { notifications } = this.state
    if (notifications.length) {
      var notificationsList = notifications.map((notification) => {
        return (
          <div>
            {/* <div className='pointer'>
              <FontAwesomeIcon icon={faTableColumns} size="xl" />
            </div> */}
            <div className='pointer'>
              <h5>{notification.title}</h5>
              <p>{notification.body}</p>
            </div>
          </div>
        )
      })
    }

    return (
      <Fragment>
        <Notification />
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen}/>
        <div className="profile-header">
          <li></li>
          {/* <li id="logo"><Link to='/'>LOGO</Link></li> */}
          <li className="logo" id="logo">
            <Link to="/">
              <img src='../imgs/all/dashboard logo.svg' />
            </Link>
          </li>
          <div>
            <div className="btn-group">
              <button className="btn btn-secondary dropdown-toggle"
                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="../../imgs/all/notification.svg" alt="" id='show-notify-down'/>
              </button>
              <ul className="dropdown-menu notify-down-menu notifications">
                {notificationsList ? notificationsList : <div className='no-notifications'>There are no notifications</div>}
              </ul>
            </div>
            <div className="btn-group">
              <button className="btn btn-secondary dropdown-toggle"
                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={this.state.profilePic ?? '../../imgs/all/male_avatar.svg'} alt='profile-image' id='show-drop-down'/>
              </button>
              <ul className="dropdown-menu drop-down-menu">
                <div>
                  <span><FontAwesomeIcon icon={faTableColumns}/></span>
                  <span><Link to='/provider-dashboard'>My dashboard</Link></span>
                </div>
                <div>
                  <span><FontAwesomeIcon icon={faUser}/></span>
                  <span><Link to='/provider-profile'>My Profile</Link></span>
                </div>
                <div>
                  <span><FontAwesomeIcon icon={faRightFromBracket}/></span>
                  <span onClick={this.handleLogout} className='pointer'>Log out</span>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

function mapStateToProps({ loginReducer: loginReducer }) {
  return {
    token: loginReducer.token
  }
}

export default connect(mapStateToProps)(ProviderNavbar)