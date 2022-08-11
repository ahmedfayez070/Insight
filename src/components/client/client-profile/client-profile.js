import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './client-profile.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlUpdateChild, apiUrlViewChildren, apiUrlViewChild, apiUrlGetProfile, apiUrlUpdateProfile, apiUrlloginType, apiUrlLocation } from '../../../api'

import $ from 'jquery'

import ClientNavbar from '../ClientNavbar/ClientNavbar'
import Popup from '../../popup/Popup'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import {BeatLoader, FadeLoader} from 'react-spinners'
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'

class ClientProfile extends Component {

  state = {
    client: [],
    children: [],
    parentId: '',
    parentType: '',
    parentName: '',
    parentGender: '',
    parentEmail: '',
    parentPhone: '',
    parentGovernorate: '',
    parentCity: '',
    parentArea: '',
    parentReservations: '',
    parentStatus: '',
    childId: '1',
    childName: '',
    childPhoto: null,
    childAge: '',
    childGender: '',
    childStatus: '',
    childMarks: [],
    childTimetable: [],
    childrenIds: [],
    childrenNames: [],
    governorates: [],
    cities: [],
    areas: [],
    token: '',
    theEmail: '',
    thePhone: '',
    expanded: '',
    isOpen: false,
    txt: '',
    btnLoader: false,
    loader: true,
    errors: []
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlGetProfile, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        token: this.props.token,
        childName: this.props.childName,
        clientId: res.data.client.id,
        client: res.data.client,
        parentName: res.data.client.fullname,
        parentEmail: res.data.client.email,
        theEmail: res.data.client.email,
        parentGender: res.data.client.gender,
        parentId: res.data.client.id,
        parentGovernorate: res.data.client.location.governerate,
        parentCity: res.data.client.location.city,
        parentArea: res.data.client.location.area,
        parentPhone: res.data.client.phone,
        thePhone: res.data.client.phone,
        parentReservations: res.data.client.reservations,
        parentStatus: res.data.client.status,
        children: res.data.client.children,
        parentType: res.data.client.login_type,
      })
      if (res.data.client.children.length) {
        let id = (this.props.childId != '' && this.props.childId != undefined) ? this.props.childId : 1
        axios.get(apiUrlViewChild + id, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
          this.setState({
            childName: (this.props.childName != undefined && this.props.childName != '') ? this.props.childName : res.data.child.name,
            // childName: res.data.child.name != null ? res.data.child.name : '',
            childPhoto: res.data.child.profile_image != null ? res.data.child.profile_image : '',
            childAge: res.data.child.age != null ? res.data.child.age : '',
            childGender: res.data.child.gender != null ? res.data.child.gender : '',
            childStatus: res.data.child.status != null ? res.data.child.status : '',
            childMarks: res.data.child.marks != null ? res.data.child.marks : [],
            childTimetable: res.data.child.timetable != null ? res.data.child.timetable : null,
            loader: false
          })
        })
      }

      const action1 = {
        type: 'CHANGE_CLIENT_ID',
        data: res.data.client.clientId
      }
      const { dispatch } = this.props;
      dispatch(action1)

    }).catch(err => null)

    axios.get(apiUrlLocation).then(res => {
      this.setState({
        governorates: res.data.data
      })
    }).catch(err => this.handleOpenPop(err))

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 25000)
  }

  handleChange = (e) => {
    if (e.target.id == 'parentPhone') {
      this.setState({
        thePhone : e.target.value
      })
      return 1
    }
    else if (e.target.id == 'parentEmail') {
      this.setState({
        theEmail : e.target.value
      })
      return 1
    }
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleChildChange = (e) => {
    this.setState({btnLoader: true})
    var target = parseInt(e.target.value)
    axios.get(apiUrlViewChild + target, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(res => {
      this.setState({
        childName: res.data.child.name,
        childPhoto: res.data.child.profile_image != null ? res.data.child.profile_image : '',
        childAge: res.data.child.age != null ? res.data.child.age : '',
        childGender: res.data.child.gender != null ? res.data.child.gender : '',
        childStatus: res.data.child.status != null ? res.data.child.status : '',
        childMarks: res.data.child.marks != null ? res.data.child.marks : [],
        childTimetable: res.data.child.timetable != null ? res.data.child.timetable : null,
      })
      this.setState({btnLoader: false})
    })
  }

  handleFileChild = (e) => {
    let file = e.target.files[0]
    this.setState({
      childPhoto: file
    })
  }

  handleUpdateClient = () => {
    this.setState({btnLoader: true})
    let info
    if (this.state.parentEmail == this.state.theEmail & this.state.parentPhone == this.state.thePhone) {
      info = {
        fullname: this.state.parentName,
        governerate: this.state.parentGovernorate,
        city: this.state.parentCity,
        area: this.state.parentArea,
      }
    } else if (this.state.parentPhone == this.state.thePhone & this.state.parentEmail != this.state.theEmail) {
      info = {
        fullname: this.state.parentName,
        governerate: this.state.parentGovernorate,
        city: this.state.parentCity,
        area: this.state.parentArea,
        email: this.state.theEmail,
      }
    } else {
      info = {
        fullname: this.state.parentName,
        governerate: this.state.parentGovernorate,
        city: this.state.parentCity,
        area: this.state.parentArea,
        phone: this.state.thePhone,
      }
    }

    this.setState({
      parentPhone: this.state.thePhone,
      parentEmail: this.state.theEmail
    })

    axios.post(apiUrlUpdateProfile, info, { headers: { Authorization: 'Bearer ' + this.state.token } })
      .then(res => {
        this.setState({
          client: res.data.client.client
        })
        this.setState({btnLoader: false})
        this.handleOpenPop('You updated your data successfully')
      })
      .catch(err => console.log(err))
  }

  handleUpdateCancelation = () => {
    axios.get(apiUrlGetProfile, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(res => {
      this.setState({
        clientId: res.data.client.id,
        client: res.data.client,
        parentName: res.data.client.full_name,
        parentEmail: res.data.client.email,
        theEmail: res.data.client.email,
        parentGender: res.data.client.gender,
        parentId: res.data.client.id,
        parentGovernorate: res.data.client.location.governerate,
        parentCity: res.data.client.location.city,
        parentArea: res.data.client.location.area,
        parentPhone: res.data.client.phone,
        thePhone: res.data.client.phone,
        parentReservations: res.data.client.reservations,
        parentStatus: res.data.client.status,
        children: res.data.client.children,
        parentType: res.data.client.login_type,
      })
      let id = (this.props.childId != '' && this.props.childId != undefined) ? this.props.childId : 0
      if (res.data.client.children.length) {
        this.setState({
          childName: this.state.client.children[id - 1].name != null ? this.state.client.children[id - 1].name : '',
          childPhoto: this.state.client.children[id - 1].profile_image != null ? this.state.client.children[id - 1].profile_image : '',
          childAge: this.state.client.children[id - 1].age != null ? this.state.client.children[id - 1].age : '',
          childGender: this.state.client.children[id - 1].gender != null ? this.state.client.children[id - 1].gender : '',
          childStatus: this.state.client.children[id - 1].status != null ? this.state.client.children[id - 1].status : '',
          childMarks: this.state.client.children[id - 1].marks != null ? this.state.client.children[id - 1].marks : [],
        })
      }
      this.handleOpenPop('You canceled your update')
    }).catch(err => console.log(err))
  }
  
  handleUpdateChild = () => {
    this.setState({ btnLoader: true })
    if (typeof this.state.childPhoto === 'string' || this.state.childPhoto instanceof String) {
      var file = this.state.childPhoto.search('https') > -1 ? '' : this.state.childPhoto
    } else {
      var file = this.state.childPhoto
    }
    var formData = new FormData()
    if (file) {
      formData.append('profile_image', file)
    }
    formData.append('name', this.state.childName)
    formData.append('age', this.state.childAge)
    formData.append('_method', 'put')

    setTimeout(() => {
      if (this.state.childName && this.state.childAge) {
        axios.post(apiUrlUpdateChild + parseInt(this.state.childId), formData, { headers: { Authorization: 'Bearer ' + this.state.token, ContentType: "multipart/form-data",
        type: "formData" } })
          .then(res => {
            this.setState({
              childName: res.data.child.name,
              childPhoto: res.data.child.profile_image,
              childAge: res.data.child.age,
              childGender: res.data.child.gender,
              childStatus: res.data.child.status,
              childMarks: res.data.child.marks,
              childTimetable: res.data.child.timetable ?? null,
            })
            axios.get(apiUrlViewChildren, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
              this.setState({
                children: res.data.children
              })
            })
            this.setState({btnLoader: false})
            this.handleOpenPop("You updated your child's data successfully")
          })
        .catch(err => this.setState({btnLoader: false}))
      } else {
        this.handleOpenPop('Fill your data first')
      }
    }, 3000)
    
  }

  handleFilterChange = (e) => {
    this.setState({
      [e.target.title] : e.target.value
    })

    if (e.target.id === 'governorate') {
      this.sendGetGovernorateRequest(e)
    } else if (e.target.id === 'city') {
      this.sendGetCityRequest(e)
    }

    // this.handleSubmit(e)
  }

  sendGetGovernorateRequest = async (e) => {
    try {
      const response = await axios.get(apiUrlLocation + '?governorate=' + e.target.value)
      this.setState({
        cities: response.data.data
      })
    } catch (err) {
      
    }
  }

  sendGetCityRequest = async (e) => {
    try {
      const response = await axios.get(apiUrlLocation + '?governorate=' + this.state.parentGovernorate + '&city=' + e.target.value)
      this.setState({
        areas: response.data.data
      })
    } catch (err) {
      
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

    const Accordion = styled((props) => (
      <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
      border: `1px solid ${theme.palette.divider}`,
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
    }));

    const AccordionSummary = styled((props) => (
      <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
      />
    ))(({ theme }) => ({
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, .05)'
          : 'rgba(0, 0, 0, .03)',
      flexDirection: 'row-reverse',
      '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
      },
      '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
      },
    }));

    const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
      padding: theme.spacing(2),
      borderTop: '1px solid rgba(0, 0, 0, .125)',
    }));

    const { children } = this.state
    const childrenList = children.map((child) => {
      return (
        <option value={child.id} key={child.id}>{child.name}</option>
      )
    })

    const { childMarks } = this.state
    if (childMarks) {
      var childMarksList = childMarks.map((mark) => {
      return (
        <tr>
          <td>{mark.course}</td>
          <td>{mark.scored_mark}</td>
          <td>{mark.full_mark}</td>
          <td>{mark.updated_at}</td>
        </tr>
      )})
    }

    const { childId } = this.state
    const { childName } = this.state

    const { governorates } = this.state
    const governoratesList = governorates.map((governorate, index) => {
      return (
        <option value={governorate} key={index}>{governorate}</option>
      )
    })

    const { cities } = this.state
    const citiesList = cities.map((city, index) => {
      return (
        <option value={city} key={index}>{city}</option>
      )
    })

    const { areas } = this.state
    const areasList = areas.map((area, index) => {
      return (
        <option value={area} key={index}>{area}</option>
      )
    })

    const clientUpdate = document.getElementById('go-client-update')
    const childUpdate = document.getElementById('go-child-update')
    const childProfile = document.getElementById('go-child-profile')
    const clientProfile = document.getElementById('go-client-profile')
    const paymentUpdate = document.getElementById('go-payment-update')
    const clientProfileFp = document.getElementById('go-client-profile-fp')
    const vPillsHomeTab = document.getElementById('v-pills-profile-tab')
    const vPillsProfileTab = document.getElementById('v-pills-child-profile-tab')

    const goTimeTable = document.getElementById('go-time-table')
    const goMarks = document.getElementById('go-marks')

    const childprofile = document.getElementById('go-childprofile')
    const clientprofile = document.getElementById('go-clientprofile')
    if (childprofile) {
      childprofile.onclick = () => {
        vPillsProfileTab.click()
      }
    }
    if (clientprofile) {
      clientprofile.onclick = () => {
        vPillsHomeTab.click()
      }
    }

    if (goTimeTable) {
      goTimeTable.onclick = () => {
        document.getElementById('v-pills-child-profile-tab').click()
        document.getElementById('nav-time-table-tab').click()
        vPillsProfileTab.classList.add('active-plus')
      }
    }

    if (goMarks) {
      goMarks.onclick = () => {
        document.getElementById('v-pills-child-profile-tab').click()
        document.getElementById('nav-marks-tab').click()
        vPillsProfileTab.classList.add('active-plus')
      }
    }

    if (clientUpdate) {
      clientUpdate.onclick = () => {
        document.getElementById('v-pills-profile-update-tab').click()
        // document.getElementById('nav-details-tab-update').click()
        vPillsHomeTab.classList.add('active-plus')
      }
    }

    if (childUpdate) {
      childUpdate.onclick = () => {
        document.getElementById('v-pills-child-update-tab').click()
        // document.getElementById('nav-children-details-tab-update').click()
        vPillsProfileTab.classList.add('active-plus')
      }
    }

    if (childProfile) {
      childProfile.onclick = () => {
        vPillsProfileTab.click()
      }
    }

    if (clientProfile) {
      clientProfile.onclick = () => {
        vPillsHomeTab.click()
        // document.getElementById('nav-details-tab').click()
      }
    }

    if (paymentUpdate) {
      paymentUpdate.onclick = () => {
        document.getElementById('v-pills-profile-update-tab').click()
        // document.getElementById('nav-payment-tab-update').click()
        vPillsHomeTab.classList.add('active-plus')
      }
    }

    if (clientProfileFp) {
      clientProfileFp.onclick = () => {
        vPillsHomeTab.click()
        // document.getElementById('nav-payment-tab').click()
      }
    }

    if (vPillsHomeTab) {
      vPillsHomeTab.onclick = () => {
        vPillsProfileTab.classList.remove('active-plus')
        // document.getElementById('nav-details-tab').click()
      }
    }

    if (vPillsProfileTab) {
      vPillsProfileTab.onclick = () => {
        vPillsHomeTab.classList.remove('active-plus')
      }
    }

    let gearContainer = document.querySelector('.slide-menu .gear-container')
    const navDetails = document.getElementById('nav-details')
    const vPillsSettings = document.getElementById('v-pills-profile-update')
    const vPillsMessages = document.getElementById('v-pills-child-update')
    const vPillsProfile = document.getElementById('v-pills-child-profile')
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

    if (vPillsMessages) {
      vPillsMessages.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    if (vPillsProfile) {
      vPillsProfile.onclick = () => {
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

    const columns = [
      {
        field: 'name',
        headerName: 'Course',
        width: 300,
        hideable: false
      },
      {
        field: 'scored_mark',
        headerName: 'Scored Mark',
        width: 300,
        editable: false,
        hideable: false
      },
      {
        field: 'full_mark',
        headerName: 'Full Mark',
        width: 300,
        editable: false,
        hideable: false
      },
    ];

    if (this.state.childMarks != null) {
      var rows = [...this.state.childMarks];
    } else {
      var rows = []
    }

    console.log(this.state.token);

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
                <img className='wh' src={this.state.childPhoto ?? '../../imgs/all/male_avatar.svg'}/>
              </div>
              <h2 className='line'>
                {this.state.childName ? this.state.childName : '-'}
              </h2>
              <button className="profile-hover button">
                <Link to='/client-dashboard'>My Dashboard</Link>
              </button>
              <button className="nav-link active button" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile"
                type="button" role="tab" aria-controls="v-pills-profile" aria-selected="true">
                My Profile
              </button>
              <button className="nav-link button" id="v-pills-child-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-child-profile"
                type="button" role="tab" aria-controls="v-pills-child-profile" aria-selected="false">
                Child Info
              </button>
              <button className="nav-link display-none button" id="v-pills-child-update-tab" data-bs-toggle="pill" data-bs-target="#v-pills-child-update"
                type="button" role="tab" aria-controls="v-pills-child-update" aria-selected="false">
                Messages
              </button>
              <button className="nav-link display-none button" id="v-pills-profile-update-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile-update"
                type="button" role="tab" aria-controls="v-pills-profile-update" aria-selected="false">
                Settings
              </button>
              <button className="profile-hover button">
                <Link to='/client-add-child'>Add Child</Link>
              </button>
              <button className="profile-hover button">
                <Link to='/client-reservations'>All Reservations</Link>
              </button>
              <button className="profile-hover button">
                <Link to='/client-subscriptions'>All subscription</Link>
              </button>
            </div>
          </div>

          <div className="profile-content">
            
            <ClientNavbar />

              <Fragment>
                <div className="profile-nav-menu">
                  <p>
                    <Link to="/">Home</Link> / <Link to="/client-profile">My Profile</Link>
                  </p>
                </div>
                <div className="container tabs-container update">
                  <div className="align-items-start">
                    <div className="tab-content update" id="v-pills-tabContent">
                      <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                        {/* <nav>
                          <div className="nav nav-tabs nav-buttons" id="nav-tab" role="tablist">
                            <button className="nav-link nav-button active button" id="nav-details-tab" data-bs-toggle="tab" data-bs-target="#nav-details"
                              type="button" role="tab" aria-controls="nav-details" aria-selected="true">My Details</button>
                            <button className="nav-link nav-button button" id="nav-payment-tab" data-bs-toggle="tab" data-bs-target="#nav-payment"
                              type="button" role="tab" aria-controls="nav-payment" aria-selected="false">Payment Info</button>
                          </div>
                        </nav> */}
                        <div className="tab-content tabs-content update" id="nav-tabContent">
                          <div className="tab-pane fade show active" 
                            id="nav-details" role="tabpanel" 
                            aria-labelledby="nav-details-tab">
                            <div className="tab-content-header">
                              <p>My Details</p>
                              <span><img src="../imgs/all/edit.svg" alt="" id="go-client-update" /></span>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Full Name</p>
                                <p className="details-value">
                                  {this.state.parentName ? this.state.parentName : 'Update Your Name'}
                                </p>
                              </div>
                            </div>
                            {/* <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Profile Picture</p>
                                <div  className='details-value'><img src="../imgs/all/profile picture.svg" className='' alt="" /></div>
                              </div>
                            </div> */}
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Email Address</p>
                                <p className="details-value">
                                  {this.state.theEmail ? this.state.theEmail : 'Update Your Email'}
                                </p>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Gender</p>
                                <p className="details-value">
                                  {this.state.parentGender ? this.state.parentGender : 'Update Your Gender'}
                                </p>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Mobile Number</p>
                                <p className="details-value">
                                  {this.state.thePhone ? this.state.thePhone : 'Update Your Phone'}
                                </p>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Governorate</p>
                                <p className="details-value">
                                  {this.state.parentGovernorate ? this.state.parentGovernorate : 'Update Your Governorate'}
                                </p>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">City</p>
                                <p className="details-value">
                                  {this.state.parentCity ? this.state.parentCity : 'Update Your City'}
                                </p>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Area</p>
                                <p className="details-value">
                                  {this.state.parentArea ? this.state.parentArea : 'Update Your Area'}
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* <div className="tab-pane fade"
                            id="nav-payment" role="tabpanel"
                            aria-labelledby="nav-payment-tab">
                            <div className="tab-content-header">
                              <p>Payment Info</p>
                              <img src="../imgs/all/edit.svg" alt="" id="go-payment-update" />
                            </div>
                          </div> */}
                        </div>
                      </div>

                      <div className="tab-pane fade" id="v-pills-child-profile"
                        role="tabpanel" aria-labelledby="v-pills-child-profile-tab">
                        {
                          (this.state.children.length) ? 
                          <Fragment>
                            <nav>
                              <div className="nav nav-tabs nav-buttons mb-4" id="nav-tab" role="tablist">
                                <button className="nav-link nav-button button active" id="nav-children-details-tab" data-bs-toggle="tab" data-bs-target="#nav-children-details"
                                  type="button" role="tab" aria-controls="nav-children-details" aria-selected="true">Children Details</button>
                                <button className="nav-link nav-button button" id="nav-time-table-tab" data-bs-toggle="tab" data-bs-target="#nav-time-table"
                                  type="button" role="tab" aria-controls="nav-time-table" aria-selected="false">Time Table</button>
                                
                                <button className="nav-link nav-button button" id="nav-marks-tab" data-bs-toggle="tab" data-bs-target="#nav-marks"
                                  type="button" role="tab" aria-controls="nav-marks" aria-selected="false">Marks</button>
                              </div>
                            </nav>
                            
                            <div className="tab-content tabs-content update" id="nav-tabContent">
                              <div className="tab-pane fade show active" 
                                id="nav-children-details" role="tabpanel" 
                                aria-labelledby="nav-children-details-tab">
                                <div className="tab-content-header">
                                  <p>Child Information</p>
                                  <span>
                                    <img src="../imgs/all/edit.svg" alt="" id="go-child-update" />
                                  </span>
                                </div>
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Choose A Child</p>
                                    <div className='details-value'>
                                      <select className="options choose-child p-8"
                                        onChange={this.handleChildChange} defaultValue={childId}>
                                        {childrenList}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Full Name</p>
                                    <p className="details-value">
                                      {childName ? childName: 'Update Child Name'}
                                    </p>
                                  </div>
                                </div>
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Profile Picture</p>
                                    <div className='details-value'><img src = {this.state.childPhoto} className="uploaded-image" alt="" /></div>
                                  </div>
                                </div>
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Age</p>
                                    <p className="details-value">
                                      {this.state.childAge ? this.state.childAge: 'Update Child Age'}
                                    </p>
                                  </div>
                                </div>
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Gender</p>
                                    <p className="details-value">
                                      {this.state.childGender ? this.state.childGender: 'Boy'}
                                    </p>
                                  </div>
                                </div>
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Status</p>
                                    <p className="details-value status">
                                      {this.state.childStatus ? <span>{this.state.childStatus}</span>: 'Inactive'}
                                    </p>
                                  </div>
                                </div>
                                </div>

                                <div className="tab-pane fade show home-table timeline-table" id="nav-time-table" role="tabpanel" aria-labelledby="nav-time-table-tab">
                                  <p className="table-title">Time Table</p>
                                  <div className="details-info">
                                    {
                                      this.state.childTimetable != null ? 
                                      Object.keys(this.state.childTimetable).map((key, index) => {
                                        return (
                                          <Fragment>
                                          <Accordion expanded={this.state.expanded === key} onChange={this.handleAcordionChange(key)} in={true}>
                                            <AccordionSummary aria-controls={`${key}-content`}
                                              id={`${key}-header`}>
                                              <Typography>{key.toUpperCase()}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                              {this.state.childTimetable[key].map((period, index1) => {
                                              return (
                                                <Typography>
                                                  {period['subject']} <span>from</span> {period['from']} <span>to</span> {period['to']}
                                                </Typography>
                                              )})}
                                            </AccordionDetails>
                                          </Accordion>
                                        </Fragment>
                                        )
                                      })
                                      : <div>There is no timetable yet</div>
                                    }
                                  </div>
                                </div>

                                <div className="tab-pane fade show" id="nav-marks" role="tabpanel" aria-labelledby="nav-marks-tab">
                                  <h5 className="table-title">Marks</h5>
                                  <Box sx={{ minHeight: 150, width: '100%' }}>
                                    <DataGrid
                                      rows={rows}
                                      columns={columns}
                                      pageSize={7}
                                      rowsPerPageOptions={[7]}
                                      disableSelectionOnClick
                                      autoHeight
                                    />
                                  </Box>
                                </div>
                            </div>
                          </Fragment>
                            :
                            <div className="tab-content tabs-content update" id="nav-tabContent">
                              <div className='tab-content-header'><p>Add A Child First</p></div>
                            </div>
                        }
                      </div>

                      <div className="tab-pane fade" id="v-pills-child-update"
                        role="tabpanel" aria-labelledby="v-pills-child-update-tab">
                        {
                          (this.state.children !== []) ? 
                          <Fragment>
                            {/* <nav>
                              <div className="nav nav-tabs nav-buttons mb-4" id="nav-tab" role="tablist">
                                <button className="nav-link nav-button button active" id="nav-children-details-tab-update" data-bs-toggle="tab" data-bs-target="#nav-children-details-update"
                                  type="button" role="tab" aria-controls="nav-children-details-update" aria-selected="true">Children Details</button>
                              </div>
                            </nav> */}
                            <div className="tab-content tabs-content update" id="nav-tabContent">
                              <div className="container tab-pane fade show active"
                                id="nav-children-update" role="tabpanel"
                                aria-labelledby="nav-children-tab-update">
                                <div className="tab-content-header">
                                  <p>Update Child Information</p>
                                  <div className="update-actions">
                                    <span onClick={this.handleUpdateChild} id="go-child-profile" className='pointer'>Update</span>
                                    <img src="../imgs/all/exit.svg" alt="" onClick={this.handleUpdateCancelation} id="go-childprofile"/>
                                  </div>
                                </div>
                                {/* <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Choose A Child</p>
                                    <div className='details-value'>
                                      <select className="options choose-child p-8"
                                        onChange={this.handleChildChange} defaultValue={childId}>
                                        {childrenList}
                                      </select>
                                    </div>
                                  </div>
                                </div> */}
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Full Name</p>
                                    <p className="details-value">
                                      <input type="text" placeholder="John Due" id='childName' onChange={this.handleChange} value={childName}/>
                                    </p>
                                  </div>
                                </div>
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Profile Picture</p>
                                    <div id="update-img" className="details-value">
                                      <span>
                                        <img className="special-img uploaded-image" src={this.state.childPhoto} alt="" />
                                      </span>
                                      <input type="file" className="input-class" id="actual-btn-child" accept="image/*" onChange={this.handleFileChild} />
                                      <label className="label-class client-profile" htmlFor="actual-btn-child">Upload</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Age</p>
                                    <p className="details-value">
                                      <input className="age" type="text" placeholder="7" id='childAge' onChange={this.handleChange} value={this.state.childAge}/>
                                    </p>
                                  </div>
                                </div>
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Gender</p>
                                    <p className="details-value">
                                      {this.state.childGender ? this.state.childGender: 'Boy'}
                                    </p>
                                  </div>
                                </div>
                              
                                <div className="details-info">
                                  <div className="details-info-content">
                                    <p className="details-type">Status</p>
                                    <p className="details-value status">
                                      <span>
                                        {this.state.childStatus ? this.state.childStatus : 'Unactive'}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                </div>
                            </div>
                          </Fragment>
                            :
                            <div className="tab-content tabs-content update" id="nav-tabContent">
                              <div className='tab-content-header'><p>Add A Child First</p></div>
                            </div>
                        }
                      </div>

                      <div className="tab-pane fade" id="v-pills-profile-update"
                        role="tabpanel" aria-labelledby="v-pills-profile-update-tab">
                        {/* <nav>
                          <div className="nav nav-tabs nav-buttons" id="nav-tab" role="tablist">
                            <button className="nav-link nav-button active button" id="nav-details-tab-update" data-bs-toggle="tab" data-bs-target="#nav-details-update"
                              type="button" role="tab" aria-controls="nav-details-update" aria-selected="true">
                              My Details
                            </button>
                            <button className="nav-link nav-button button" id="nav-payment-tab-update" data-bs-toggle="tab" data-bs-target="#nav-payment-update"
                              type="button" role="tab" aria-controls="nav-payment-update" aria-selected="false">
                              Payment Info
                            </button>
                          </div>
                        </nav> */}
                        <div className="tab-content tabs-content update" id="nav-tabContent">
                          <div className="tab-pane fade show active" id="nav-details-update" role="tabpanel" aria-labelledby="nav-details-tab">
                            <div className="tab-content-header">
                              <p>Update My Details</p>
                              <div className="update-actions">
                                <span id="go-client-profile" onClick={this.handleUpdateClient} className='pointer'>Update</span>
                                <img src="../imgs/all/exit.svg" alt="" onClick={this.handleUpdateCancelation} id='go-clientprofile' />
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Full Name</p>
                                <p className="details-value">
                                  <input type="text" placeholder="John Due" id='parentName'
                                    onChange={this.handleChange} value={this.state.parentName}/>
                                </p>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Email Address</p>
                                <p className="details-value">
                                  {this.state.parentType == 'EM' ? this.state.parentEmail : <input type="text" placeholder="Lorem@example.com" id='parentEmail' onChange={this.handleChange} value={this.state.parentEmail}/>}
                                </p>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Gender</p>
                                <p className="details-value">{ this.state.parentGender}</p>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Mobile Number</p>
                                <p className="details-value">
                                  {this.state.parentType == 'PH' ? this.state.parentPhone : <input type="text" placeholder="01234567890" id='parentPhone' onChange={this.handleChange} defaultValue='' />}
                                </p>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Governorate</p>
                                <div className='details-value'>
                                  <select className="options client-register-select"
                                    onChange={this.handleFilterChange} id='governorate'
                                    title='parentGovernorate' defaultValue={this.state.parentGovernorate}>
                                    <option value='value'>choose governorate</option>
                                    {governoratesList ? governoratesList: <option value="">Lorem ipsum</option>}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">City</p>
                                <div className='details-value'>
                                  <select className="options client-register-select"
                                    onChange={this.handleFilterChange} id='city' title='parentCity' defaultValue={this.state.parentCity}>
                                    <option value='value'>choose city</option>
                                    {citiesList ? citiesList : <option value="">Lorem ipsum</option>}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="details-info">
                              <div className="details-info-content">
                                <p className="details-type">Area</p>
                                <div className='details-value'>
                                  <select className="options client-register-select"
                                    onChange={this.handleFilterChange} id='area' title='parentArea' defaultValue={this.state.parentArea}>
                                    <option value='value'>choose area</option>
                                    {areasList ? areasList : <option value="">Lorem ipsum</option>}
                                  </select>
                                </div>
                              </div>
                            </div>
                            {/* <div className="details-info">
                              <div className="details-info-content adding-child">
                                <button className='add-child' onClick={this.handleUpdateClient}>Save</button>
                              </div>
                            </div> */}
                          </div>

                          {/* <div className="tab-pane fade" id="nav-payment-update"
                            role="tabpanel" aria-labelledby="nav-payment-tab">
                            <div className="tab-content-header">
                              <p>Update My Payment Info</p>
                              <img src="../imgs/all/exit.svg" alt="" id="go-client-profile-fp" />
                            </div>
                          </div> */}
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

function mapStateToProps({ infoReducer, loginReducer, childReducer }) {
  return {
    governorates: infoReducer.governorates,
    token: loginReducer.token,
    childName: childReducer.childName,
    childId: childReducer.childId,
  }
}

export default connect(mapStateToProps)(ClientProfile)