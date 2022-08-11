import React, { Component, Fragment } from 'react'

import './ReservationReq.css'

import Header from "../Header/Header"
import Footer from "../Footer/Footer"

import UpdatedPopup from '../UpdatedPpopup/UpdatedPopup'
import Popup from '../popup/Popup'

import { Link, Navigate } from 'react-router-dom'

import axios from 'axios'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'

import { apiUrlProviderCancelReservation, apiUrlProviderShowReservation } from '../../api'

class ReservationReq extends Component {

  state = {
    id: 1,
    clientId: '',
    childId: '',
    nurseryId: '',
    childName: '',
    childAge: '',
    childGender: '',
    nurseryName: '',
    reservationStatus: '',
    reservationType: '',
    reservationPrice: '',
    reservationStartDate: '',
    courses: [],
    activities: [],
    reservationId: '',
    loader: true,
    token: '',
    isOpen: false,
    isOpen2: false,
    txt: ''
  }

  componentDidMount() {
    axios.get(apiUrlProviderShowReservation + this.props.reservationId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      console.log(res.data);
      this.setState({
        id: res.data.data.id,
        clientId: res.data.data.client_id ?? '',
        childId: res.data.data.child_id  ?? '',
        nurseryId: res.data.data.nursery_id ?? '',
        childName: res.data.data.child.name ?? '',
        childAge: res.data.data.child.age ?? '',
        childGender: res.data.data.child.gender ?? '',
        nurseryName: res.data.data.nursery_name ?? '',
        reservationStatus: res.data.data.status ?? '',
        reservationType: res.data.data.type ?? '',
        reservationPrice: res.data.data.price ?? '',
        reservationStartDate: res.data.data.start_date ?? '',
        courses: res.data.data.courses ?? [],
        activities: res.data.data.activities ?? [],
        reservationId: this.props.reservationId,
        token: this.props.token,
        loader: false
      })
    })
    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 25000)
  }

  handleReject = () => {
    this.handleOpenPop()
  }

  handleAccept = () => {
    let info = {
      status: 'accept'
    }
    axios.put(apiUrlProviderCancelReservation + this.state.reservationId, info, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(
      this.handleOpenPop2('You accepted the reservation request')
    ).catch(err => this.handleOpenPop2(err.response.data.errors[0]))
  }

  handleOpenPop2 = (txt) => {
    this.setState({
      isOpen2: true,
      txt
    })
  }

  handleOpenPop = () => {
    this.setState({
      isOpen: true,
      txt: ''
    })
  }

  handleClosePop = () => {
    this.setState({
      isOpen: false,
      isOpen2: false,
      txt: ''
    })
  }

  render() {

    const {courses} = this.state
    const coursesList = courses.map((course) => {
      return (
        <li key={course.id}>{course.name}</li>
      )
    })

    const {activities} = this.state
    const activitiesList = activities.map((activity) => {
      return (
        <li key={activity.id}>{activity.name}</li>
      )
    })

    return (
    <Fragment>
      {!this.state.loader ?
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen2}/>
        <UpdatedPopup handleClose={this.handleClosePop} isOpen={this.state.isOpen} reservationId={this.state.reservationId}/>
        <Header />
        <div className="container">
          <div className="row gaping">
            <div className="acceptance-text">
              <p><span>{this.state.childName}</span> has a request.</p>
            </div>
            <div className="col-12 col-lg-4 col-xl-4">
              <div className="details-card">
                <div className="head">
                  <p>Child Details</p>
                </div>
                <div className="details">
                  <ul className='new-ul'>
                    <li><img src="../imgs/all/icon.svg" alt="" /><span className="details-title">Name</span></li>
                    <p className="details-description">{this.state.childName}</p>
                    <li><img src="../imgs/all/age.svg" alt="" /><span className="details-title">Age</span></li>
                    <p className="details-description">{this.state.childAge} Years</p>
                    <li><img src="../imgs/all/icon.svg" alt="" /><span className="details-title">Gender</span></li>
                    <p className="details-description">{this.state.childGender}</p>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-8 col-xl-7">
              <div className="details-card">
                <div className="head">
                  <p>Reservation Details</p>
                </div>
                <div className="details">
                  <ul className='new-ul'>
                    <li><img src="../imgs/all/home.svg" alt="" /><span className="details-title">Nursery Name</span></li>
                    <p className="details-description">{this.state.nurseryName}</p>
                    <li><img src="../imgs/all/plan.svg" alt="" /><span className="details-title">Reservation Plan</span></li>
                    <p className="details-description">{this.state.reservationType}</p>
                    <li><img src="../imgs/all/cost.svg" alt="" /><span className="details-title">Price</span></li>
                    <p className="details-description">{this.state.reservationPrice} LE</p>
                    <li><img src="../imgs/all/period.svg" alt="" /><span className="details-title">Reservation Period</span></li>
                    <p className="details-description">
                      {this.state.reservationStartDate}
                      {/* <span>-</span>29 June 2022 */}
                    </p>
                    <nav>
                      <div className="nav nav-tabs nav-buttons" id="nav-tab" role="tablist">
                        <button className="nav-link nav-button active" id="nav-courses-tab" data-bs-toggle="tab" data-bs-target="#nav-courses"
                          type="button" role="tab" aria-controls="nav-courses" aria-selected="true"><p><img src="../imgs/all/courses.svg" alt="" /><span>Courses</span></p></button>
                        <button className="nav-link nav-button" id="nav-activities-tab" data-bs-toggle="tab" data-bs-target="#nav-activities"
                          type="button" role="tab" aria-controls="nav-activities" aria-selected="false"><p><img src="../imgs/all/activities.svg" alt="" /><span>Activities</span></p></button>
                      </div>
                    </nav>
                    <div className="tab-content tabs-content new-tab-content" id="nav-tabContent">
                      <div className="tab-pane fade show active" 
                        id="nav-courses" role="tabpanel" 
                        aria-labelledby="nav-courses-tab">
                        <ul className="tabs-list">
                          {coursesList}
                        </ul>
                      </div>
                      <div className="tab-pane fade"
                        id="nav-activities" role="tabpanel"
                        aria-labelledby="nav-activities-tab">
                        <ul className="tabs-list">
                          {activitiesList}
                        </ul>
                      </div>
                    </div>
                  </ul>
                  <div className="action-buttons">
                    <button id="reject-button" onClick={this.handleReject}>Reject</button>
                    <button id="accept-button" onClick={this.handleAccept}>Accept</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </Fragment>
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

function mapStateToProps({loginReducer, reservationReqReducer}) {
  return {
    token: loginReducer.token,
    reservationId: reservationReqReducer.reservationId,
  }
}

export default connect(mapStateToProps)(ReservationReq)