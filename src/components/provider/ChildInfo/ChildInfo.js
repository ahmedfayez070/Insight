import React, { Component, Fragment } from 'react'
import axios from 'axios'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'

import { apiUrlProviderChildren, apiUrlProviderTimetables, apiUrlShowProvider } from '../../../api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import Popup from '../../popup/Popup'
import ProviderNavbar from '../ProviderDashboard/ProviderNavbar/ProviderNavbar'
import {BeatLoader, FadeLoader} from 'react-spinners'

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Timetable from 'react-timetable-events'
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'

class ProviderChildInfo extends Component {

  state = {
    expanded: 'thursday',
    profilePic: '',
    nurseryId: '',
    nurseryName: '',
    timetables: [],
    children: [],
    childId: 1,
    childName: '',
    childAge: '',
    childGender: '',
    childStatus: '',
    childPhoto: null,
    childSubscriptionPlan: '',
    childTimetableId: '',
    childTimetable: {},
    marks: [],
    token: '',
    loader: true,
    btnLoader: false,
    isOpen: false,
    txt: '',
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    console.log(this.props.token);
    axios.get(apiUrlProviderChildren + '?nursery_id=' + this.props.nurseryId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        children: res.data.data.data,
        // childName: res.data.data.data.length ? res.data.data.data[0].name : '',
        // childGender: res.data.data.data.length ? res.data.data.data[0].gender : '',
        // childStatus: res.data.data.data.length ? res.data.data.data[0].status : '',
        // childSubscriptionPlan: res.data.data.data.length ? res.data.data.data[0].Subscription_id : '',
        // childAge: res.data.data.data.length ? res.data.data.data[0].age : '',
        // childPhoto: res.data.data.data.length ? res.data.data.data[0].profile_image : null,
        // childId: res.data.data.data.length ? res.data.data.data[0].id : 1,
        // childTimetableId: (res.data.data.data.length && res.data.data.data[0].timetable_id != null) ? res.data.data.data[0].timetable_id : '',
        loader: false,
        nurseryId: this.props.nurseryId,
        nurseryName: this.props.nurseryName,
        token: this.props.token
      })
    }).catch(err => console.log(err))

    axios.get(apiUrlProviderTimetables + '?nursery_id=' + this.props.nurseryId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        timetables: res.data.data.data.length ? res.data.data.data : []
      })
    }).catch(err => console.log(err))
    
    axios.get(apiUrlShowProvider, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        profilePic: res.data.data.profile_image
      })
    }).catch()

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 25000)

  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleChildChange = (e) => {
    this.setState({btnLoader: true})
    var target = parseInt(e.target.value)

    axios.get(apiUrlProviderChildren + '/' + target + '?nursery_id=' + this.props.nurseryId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      console.log(res.data.data);
      this.setState({
        childName: res.data.data.name ,
        childPhoto: res.data.data.profile_image ?? null,
        marks: res.data.data.marks ?? [],
        childGender: res.data.data.gender ,
        childStatus: res.data.data.status ,
        childSubscriptionPlan: res.data.data.Subscription_id ,
        childAge: res.data.data.age ,
        childId: res.data.data.id,
        childTimetableId: res.data.data.timetable != null ? res.data.data.timetable.id : 1,
        childTimetable: res.data.data.timetable != null ? res.data.data.timetable.timetable : null,
        btnLoader: false
      })
    }).catch(err => this.setState({btnLoader: false}))
  }

  handleCancelation = () => {
    axios.get(apiUrlProviderChildren + '/' + this.state.childId + '?nursery_id=' + this.props.nurseryId, { headers: { Authorization: 'Bearer ' + this.props.token } })
      .then(res => {
      this.setState({
        childName: res.data.data.length ? res.data.data.name : '',
        childPhoto: res.data.data.length ? res.data.data.profile_image : '',
        marks: res.data.data.length ? res.data.data.marks : [],
        events: res.data.data.timetable != null ? res.data.data.timetable.timetable : [],
        childGender: res.data.data.length ? res.data.data.gender : '',
        childStatus: res.data.data.length ? res.data.data.status : '',
        childSubscriptionPlan: res.data.data.length ? res.data.data.Subscription_id : '',
        childAge: res.data.data.length ? res.data.data.age : '',
        childId: res.data.data.length ? res.data.data.id : 1,
        childTimetableId: res.data.data.timetable != null ? res.data.data.timetable.id : 1
      })
    }).catch(err => console.log(err))
  }

  handleChangeMark = (e) => {
    let { marks } = this.state;
    marks[e.target.title] = e.target.value;
    this.setState({
      marks
    })
  }

  handleUpdateTimetable = () => {
    let info = {
      marks: this.state.marks,
      timetable_id: this.state.childTimetableId
    }
    axios.put(apiUrlProviderChildren + '/' + this.state.childId + '?nursery_id=' + this.props.nurseryId, info, { headers: { Authorization: 'Bearer ' + this.props.token } })
  }

  handleAcordionChange = (panel) => (event, newExpanded) => {
    let answer = newExpanded ? panel : false
    this.setState({expanded: answer})
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

    console.log(this.state.childName);

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

    const { nurseryId } = this.state

    const { children } = this.state
    const childrenList = children.map((child) => {
      return (
        <option value={child.id} key={child.id}>{child.name}</option>
      )
    })

    const { timetables } = this.state
    if (timetables) {
      var timetablesList = timetables.map((timetable) => {
        return (
          <option value={timetable.id} key={timetable.id}>{timetable.name}</option>
        )
      })
    }

    const { marks } = this.state
    if (marks) {
      var marksList = marks.map((mark, key) => {
        return (
          <div className="details-info" key={key}>
            <div className="details-info-content mb-3">
              <div>
                <p>{key}</p>
              </div>
              <div>
                <input type="text" placeholder="Scored Mark" value={mark} title={key} onChange={this.handleChangeMark}/>
              </div>
              {/* <div>
                <input type="text" placeholder="Full Mark"  value={mark} onChange={this.handleChangeMark}/>
              </div> */}
            </div>
          </div>
        )
      })
    }
    
    const clientUpdate = document.getElementById('go-client-update')
    const childProfile = document.getElementById('go-child-profile')
    const clientProfile = document.getElementById('go-client-profile')
    const paymentUpdate = document.getElementById('go-payment-update')
    const clientProfileFp = document.getElementById('go-client-profile-fp')
    const vPillsHomeTab = document.getElementById('v-pills-home-tab')
    const vPillsProfileTab = document.getElementById('v-pills-profile-tab')

    const goTimeTableUpdate = document.getElementById('go-time-table-update')
    const goMarksUpdate = document.getElementById('go-marks-update')

    const goTimeTable = document.getElementById('go-time-table')
    const goMarks = document.getElementById('go-marks')

    if (goTimeTableUpdate) {
      goTimeTableUpdate.onclick = () => {
        document.getElementById('v-pills-messages-tab').click()
        document.getElementById('nav-time-table-tab-update').click()
        vPillsProfileTab.classList.add('active-plus')
      }
    }

    if (goMarksUpdate) {
      goMarksUpdate.onclick = () => {
        document.getElementById('v-pills-messages-tab').click()
        document.getElementById('nav-marks-tab-update').click()
        vPillsProfileTab.classList.add('active-plus')
      }
    }

    if (goTimeTable) {
      goTimeTable.onclick = () => {
        document.getElementById('v-pills-profile-tab').click()
        document.getElementById('nav-time-table-tab').click()
        vPillsProfileTab.classList.add('active-plus')
      }
    }

    if (goMarks) {
      goMarks.onclick = () => {
        document.getElementById('v-pills-profile-tab').click()
        document.getElementById('nav-marks-tab').click()
        vPillsProfileTab.classList.add('active-plus')
      }
    }

    const gotimetable = document.getElementById('go-timetable')
    if (gotimetable) {
      gotimetable.onclick = () => {
        document.getElementById('v-pills-profile-tab').click()
        document.getElementById('nav-time-table-tab').click()
        vPillsProfileTab.classList.add('active-plus')
      }
    }
    const gomarks = document.getElementById('gomarks')
    if (gomarks) {
      gomarks.onclick = () => {
        document.getElementById('v-pills-profile-tab').click()
        document.getElementById('nav-marks-tab').click()
        vPillsProfileTab.classList.add('active-plus')
      }
    }

    // if (vPillsProfileTab) {
    //   vPillsProfileTab.onclick = () => {
    //     vPillsHomeTab.classList.remove('active-plus')
    //   }
    // }

    let gearContainer = document.querySelector('.slide-menu .gear-container')
    const navDetails = document.getElementById('nav-details')
    // const vPillsSettings = document.getElementById('v-pills-settings')
    const vPillsMessages = document.getElementById('v-pills-messages')
    const vPillsProfile = document.getElementById('v-pills-profile')
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

    // if (vPillsSettings) {
    //   vPillsSettings.onclick = () => {
    //     if ($('.slide-menu').css("left") === "0px") {
    //       $('.slide-menu').animate({left:"-200px"}, 300)
    //     }
    //   }
    // }

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
        maxWidth: 250,
        hideable: false
      },
      {
        field: 'scored_mark',
        headerName: 'Scored Mark',
        maxWidth: 250,
        editable: false,
        hideable: false
      },
      {
        field: 'full_mark',
        headerName: 'Full Mark',
        maxWidth: 250,
        editable: false,
        sortable: false,
        hideable: false
      },
      // {
      //   field: 'updated_at',
      //   headerName: 'Updated At',
      //   maxWidth: 250,
      //   editable: false,
      //   sortable: false,
      //   hideable: false
      // },
    ];

    const rows = [...this.state.marks];
    
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
                <img className='wh' src={this.state.profilePic ?? '../../imgs/all/male_avatar.svg'}/>
              </div>
              <h2 className='line'>
                {this.state.nurseryName ? this.state.nurseryName : '-'}
              </h2>
              <button className="profile-hover button">
                <Link to='/provider-dashboard'>Dashborad</Link>
              </button>
              <button className="profile-hover button">
                <Link to='/provider-nursery-profile'>Nursery profile</Link>
              </button>
              <button className="nav-link button active" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile"
                type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">
                Child Info
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
              <button className="nav-link display-none button" id="v-pills-messages-tab" data-bs-toggle="pill" data-bs-target="#v-pills-messages"
                type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">
                Messages
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

                  {/* show Child Info */}
                  <div className="tab-pane fade show active" id="v-pills-profile"
                    role="tabpanel" aria-labelledby="v-pills-profile-tab">
                    <nav>
                      <div className="nav nav-tabs nav-buttons mb-5" id="nav-tab" role="tablist">
                        <button className="nav-link nav-button button active" id="nav-personal-details-tab" data-bs-toggle="tab" data-bs-target="#nav-personal-details"
                          type="button" role="tab" aria-controls="nav-personal-details" aria-selected="true">Personal Details</button>
                        <button className="nav-link nav-button button" id="nav-time-table-tab" data-bs-toggle="tab" data-bs-target="#nav-time-table"
                          type="button" role="tab" aria-controls="nav-time-table" aria-selected="false">Time Table</button>
                        
                        <button className="nav-link nav-button button" id="nav-marks-tab" data-bs-toggle="tab" data-bs-target="#nav-marks"
                          type="button" role="tab" aria-controls="nav-marks" aria-selected="false">Marks</button>
                      </div>
                    </nav>
                    <div className="tab-content tabs-content update" id="nav-tabContent">
                      <div className="tab-pane fade show active" 
                        id="nav-personal-details" role="tabpanel" 
                        aria-labelledby="nav-personal-details-tab">
                        <div className="tab-content-header">
                          <p>Personal Details</p>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Choose A Child</p>
                            <div className='details-value'>
                              {
                                <select className="options choose-child p-8"
                                  onChange={this.handleChildChange} defaultValue='value'>
                                  <option value='value'>Choose a child</option>
                                  {childrenList ? childrenList : ''}
                                </select>
                              }
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Name</p>
                            <p className="details-value">
                              {this.state.childName ? this.state.childName : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Photo</p>
                              <div className='details-value wh'>
                                <div className='mw-90'>
                                  <img src={this.state.childPhoto ?? "../../imgs/all/child_avatar.svg"} alt="" className='wh' />
                                </div>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Age</p>
                            <p className="details-value">
                              {this.state.childAge ? this.state.childAge : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Gender</p>
                            <p className="details-value">
                              {this.state.childGender ? this.state.childGender : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Subscription Plan</p>
                            <p className="details-value">
                              {this.state.childSubscriptionPlan ? this.state.childSubscriptionPlan : '-'}
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Status</p>
                            <p className="details-value status">
                              {this.state.childStatus ? this.state.childStatus : '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="tab-pane fade"
                        id="nav-time-table" role="tabpanel"
                        aria-labelledby="nav-time-table-tab">
                        <div className="tab-content-header">
                          <p>Time Table</p>
                          <img src="../../imgs/provider-dashboard/edit.svg" alt="" id="go-time-table-update" />
                        </div>
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
                          {/* {
                            this.state.childTimetable != null ? 
                            Object.keys(this.state.childTimetable).map((key, index) => {
                              return (
                                <div key={index}>
                                  {key.toUpperCase()} : &nbsp;
                                  {this.state.childTimetable[key].map((period, index1) => {
                                    return ( <p>
                                        {period['subject']} <span>from</span> {period['from']} <span>to</span> {period['to']}
                                      </p>
                                  )})}
                                </div>
                              )
                            }) : <div>There is no timetable yet</div>
                          } */}
                        </div>
                      </div>

                      <div className="tab-pane fade"
                        id="nav-marks" role="tabpanel"
                        aria-labelledby="nav-marks-tab">
                        <div className="tab-content-header">
                          <p>Marks</p>
                          {/* <img src="../../imgs/provider-dashboard/edit.svg" alt="" id="go-marks-update" /> */}
                          <div className='d-flex justify-content-end'>
                            <div className="all-archive archive mr" id="go-marks-update">
                              <img src="../../imgs/all/update.svg" alt="" />
                              <span>Update Marks</span>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
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
                    </div>
                  </div>

                  {/* Update Child Info */}
                  <div className="tab-pane fade" id="v-pills-messages"
                    role="tabpanel" aria-labelledby="v-pills-messages-tab">
                    <nav>
                      <div className="nav nav-tabs nav-buttons mb-5" id="nav-tab" role="tablist">
                        {/* <button className="nav-link nav-button button active" id="nav-personal-details-tab-update" data-bs-toggle="tab" data-bs-target="#nav-personal-details-update"
                          type="button" role="tab" aria-controls="nav-personal-details-update" aria-selected="true">Personal Details</button> */}
                        <button className="nav-link nav-button button" id="nav-time-table-tab-update" data-bs-toggle="tab" data-bs-target="#nav-time-table-update"
                          type="button" role="tab" aria-controls="nav-time-table-update" aria-selected="false">Time Table</button>
                        
                        <button className="nav-link nav-button button" id="nav-marks-tab-update" data-bs-toggle="tab" data-bs-target="#nav-marks-update"
                          type="button" role="tab" aria-controls="nav-marks-update" aria-selected="false">Marks</button>
                      </div>
                    </nav>

                    <div className="tab-content tabs-content update" id="nav-tabContent">
                      <div className="tab-pane fade show active"
                        id="nav-time-table-update" role="tabpanel"
                        aria-labelledby="nav-time-table-tab-update">
                        <div className="tab-content-header">
                          <p>Time Table</p>
                          <div className='update-actions'>
                            <span className='pointer' id="go-time-table"  onClick={this.handleUpdateTimetable}>Update</span>
                            <img src="../../imgs/provider-dashboard/exit.svg" alt="" id="go-timetable" onClick={this.handleCancelation}/>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">ID</p>
                            <p className="details-value">
                              {this.state.childTimetableId ? this.state.childTimetableId : ''}
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <div>
                              <p className="">Name
                              </p>
                            </div>
                            <div>
                              <select className='choose-child p-8' name="" id="childTimetableId" defaultValue='value' onChange={this.handleChange}>
                                <option value="value">Timetable Name</option>
                                {timetablesList}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="tab-pane fade"
                        id="nav-marks-update" role="tabpanel"
                        aria-labelledby="nav-marks-tab-update">
                        <div className="tab-content-header">
                          <p>Marks</p>
                          <div className='update-actions'>
                            <span className='pointer' id="go-marks" onClick={this.handleUpdateMarks}>Update</span>
                            <img src="../../imgs/provider-dashboard/exit.svg" alt="" id="gomarks" onClick={this.handleCancelation}/>
                          </div>
                        </div>
                        {/* <div className="details-info">
                          <div className="details-info-content mb-3">
                            <div>
                              <p>Course Name</p>
                            </div>
                            <div>
                              <input type="text" placeholder="Scored Mark" />
                            </div>
                            <div>
                              <input type="text" placeholder="Full Mark" />
                            </div>
                          </div>
                        </div> */}
                        {marksList}
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
        </div>
        }
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

export default connect(mapStateToProps)(ProviderChildInfo)