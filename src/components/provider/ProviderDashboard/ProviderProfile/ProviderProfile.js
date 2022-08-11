import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './ProviderProfile.css'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'

import { apiUrlShowProvider, apiUrlUpdateProvider } from '../../../../api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import Popup from '../../../popup/Popup'
import {BeatLoader, FadeLoader} from 'react-spinners'
import ProviderNavbar from '../ProviderNavbar/ProviderNavbar'

class ProviderProfile extends Component {

  state = {
    providerId: '',
    providerName: '',
    providerPhone: '',
    providerGender: '',
    providerEmail: '',
    profilePic: '',
    theEmail: '',
    thePhone: '',
    nurseryName: '',
    loginType: '',
    loader: true,
    token: '',
    btnLoader: false,
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    console.log(this.props.token);
    axios.get(apiUrlShowProvider, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        providerId: res.data.data.id ?? '',
        providerName: res.data.data.full_name ?? '',
        profilePic: res.data.data.profile_image ?? null,
        providerPhone: res.data.data.phone ?? '',
        thePhone: res.data.data.phone ?? '',
        providerGender: res.data.data.gender ?? '',
        providerEmail: res.data.data.email ?? '',
        theEmail: res.data.data.email ?? '',
        loginType: res.data.data.login_type ?? '',
        token: this.props.token,
        nurseryName: this.props.nurseryName,
        loader: false
      })
    }).catch(err => console.log(err))

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 25000)
  }

  handleChange = (e) => {
    if (e.target.id == 'providerPhone') {
      this.setState({
        thePhone : e.target.value
      })
      return 1
    }
    else if (e.target.id == 'providerEmail') {
      this.setState({
        theEmail : e.target.value
      })
      return 1
    }
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleUpdateProvider = () => {
    this.setState({btnLoader: true})
    let info
    if (this.state.providerEmail == this.state.theEmail & this.state.providerPhone == this.state.thePhone) {
      info = {
        full_name: this.state.providerName,
        gender: this.state.providerGender,
      }
    } else if (this.state.providerPhone == this.state.thePhone & this.state.providerEmail != this.state.theEmail) {
      info = {
        full_name: this.state.providerName,
        gender: this.state.providerGender,
        email: this.state.theEmail,
      }
    } else {
      info = {
        full_name: this.state.providerName,
        gender: this.state.providerGender,
        phone: this.state.thePhone,
      }
    }

    this.setState({
      providerPhone: this.state.thePhone,
      providerEmail: this.state.theEmail
    })

    axios.put(apiUrlUpdateProvider + this.state.providerId, info, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(res => {
      this.setState({
        providerId: res.data.data.id  ?? '',
        providerName: res.data.data.full_name  ?? '',
        providerPhone: res.data.data.phone  ?? '',
        providerGender: res.data.data.gender  ?? '',
        providerEmail: res.data.data.email  ?? '',
        theEmail: res.data.data.email ?? '',
        thePhone: res.data.data.phone ?? '',
        btnLoader:false
      })
      this.handleOpenPop('You updated your data successfully')
    }).catch(err => this.setState({btnLoader:false}))

    // setTimeout(() => {
    //   axios.get(apiUrlShowProvider, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
    //   this.setState({
    //     providerId: res.data.data.id ?? '',
    //     providerName: res.data.data.full_name ?? '',
    //     providerPhone: res.data.data.phone ?? '',
    //     thePhone: res.data.data.phone ?? '',
    //     providerGender: res.data.data.gender ?? '',
    //     providerEmail: res.data.data.email ?? '',
    //     theEmail: res.data.data.email ?? '',
    //     loginType: res.data.data.login_type ?? ''
    //   })
    // }).catch(err => console.log(err))
    // }, 2000)
  }

  handleUpdateCancelation = () => {
    axios.get(apiUrlShowProvider, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(res => {
      this.setState({
        providerId: res.data.data.id != null ? res.data.data.id : '',
        providerFullName: res.data.data.full_name != null ? res.data.data.full_name : '',
        providerPhone: res.data.data.phone != null ? res.data.data.phone : '',
        providerGender: res.data.data.gender != null ? res.data.data.gender : '',
        providerEmail: res.data.data.email != null ? res.data.data.email : ''
      })
      this.handleOpenPop('You canceled your update')
    }).catch(err => console.log(err))
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

    const clientUpdate = document.getElementById('go-client-update')
    const clientProfile = document.getElementById('go-client-profile')
    const vPillsHomeTab = document.getElementById('v-pills-home-tab')
    const clientprofile = document.getElementById('go-clientprofile')

    if (clientUpdate) {
      clientUpdate.onclick = () => {
        document.getElementById('v-pills-settings-tab').click()
        document.getElementById('nav-details-tab-update').click()
      }
    }

    if (clientProfile) {
      clientProfile.onclick = () => {
        vPillsHomeTab.click()
        document.getElementById('nav-details-tab').click()
      }
    }

    if (clientprofile) {
      clientprofile.onclick = () => {
        vPillsHomeTab.click()
      }
    }

    let gearContainer = document.querySelector('.slide-menu .gear-container')
    const navDetails = document.getElementById('nav-details')
    const vPillsSettings = document.getElementById('v-pills-settings')
    const ProfileNavMenu = document.querySelector('.profile-nav-menu')

    // Toggle slide menu in sm and md media
    if (gearContainer) {
      gearContainer.onclick = () => {
        if ($('.slide-menu').css("left") === "-200px") {
        $('.slide-menu').animate({left:"0px"}, 300)
        }
        else {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    // Close filterMenu when clicking on body
    if (navDetails) {
      navDetails.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    if (vPillsSettings) {
      vPillsSettings.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    if (ProfileNavMenu) {
      ProfileNavMenu.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    const path = window.location.pathname.slice(1)

    return (
      
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen} />
        {!this.state.loader ? 
          <section className="profile-container">
            {this.state.btnLoader ?
              <div className='d-flex justify-content-center align-items-center min-vh-100 loader'>
                <FadeLoader
                  color={'#00818F'}
                />
              </div> : null
            }
          <div className="slide-menu side-bar slide-menu-profile">
            <span className="gear-container gear-profile">
              <FontAwesomeIcon icon={faGear}/>
            </span>
            <div className="nav flex-column nav-pills side-bar-dashboard"
              id="v-pills-tab" role="tablist" aria-orientation="vertical">
              <div className='side-bar-img'>
                <img className='wh' src={this.state.profilePic ?? '../../imgs/all/Avatar.svg'}/>
              </div>
              <h2 className='line'>
                {this.state.nurseryName ? this.state.nurseryName : '-'}
              </h2>
              <button className="profile-hover button">
                <Link to='/provider-dashboard'>Dashboard</Link>
              </button>
              <button className="nav-link active button display-none" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home"
                type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
                Nursery Profile
              </button>
              <button className="profile-hover button">
                <Link to='/provider-nursery-profile'>Nursery Profile</Link>
              </button>
              <button className="profile-hover button">
                <Link to='/provider-child-info'>Child Info</Link>
              </button>
              <button className="profile-hover button">
                <Link to='/provider-reservations'>Reservations</Link>
              </button>
              <button className="profile-hover button">
                <Link to='/provider-subscriptions'>Subscriptions</Link>
              </button>
              <button className="profile-hover button">
                <Link to='/provider-children'>Children</Link>
              </button>
              <button className="profile-hover button">
                <Link to='/provider-timetable'>Timetable</Link>
              </button>
              <button className="nav-link display-none button" id="v-pills-settings-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settings"
                type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">
                Settings
              </button>
            </div>
          </div>

          <div className="profile-content">
            
            <ProviderNavbar />
            
            <div className="profile-nav-menu">
              <p><Link to="/">Home</Link> / <Link to="/provider-nursery-profile">My Profile</Link></p>
            </div>

            <div className="container tabs-container">
              <div className="align-items-start">
                <div className="tab-content" id="v-pills-tabContent">

                  {/* show My Profile */}
                  <div className="tab-pane fade show active"
                    id="v-pills-home" role="tabpanel"
                    aria-labelledby="v-pills-home-tab">
                    <nav className='display-none'>
                      <div className="nav nav-tabs nav-buttons mb-5" id="nav-tab" role="tablist">
                        <button className="nav-link nav-button active button" id="nav-details-tab" data-bs-toggle="tab" data-bs-target="#nav-details"
                          type="button" role="tab" aria-controls="nav-details" aria-selected="true">Nursery Profile</button>
                        <button className="nav-link nav-button button" id="nav-payment-tab" data-bs-toggle="tab" data-bs-target="#nav-payment"
                          type="button" role="tab" aria-controls="nav-payment" aria-selected="false">Payment Info</button>
                      </div>
                    </nav>
                    <div className="tab-content tabs-content update" id="nav-tabContent">
                      <div className="tab-pane fade show active" 
                        id="nav-details" role="tabpanel" 
                        aria-labelledby="nav-details-tab">
                        <div className="tab-content-header">
                          <p>My Profile</p>
                          <span>
                            <img src="../../imgs/provider-dashboard/edit.svg" alt="" id="go-client-update" />
                          </span>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Full Name</p>
                            <p className="details-value">
                              {this.state.providerName ? this.state.providerName : 'Update Your Name'}
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Email Address</p>
                            <p className="details-value">
                              {this.state.providerEmail ? this.state.providerEmail : 'Update Your Email'}
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Gender</p>
                            <p className="details-value">
                              {this.state.providerGender ? this.state.providerGender : 'Update Your Gender'}
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Mobile Number</p>
                            <p className="details-value">
                              {this.state.providerPhone ? this.state.providerPhone : 'Update Your Phone'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update My Profile */}
                  <div className="tab-pane fade" id="v-pills-settings"
                    role="tabpanel"
                    aria-labelledby="v-pills-settings-tab">
                    <nav className='display-none'>
                      <div className="nav nav-tabs nav-buttons mb-5" id="nav-tab" role="tablist">
                        <button className="nav-link nav-button button active" id="nav-details-tab-update" data-bs-toggle="tab" data-bs-target="#nav-details-update"
                          type="button" role="tab" aria-controls="nav-details-update" aria-selected="true">
                          Nursery Profile
                        </button>
                        <button className="nav-link nav-button button" id="nav-payment-tab-update" data-bs-toggle="tab" data-bs-target="#nav-payment-update"
                          type="button" role="tab" aria-controls="nav-payment-update" aria-selected="false">
                          Payment Info
                        </button>
                      </div>
                    </nav>
                    <div className="tab-content tabs-content update-nursery update" id="nav-tabContent">
                      <div className="tab-pane fade show active"
                        id="nav-details-update" role="tabpanel"
                        aria-labelledby="nav-details-tab">
                          <div className="tab-content-header">
                            <p>Update My Details</p>
                            <div className="update-actions">
                              <span id="go-client-profile" onClick={this.handleUpdateProvider} className='pointer'>Update</span>
                              <img src="../imgs/all/exit.svg" alt="" onClick={this.handleUpdateCancelation} id='go-clientprofile' />
                            </div>
                          </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Full Name</p>
                            <p className="details-value">
                              <input type="text" placeholder="John Due" id='providerName'
                                onChange={this.handleChange} value={this.state.providerName}/>
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Email Address</p>
                            <p className="details-value">
                              {/* <input type="text" placeholder="Lorem@example.com" id='providerEmail' onChange={this.handleChange} value={this.state.providerEmail} /> */}
                              {this.state.loginType == 'EM' ? this.state.providerEmail : <input type="text" placeholder="Lorem@example.com" id='providerEmail' onChange={this.handleChange} value={this.state.providerEmail}/>}
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Gender</p>
                            <p className="details-value">
                              <select defaultValue={this.state.providerGender} onChange={this.handleChange}>
                                <option value="0">Male</option>
                                <option value="1">Female</option>
                              </select>
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Mobile Number</p>
                            <p className="details-value">
                              {/* <input type="text" placeholder="01234567890" id='providerPhone' onChange={this.handleChange} /> */}
                              {this.state.loginType == 'PH' ? this.state.providerPhone : <input type="text" placeholder={this.state.providerPhone} id='providerPhone' onChange={this.handleChange} defaultValue='' />}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        :
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
          <BeatLoader
            color={'#00818F'}
          />
        </div>}
      </Fragment>
      
    )
  }
}

function mapStateToProps(
  { loginReducer, providerReducer }) {
  return {
    token: loginReducer.token,
    nurseryId: providerReducer.nurseryId,
    nurseryName: providerReducer.nurseryName
  }
}

export default connect(mapStateToProps)(ProviderProfile)