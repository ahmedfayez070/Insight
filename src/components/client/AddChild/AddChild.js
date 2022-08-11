import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './AddChild.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlAddChild, apiUrlLocation } from '../../../api'

import ClientNavbar from '../ClientNavbar/ClientNavbar'
import ClientSideBar from '../ClientSideBar/ClientSideBar'
import Popup from '../../popup/Popup'

import $ from 'jquery'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { BeatLoader, FadeLoader } from 'react-spinners'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

class AddChild extends Component {

  state = {
    parentName: '',
    childName: '',
    childPhoto: null,
    childAge: '',
    childGender: '0',
    token: '',
    redirect: false,
    isOpen: false,
    txt: '',
    images: [],
    btnLoader: false,
    loader: true,
    errors: []
  }

  componentDidMount () {
    axios.get(apiUrlLocation).then(res => {
      this.setState({
        token: this.props.token,
      })
    }).catch()

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 4000)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleFileChild = (e) => {
    let file = e.target.files[0]
    this.setState({
      childPhoto: file
    })
  }

  handleAddChild = () => {
    this.setState({ btnLoader: true })
    let file = this.state.childPhoto
    let formData = new FormData()
    formData.append('profile_image', file)
    formData.append('name', this.state.childName)
    formData.append('age', this.state.childAge)
    formData.append('gender', this.state.childGender)
    
    // const info = {
    //   name: this.state.childName,
    //   age: this.state.childAge,
    //   gender: this.state.childGender,
    //   mediafile: formData
    // }

    if (this.state.childName && this.state.childAge) {
      setTimeout(() => {
        axios.post(apiUrlAddChild, formData, {
        headers:
        {
          Authorization: 'Bearer ' + this.state.token,
          Content_Type: 'multipart/form-data',
          type: "formData"
        }
        }).then(
        this.setState({btnLoader: false}),
        this.handleOpenPop('You added your child successfully'),
        setTimeout(() => {
          this.setState({
            redirect: true
          })
        }, 3000)
      ).catch(err => console.log(err))
      }, 2000)
    } else {
      this.handleOpenPop('Fill your data first')
    }
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

    const {redirect} = this.state;
    if (redirect) {
      return <Navigate to="/client-profile"></Navigate>
    }

    let gearContainer = document.querySelector('.slide-menu .gear-container')
    const navDetails = document.getElementById('nav-details')
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
          <ClientSideBar path={path} />

          <div className="profile-content">
            
            <ClientNavbar />

            <Fragment>
              <div className="profile-nav-menu">
                <p><Link to="/">Home</Link> / <Link to="/client-add-child">Add Child</Link>
                </p>
              </div>

              <div className="container tabs-container update">
                <div className="align-items-start">
                  <div className="tab-content update" id="v-pills-tabContent">
                    <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                      <div className="tab-content update tabs-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" 
                          id="nav-details" role="tabpanel" 
                          aria-labelledby="nav-details-tab">
                          <div className="tab-content-header">
                            <p>Add Child</p>
                          </div>
                          <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Full Name</p>
                            <p className="details-value">
                              <input type="text" placeholder="John Due" id='childName' onChange={this.handleChange} />
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Profile Picture</p>
                            <div id="update-img" className="details-value d-flex  align-items-center">
                              <div style={{maxWidth: '90px', maxHeight: '90px'}}><img className="special-img wh" src="../imgs/all/male_avatar.svg" alt="" /></div>
                                <input type="file" className="input-class" id="actual-btn" accept="image/*" onChange={this.handleFileChild} />
                                <label className="label-class client-profile" htmlFor="actual-btn">
                                  Upload
                                </label>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Age</p>
                            <p className="details-value">
                              <input className="age" type="text" placeholder="7" id='childAge' onChange={this.handleChange}/>
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Gender</p>
                              <div className='details-value'>
                                <select className="options choose-child p-8" onChange={this.handleChange} id='childGender'>
                                <option value="0">Male</option>
                                <option value="1">Female</option>
                              </select>
                              </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content adding-child">
                            <button className='add-child' onClick={this.handleAddChild}>Save</button>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          </div>
        </section>
        :
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
          <BeatLoader
            color={'#00818F'}
          />
        </div>
        }
      </Fragment>
      
    )
  }
}

function mapStateToProps({ loginReducer: loginReducer }) {
  return {
    token: loginReducer.token
  }
}

export default connect(mapStateToProps)(AddChild)