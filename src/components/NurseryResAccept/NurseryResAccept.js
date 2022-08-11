import React, { Component, Fragment } from 'react'

import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import UpdatedPopup from '../UpdatedPpopup/UpdatedPopup'

import Popup from '../popup/Popup'

import { Link, Navigate } from 'react-router-dom'

import axios from 'axios'
import { connect } from 'react-redux'
import { BeatLoader, FadeLoader } from 'react-spinners'

import './NurseryResAccept.css'

import { apiUrlProviderCancelReservation, apiUrlClientShowReservation, apiUrlNursery, apiUrlClientPayment } from '../../api'

class NurseryResAccept extends Component {

  state = {
    id: 1,
    clientId: '',
    childId: '',
    nurseryId: '',
    childName: '',
    childAge: '',
    childGender: '',
    nurseryName: '',
    nurseryPhone: '',
    nurseryLocation: [],
    addLocation: '',
    mapLocation: '',
    reservationStatus: '',
    reservationType: '',
    reservationPrice: '',
    reservationStartDate: '',
    courses: [],
    activities: [],
    reservationId: '',
    orderId: '',
    loader: true,
    redirect: false,
    token: '',
    btnLoader: false,
    isOpen: false,
    isOpen2: false,
    txt: ''
  }

  componentDidMount() {
    axios.get(apiUrlClientShowReservation + this.props.reservationId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        id: res.data.reservation.id,
        clientId: res.data.reservation.client_id ?? '',
        childId: res.data.reservation.child_id  ?? '',
        nurseryId: res.data.reservation.nursery_id ?? '',
        nurseryName: res.data.reservation.nursery_name ?? '',
        childName: res.data.reservation.child.name ?? '',
        childAge: res.data.reservation.child.age ?? '',
        childGender: res.data.reservation.child.gender ?? '',
        reservationStatus: res.data.reservation.status ?? '',
        reservationType: res.data.reservation.type ?? '',
        reservationPrice: res.data.reservation.price ?? '',
        reservationStartDate: res.data.reservation.reservation_start_date ?? '',
        orderId: res.data.reservation.order_id ?? '',
        reservationId: this.props.reservationId,
        token: this.props.token
      })
      axios.get(apiUrlNursery + res.data.reservation.nursery_id).then(res => {
        this.setState({
          nurseryName: res.data.data.name ?? null,
          nurseryPhone: res.data.data.phone ?? null,
          nurseryLocation: res.data.data.location ?? null,
          addLocation: res.data.data.location_details != null ? res.data.data.location_details.additional : null,
          mapLocation: res.data.data.location_details != null ? res.data.data.location_details.map_link : null,
          courses: res.data.data.courses ?? [],
          activities: res.data.data.activities ?? [],
          loader: false
        })
      })
    })
    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 25000)
  }

  handlePay = () => {
    this.setState({btnLoader: true})
    axios.post(apiUrlClientPayment + this.state.orderId + '/pay/redirect/0',{} , { headers: { Authorization: 'Bearer ' + this.state.token } }).then(res => {
      this.setState({ btnLoader: false });
      this.handleOpenPop('You have paid successfully')
      setTimeout(() => {
        this.setState({
          redirect: true
        })
      }, 3000)
    }).catch(err => {
      this.handleOpenPop('Error with payment')
      this.setState({btnLoader: false})
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
    
    const { redirect } = this.state
    if (redirect) {
      return(<Navigate to="/client-subscriptions"></Navigate>)
    }

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

    console.log(this.state.token);

    return (
      
      <Fragment>
        {!this.state.loader ?
        <Fragment>
          <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen2} />
          {this.state.btnLoader ?
            <div className='d-flex justify-content-center align-items-center min-vh-100 loader'>
              <FadeLoader
                color={'#00818F'}
              />
            </div> : null
          }
          <Header />
          <div className="container">
            <div className="row">
              <div className="acceptance-text">
                <p>Your request at <span>{this.state.nurseryName}</span> has been confirmed. Pay with <span>3 days</span> to guarentee your place</p>
              </div>
              <div className="col-12 col-lg-5">
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
                <div className="details-card">
                  <div className="head">
                    <p>Reservation Details</p>
                  </div>
                  <div className="details">
                    <ul className='new-ul'>
                      <li><img src="../imgs/all/plan.svg" alt="" /><span className="details-title">Reservation Plan</span></li>
                      <p className="details-description">{this.state.reservationType} Subscription</p>
                      <li><img src="../imgs/all/cost.svg" alt="" /><span className="details-title">Price</span></li>
                      <p className="details-description">{this.state.reservationPrice} LE</p>
                      <li><img src="../imgs/all/period.svg" alt="" /><span className="details-title">Reservation Start Date</span></li>
                      <p className="details-description">
                        {this.state.reservationStartDate}
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
                    <button id="pay-button" className='button-green-hover' onClick={this.handlePay}>Pay Now</button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-7">
                <div className="details-card">
                  <div className="head">
                    <p>Nursery Details</p>
                  </div>
                  <div className="details">
                    <ul className='new-ul'>
                      <li><img src="../imgs/all/home.svg" alt="" /> <span className="details-title">Name</span></li>
                      <p className="details-description">{this.state.nurseryName}</p>
                      <li><img src="../imgs/all/location.svg" alt="" /> <span className="details-title">Location</span></li>
                      <ul className='new-ul'>
                        <li>
                          <p><span className="details-description">Governorate: </span>{this.state.nurseryLocation != null ? this.state.nurseryLocation.governorate : ''}</p>
                        </li>
                        <li>
                          <p><span className="details-description">City: </span>
                          {this.state.nurseryLocation != null ? this.state.nurseryLocation.city : ''}</p>
                        </li>
                        <li>
                          <p><span className="details-description">Area: </span>
                          {this.state.nurseryLocation != null ? this.state.nurseryLocation.area : ''}</p>
                        </li>
                        <li>
                          <p><span className="details-description">Additional: </span>
                          {this.state.addLocation != null ? this.state.addLocation : ''}</p>
                        </li>
                      </ul>
                      <li>
                        <img src="../imgs/all/maps.svg" alt="" />
                        <span className="details-title">Map</span>
                      </li>
                      <a href={this.state.mapLocation != null ? this.state.mapLocation : ''} id="map-link" target='_blank'>google maps link</a>
                      <li>
                        <img src="../imgs/all/phone.svg" alt="" />
                        <span className="details-title">Phone Number</span>
                      </li>
                      <p className="details-description">{this.state.nurseryPhone ?? ''}</p>
                    </ul>
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

export default connect(mapStateToProps)(NurseryResAccept)