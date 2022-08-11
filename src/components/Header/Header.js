import React, { Component, Fragment } from 'react'
import { Link, Navigate } from 'react-router-dom'
import '../../App.css'
import './Header.css'

import { connect } from 'react-redux'
import { apiUrlGetProfile, apiUrlLogout, apiUrlViewMoreProvider } from '../../api'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faTableColumns } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import Popup from '../popup/Popup'

class Header extends Component {

  state = {
    profilePic: null,
    token: '',
    redirect: false,
    type: '',
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({
      token: this.props.token,
      type: this.props.type
    })

    if (this.props.type == 'provider') {
      axios.get(apiUrlViewMoreProvider, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
        this.setState({
          profilePic: res.data.data.profile_image ?? null
        })
      }).catch(err => null)
    }

    if (this.props.type == 'client') {
      axios.get(apiUrlGetProfile, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
        let id = (this.props.childId != '' && this.props.childId != undefined) ? this.props.childId : 0
        if (res.data.client.children != null) {
          this.setState({
            profilePic: res.data.client.children[id - 1].profile_image != null ? res.data.client.children[id - 1].profile_image : null
          })
        }

      }).catch(err => null)
    }
  }

  handleLogout = () => {
    const action = {
      type: 'LOG_OUT',
      data: ''
    }

    const { dispatch } = this.props;
    dispatch(action)

    axios.post(apiUrlLogout, {},
    { headers: { Authorization: 'Bearer ' + this.state.token } })
      .then(
        this.setState({
          token: '',
          type: ''
        }),
        this.handleOpenPop('You loged out')
    ).catch(err => this.handleOpenPop(err))
  }

  handleOpenPop = (txt) => {
    this.setState({
      isOpen: true,
      txt
    })
  }

  handleClosePop = () => {
    this.setState({
      isOpen: false,
      txt: ''
    })
  }

  render() {

    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen}/>
        <div className="header">
          <div className="container">
            <ul className="header-content animate__slideInDown">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/nurseries">Nurseries</Link></li>
              <li><Link to="/browse-courses">Courses</Link></li>
              <li><Link to="/">About</Link></li>
              <li className="logo">
                <Link to="/" className='wh'>
                  <img src='../imgs/all/white logo.svg' />
                </Link>
              </li>
              {/* <li className="logo"><Link to="/">LOGO</Link></li> */}
              {/* <li className="icon-img"><img className="icon" src="../imgs/home-page-imgs/headphone.svg" alt="" /></li> */}
              <li>
                {/* <select className="lang" name="language" id="lang">
                  <option value="english">EN</option>
                  <option value="arabic">AR</option>
                </select> */}
              </li>
            </ul>

            {
              (this.state.type == 'client') ? 
                <div className='form-btn profile-sign-in'>
                  <div className="btn-group">
                    <button className="btn btn-secondary dropdown-toggle"
                      type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={this.state.profilePic ?? '../imgs/all/male_avatar.svg'} alt='' id='show-drop-down'/>
                    </button>
                    <ul className="dropdown-menu drop-down-menu">
                      <div className='pointer'>
                        <span><FontAwesomeIcon icon={faTableColumns}/></span>
                        <span><Link to='/client-dashboard'>My dashboard</Link></span>
                      </div>
                      <div className='pointer'>
                        <span><FontAwesomeIcon icon={faUser}/></span>
                        <span><Link to='/client-profile'>My profile</Link></span>
                      </div>
                      <div className='pointer'>
                        <span><FontAwesomeIcon icon={faRightFromBracket}/></span>
                        <span onClick={this.handleLogout}>Log out</span>
                      </div>
                    </ul>
                  </div>
                </div>
                
              : <div className='display-none'></div>
            }

            {
              (this.state.type == 'provider') ? 
                <div className='form-btn profile-sign-in'>
                  <div className="btn-group">
                    <button className="btn btn-secondary dropdown-toggle"
                      type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={this.state.profilePic ?? '../imgs/all/male_avatar.svg'} alt='' id='show-drop-down'/>
                    </button>
                    <ul className="dropdown-menu drop-down-menu">
                      <div className='pointer'>
                        <span><FontAwesomeIcon icon={faTableColumns}/></span>
                        <span><Link to='/provider-dashboard'>My Dashboard</Link></span>
                      </div>
                      <div className='pointer'>
                        <span><FontAwesomeIcon icon={faUser}/></span>
                        <span><Link to='/provider-profile'>My profile</Link></span>
                      </div>
                      <div className='pointer'>
                        <span><FontAwesomeIcon icon={faRightFromBracket}/></span>
                        <span onClick={this.handleLogout}>Log out</span>
                      </div>
                    </ul>
                  </div>
                </div>
                
              : <div className='display-none'></div>
            }

            {
              (!this.state.token) ?
                <div className='form-btn'>
                  <button className="login button-white-hover"><Link to="/login1">Log in</Link></button>
                  <button className="signup button-white-hover"><Link to="/signup1">Sign up</Link></button>
                </div> : <div className='display-none'></div>
            }
        </div>
      </div>
      </Fragment>
      
    )
  }
}

function mapStateToProps({ loginReducer, childReducer }) {
  return {
    token: loginReducer.token,
    type: loginReducer.type,
    childName: childReducer.childName,
    childId: childReducer.childId,
  }
}

export default connect(mapStateToProps)(Header)