import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './NewTimetable.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'

import { apiUrlProviderAddTimetable, apiUrlCoursesName } from '../../../../api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import Popup from '../../../popup/Popup'
import {BeatLoader} from 'react-spinners'
import ProviderNavbar from '../ProviderNavbar/ProviderNavbar'
import ProviderSidebar from '../ProviderSidebar/ProviderSidebar'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

class ProviderNewTimetable extends Component {

  state = {
    businessHoursList: [],
    timetableFrom: [],
    timetableTo: [],
    timetableDay: [],
    timetableSubject: [],
    timetableIndex: 0,
    timetable: [],
    timetableName: '',
    token: '',
    nurseryId: '',
    courses: [],
    loader: true,
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    axios.get(apiUrlCoursesName).then(res => {
      this.setState({
        courses: res.data.data,
        nurseryId: this.props.nurseryId,
        loader: false
      })
    })

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

  handleAddTimetable = () => {
    let timetable = {}

    const { timetableDay } = this.state
    const { timetableSubject } = this.state
    const { timetableFrom } = this.state
    const { timetableTo } = this.state

    if ((timetableDay.length == timetableSubject.length) && (timetableSubject.length == timetableFrom.length) && (timetableSubject.length == timetableTo.length)) {
      for (let i = 0; i < timetableDay.length; i++) {
        
      }
      console.log(timetable)
    } else {
      this.handleOpenPop('Some values are missing')
      return 1
    }

    // setTimeout(() => {
    //   let info = {
        
    //   }

    //   axios.post(apiUrlProviderAddTimetable, info, { headers: { Authorization: 'Bearer ' + this.state.token } })
    //     .then(
    //       this.handleOpenPop('Your added new timetable successfully')
    //     )
    //     .catch(err => this.handleOpenPop(err))
    // }, 2000)
  }

  handleBusinessHourPlus = () => {

    const array = Array.from({length: 13}, (v, i) => i)
    const selectOptions = array.map((i) => {
      return (
        <option value={ i + 7 }>{i + 7}</option>
      )
    })

    const animatedComponents = makeAnimated()
    const { courses } = this.state
    if (courses) {
      var coursesList = courses.map((course) => {
        return (
          <option value={course.name}>{course.name}</option>
        )
      })
    }

    const {timetableIndex} = this.state
    this.setState({
      timetableIndex: timetableIndex + 1
    })

    setTimeout(() => {
      const businessId = this.state.timetableIndex
      const businessHourDynamic =
        <div className='details-info-content' key={businessId}>
          <div className="details-value business-info">
            <select  defaultValue='type' onBlur={this.handleBusinessHourChangeType}
              id={`business-hour-${businessId}`} >
              <option value="type" disabled>Day</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
            </select>
            <select defaultValue='type' onBlur={this.handleBusinessHourChangeSubject}
              id={`timetable-subject-${businessId}`}>
              <option value="type" disabled>Subject</option>
              {coursesList}
            </select>
            {/* <input type="text" placeholder="10AM" onBlur={this.handleBusinessHourChangeFirst} title={businessId} id={`business-hour1-${businessId}`}/>
            <input type="text" placeholder="2PM" onBlur={this.handleBusinessHourChangeSecond} title={businessId} id={`business-hour2-${businessId}`}/> */}
            <select className='' id={`business-hour1-${businessId}`} onBlur={this.handleBusinessHourChangeFirst} title={businessId} defaultValue='7'>
              <option value='7'>Choose beginning time</option>
              {selectOptions}
            </select>
            <select className='' id={`business-hour2-${businessId}`} onBlur={this.handleBusinessHourChangeSecond} title={businessId} defaultValue='7'>
              <option value='7'>Choose end time</option>
              {selectOptions}
            </select>
          </div>
        </div>
      
      var { businessHoursList } = this.state
      businessHoursList.push(businessHourDynamic)
      setTimeout(() => {
        this.setState({
          businessHoursList: businessHoursList
        })
      }, 1000)
    }, 3000)
  }

  handleBusinessHourMinus = () => {
    const { businessHoursList } = this.state
    const { timetableIndex } = this.state
    let { timetableFrom } = this.state
    let { timetableTo } = this.state
    let { timetableDay } = this.state
    let { timetableSubject } = this.state
    timetableFrom.pop()
    timetableTo.pop()
    timetableDay.pop()
    timetableSubject.pop()
    businessHoursList.pop()
    setTimeout(() => {
      this.setState({
        businessHoursList: businessHoursList,
        timetableIndex: timetableIndex - 1,
        timetableFrom,
        timetableTo,
        timetableDay
    })
    }, 1500)
  }

  handleBusinessHourChangeType = (e) => {
    let num = e.target.id
    num = num.slice(14)
    num = parseInt(num)
    let { timetableDay } = this.state
    timetableDay.splice(num, 1, e.target.value)
    this.setState({
      timetableDay
    })
  }

  handleBusinessHourChangeSubject = (e) => {
    let num = e.target.id
    num = num.slice(18)
    num = parseInt(num)
    let { timetableSubject } = this.state
    timetableSubject.splice(num, 1, e.target.value)
    this.setState({
      timetableSubject
    })
  }

  handleBusinessHourChangeFirst = (e) => {
    let num = e.target.id
    num = num.slice(15)
    num = parseInt(num)
    let { timetableFrom } = this.state
    timetableFrom.splice(num, 1, e.target.value)
    this.setState({
      timetableFrom
    })
  }

  handleBusinessHourChangeSecond = (e) => {
    let num = e.target.id
    num = num.slice(15)
    num = parseInt(num)
    let { timetableTo } = this.state
    timetableTo.splice(num, 1, e.target.value)
    this.setState({
      timetableTo
    })
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

    const array = Array.from({length: 13}, (v, i) => i)
    const selectOptions = array.map((i) => {
      return (
        <option value={ i + 7 }>{i + 7}</option>
      )
    })

    const {businessHoursList} = this.state
    if (businessHoursList.length) {
      var businessHoursListLists = businessHoursList.map((businessHour) => {
        return (
          businessHour
        )
      })
    }

    const animatedComponents = makeAnimated()

    const { courses } = this.state
    if (courses) {
      var coursesList = courses.map((course) => {
        return (
          <option value={course.name}>{course.name}</option>
        )
      })
    }

    const path = window.location.pathname.slice(1)

    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen} />
        {!this.state.loader ? 
        <section className="profile-container">
          <ProviderSidebar path={path} />

          <div className="profile-content">
            
            <ProviderNavbar />

            <div className="profile-nav-menu">
              <p>
                <Link to="/">Home</Link> / <Link to="/provider-add-timetable">
                  New Timetable
                </Link>
              </p>
            </div>
            
            <div className="container tabs-container update">
              <div className="align-items-start">
                <div className="tab-content update" id="v-pills-tabContent">
                  <div className="tab-pane fade show active" id="v-pills-new-timetable" role="tabpanel" aria-labelledby="v-pills-new-timetable-tab">
                    <div className="tab-content update tabs-content" id="nav-tabContent">
                      <div className="tab-pane fade show active" 
                        id="nav-details" role="tabpanel" 
                        aria-labelledby="nav-details-tab">
                        <div className="tab-content-header">
                          <p>New Timetable</p>
                          <span className='pointer saving-update' onClick={this.handleAddTimetable}>
                            Add
                          </span>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">ID</p>
                            <p className="details-value">
                              {this.state.nurseryId ? this.state.nurseryId : ''}
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Name</p>
                            <div className="details-value">
                              <input type="text" placeholder="John Due" onChange={this.handleChange} id='timetableName' />
                            </div>
                          </div>
                        </div>
                        {/* <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Schedule</p>
                            <div className="schedule details-value business-info">
                              <select name="" id="">
                                <option value="">Day</option>
                              </select>
                              <select name="" id="">
                                <option value="">Subject</option>
                              </select>
                              <input type="text" placeholder="from" />
                              <input type="text" placeholder="to" />
                              <span><img src="./imgs/add.svg" alt="" /></span>
                            </div>
                            <div className="add-img">
                              <div className="add-img">
                                <img src='../../imgs/provider-dashboard/add.svg' className='pointer' alt='' onClick={this.handleBusinessHourPlus}/>
                                {this.state.businessHoursList.length ? 
                                  <div className='union pointer' onClick={this.handleBusinessHourMinus}></div> : <span></span>
                                }
                              </div>
                            </div>
                          </div>
                        </div> */}
                        <div className="details-info">
                          <div className="details-info-content d-block">
                            <p className="details-type">Timetable</p>
                            <div className="details-value business-info">
                              <select defaultValue='type' onBlur={this.handleBusinessHourChangeType} id='business-hour-0'>
                                <option value="type" disabled>Day</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                              </select>
                              <select defaultValue='type' onBlur={this.handleBusinessHourChangeSubject} id='timetable-subject-0'>
                                <option value="type" disabled>Subject</option>
                                {coursesList}
                              </select>
                              {/* <input type="text" placeholder="10AM" id='business-hour1-0' onBlur={this.handleBusinessHourChangeFirst}/>
                              <input type="text" placeholder="2PM" id='business-hour2-0' onBlur={this.handleBusinessHourChangeSecond}/> */}
                              <select className='mr-3' id='business-hour1-0' onBlur={this.handleBusinessHourChangeFirst} defaultValue='7' >
                                <option value='7'>Choose beginning time</option>
                                {selectOptions}
                              </select>
                              <select className='mr-3' id='business-hour2-0' onBlur={this.handleBusinessHourChangeSecond} defaultValue='7'>
                                <option value='7'>Choose end time</option>
                                {selectOptions}
                              </select>
                              <div className="add-img">
                                <div className="add-img d-flex">
                                  <img src='../../imgs/provider-dashboard/add.svg' className='pointer' alt='' onClick={this.handleBusinessHourPlus}/>
                                  {this.state.businessHoursList.length ? 
                                    <div className='union pointer' onClick={this.handleBusinessHourMinus}></div> : <span></span>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          {businessHoursListLists}
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
    nurseryId: providerReducer.nurseryId
  }
}

export default connect(mapStateToProps)(ProviderNewTimetable)