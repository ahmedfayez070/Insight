import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './ClientNavbar.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlLogout, apiUrlClientNotifications, apiUrlGetProfile } from '../../../api'
import Notification from '../../Notification/Notification'
import Popup from '../../popup/Popup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircleInfo, faCircleXmark, faExclamationCircle, faUser } from '@fortawesome/free-solid-svg-icons'
import { faTableColumns } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

class ClientNavbar extends Component {

  state = {
    childName: '',
    profilePic: null,
    notifications: [],
    token: '',
    logoutRedircet: false,
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlClientNotifications, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      console.log(res.data.data.data);
      this.setState({
        token: this.props.token,
        notifications: res.data.data.data ?? []
      })
    })

    axios.get(apiUrlGetProfile, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      if (this.props.childName != undefined && this.props.childName != '' && res.data.client.children.length) {
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

    const {logoutRedircet} = this.state;
    if (logoutRedircet) {
      return <Navigate to="/"></Navigate>
    }

    const { notifications } = this.state
    if (notifications.length) {
      var notificationsList = notifications.slice(0, 10).map((notification) => {
        return (
          <div>
            <div className='pointer'>
              {notification.type == 'reservation_reject' && <FontAwesomeIcon icon={faExclamationCircle} size="xl" className="text-warning"/>}
              {notification.type == 'reservation_ended' && <FontAwesomeIcon icon={faCircleXmark} size="xl" className="text-danger"/>}
              {notification.type == 'reservation_accept' && <FontAwesomeIcon icon={faCheckCircle} size="xl" className="text-success"/>}
              {notification.type == 'provider_info' && <FontAwesomeIcon icon={faCircleInfo} size="xl" className="text-info"/>}
            </div>
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
                <img src={this.state.profilePic ?? '../../imgs/all/male_avatar.svg'} alt='' id='show-drop-down'/>
              </button>
              <ul className="dropdown-menu drop-down-menu">
                <div>
                  <span><FontAwesomeIcon icon={faTableColumns}/></span>
                  <span><Link to='/client-dashboard'>My dashboard</Link></span>
                </div>
                <div>
                  <span><FontAwesomeIcon icon={faUser}/></span>
                  <span><Link to='/client-profile'>My profile</Link></span>
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

function mapStateToProps({ loginReducer, childReducer }) {
  return {
    token: loginReducer.token,
    childName: childReducer.childName,
    childId: childReducer.childId,
  }
}

export default connect(mapStateToProps)(ClientNavbar)