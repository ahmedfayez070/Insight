import React, { Component, Fragment } from 'react'

import axios from 'axios'

import './ClientDashboard.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlViewChildren, apiUrlClientCancelReservation, apiUrlClientDashboard } from '../../../api'

import $ from 'jquery'

import ClientNavbar from '../ClientNavbar/ClientNavbar'
import ClientSideBar from '../ClientSideBar/ClientSideBar'
import Popup from '../../popup/Popup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { BeatLoader, FadeLoader } from 'react-spinners'

class ClientDashboard extends Component {

  state = {
    client: [],
    children: [],
    parentName: '',
    childId: '1',
    childName: '',
    childPhoto: '',
    childAge: '',
    childGender: '',
    childStatus: '',
    nurseryId: '',
    nurseryName: '',
    reservationType: '',
    startDate: '',
    createdAt: '',
    price: '',
    providerResponse: '',
    reservation: [],
    subscription: [],
    timeTable: [],
    childrenIds: [],
    childrenNames: [],
    governorates: [],
    cities: [],
    areas: [],
    token: '',
    theEmail: '',
    thePhone: '',
    isOpen: false,
    txt: '',
    btnLoader: false,
    loader: true
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.childId != undefined && this.props.childId != '') {
      axios.get(apiUrlClientDashboard + this.props.childId, { headers: { Authorization: 'Bearer ' + this.props.token } })
      .then(res => {
        this.setState({
          childName: this.props.childName,
          childId: this.props.childId,
          nurseryName: res.data.data.nursery_name,
          reservation: res.data.data.reservation,
          subscription: res.data.data.subscription,
          timeTable: res.data.data.timetable,

          startDate: res.data.data.reservation != null ? res.data.data.reservation.start_date : '',

          createdAt: res.data.data.reservation != null ? res.data.data.reservation.created_at : '',
        
          price: res.data.data.reservation != null ? res.data.data.reservation.price : '',
        
          reservationType: res.data.data.reservation != null ? res.data.data.reservation.plan : '',
        
          childStatus: res.data.data.reservation != null ? res.data.data.reservation.status : '',
        
          token: this.props.token
        })
    }).catch(err => null)
    } else {
        axios.get(apiUrlClientDashboard + this.state.childId, { headers: { Authorization: 'Bearer ' + this.props.token } })
        .then(res => {
          this.setState({
            childName: res.data.data.child_name,
            childId: res.data.data.child_id,
            nurseryName: res.data.data.nursery_name,
            reservation: res.data.data.reservation,
            subscription: res.data.data.subscription,
            timeTable: res.data.data.timetable,

            startDate: res.data.data.reservation != null ? res.data.data.reservation.start_date : '',

            createdAt: res.data.data.reservation != null ? res.data.data.reservation.created_at : '',
          
            price: res.data.data.reservation != null ? res.data.data.reservation.price : '',
          
            reservationType: res.data.data.reservation != null ? res.data.data.reservation.plan : '',
          
            childStatus: res.data.data.reservation != null ? res.data.data.reservation.status : '',
          
            token: this.props.token
          })
      }).catch(err => null)
    }
    
    axios.get(apiUrlViewChildren, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        children: res.data.children ? res.data.children : [],
        loader: false
      })
      res.data.children == null && this.handleOpenPop('Add a child first')
    }).catch(err => null)

    setTimeout(() => {
      this.setState({
        loader: false
      })
      const action = {
        type: 'CHANGE_CHILD_ID_NAME',
        data: [this.state.childId, this.state.childName]
      }

      const { dispatch } = this.props;
      dispatch(action)
    }, 25000)
  }

  handleChildChange = (e) => {
    this.setState({btnLoader: true})
    var target = e.target.value

    this.changeChildId(target)
  }

  changeChildId = async (target) => {
    try {
      const response = await axios.get(apiUrlClientDashboard + target, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(res =>
        this.setState({
          childId: res.data.data.child_id,
          childName: res.data.data.child_name,
          nurseryName: res.data.data.nursery_name,
          reservation: res.data.data.reservation,
          subscription: res.data.data.subscription,
          timeTable: res.data.data.timetable,

          startDate: res.data.data.reservation != null ? res.data.data.reservation.start_date : '',

          createdAt: res.data.data.reservation != null ? res.data.data.reservation.created_at : '',
          
          price: res.data.data.reservation != null ? res.data.data.reservation.price : '',
          
          reservationType: res.data.data.reservation != null ? res.data.data.reservation.plan : '',
          
          childStatus: res.data.data.reservation != null ? res.data.data.reservation.status : '',
          btnLoader: false
        })
      )
    } catch {
      this.setState({btnLoader: false})
      this.handleOpenPop('This child does not have a reservation')
      this.setState({
        childId: '',
        childName: '',
        nurseryName: '',
        reservation: [],
        subscription: [],
        timeTable: [],
      })
    }

    setTimeout(() => {
      const action = {
        type: 'CHANGE_CHILD_ID_NAME',
        data: [this.state.childId, this.state.childName]
      }

      const { dispatch } = this.props;
      dispatch(action)
    }, 1000)
  }

  handleReservationCancelation = (id) => {
    this.setState({btnLoader: true})
    axios.post(apiUrlClientCancelReservation + '/' + id, { client_end: 1, _method: 'put' }, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(
        this.handleOpenPop('Your cancellation is done'),
        this.setState({
          childId: '',
          childName: '',
          nurseryName: '',
          reservation: [],
          subscription: [],
          timeTable: [],
          startDate: '',
          createdAt: '',
          price: '',
          reservationType: '',
          childStatus: '',
          btnLoader: false,
        })
      ).catch(err => this.setState({btnLoader: false}));
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

    const { children } = this.state
    const childrenList = children.map((child) => {
      return (
        <option value={child.id} key={child.id}>{child.name}</option>
      )
    })

    const { childId, parentName, childName, reservationType, childStatus, nurseryName, startDate, createdAt, price, timeTable } = this.state

    if (timeTable != null) {
      var timeTableList = timeTable.map((table) => {
      return (
        <div className="table-row update">
          <div className="cell">{table.from} - {table.to}</div>
          <div className="cell">{table.subject}</div>
        </div>
      )
    })
    }

    let gearContainer = document.querySelector('.slide-menu .gear-container')
    const navDetails = document.getElementById('nav-details')
    const searchAction = document.querySelector('div.search-action')

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

    if (searchAction) {
      searchAction.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    const path = window.location.pathname.slice(1)

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
          <ClientSideBar path={path} />

          <div className="profile-content">
            
            <ClientNavbar />
            <div className="container tabs-container update">
            <div className="align-items-start">
              <div className="tab-content" id="v-pills-tabContent">
                <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                  <div className="tab-content tabs-content" id="nav-tabContent">
                    <div className="tab-pane fade show active"
                      id="v-pills-provider-profile" role="tabpanel"
                      aria-labelledby="v-pills-provider-profile-tab">
                        <div className="search-action" >
                          <select className="options choose-child"
                            onChange={this.handleChildChange} defaultValue={childId}>
                            {childrenList.length ? childrenList : <option value='1' disabled>Add a child</option>}
                          </select>
                          <div>
                            <span><img src="../../imgs/all/add.svg" alt="" /></span>
                            <Link to='/client-add-child'>Add Child</Link>
                          </div>
                        </div>
                        <div className="tab-content tabs-content" id="nav-tabContent">
                          <div className="tab-pane fade show active" 
                            id="nav-details" role="tabpanel" 
                            aria-labelledby="nav-details-tab">
                          <div className="row ">
                            <div className="col-3">
                              <div className="card home-cards">
                                <div>
                                  <p>Nursery Name</p>
                                  <p>{this.state.nurseryName ? this.state.nurseryName : '-'}</p>
                                </div>
                                <div><img src="../../imgs/all/nursery name.svg" alt="" /></div>
                              </div>
                            </div>
                            <div className="col-3">
                              <div className="card home-cards">
                                <div>
                                  <p>Subscriptions Amount</p>
                                  <p>
                                    {this.state.subscription != null ? this.state.subscription.amount : '-'}
                                  </p>
                                </div>
                                <div><img src="../../imgs/all/subscription amount.svg" alt="" /></div>
                              </div>
                            </div>
                            <div className="col-3">
                              <div className="card home-cards">
                                <div>
                                  <p>Payment Date</p>
                                  <p>
                                    {this.state.subscription != null ? this.state.subscription.payment_date : '-'}
                                  </p>
                                </div>
                                <div><img src="../../imgs/all/date.svg" alt="" /></div>
                              </div>
                            </div>
                            <div className="col-3">
                              <div className="card home-cards">
                                <div>
                                  <p>Due Date</p>
                                  <p>
                                    {this.state.subscription != null ? this.state.subscription.due_date : '-'}
                                  </p>
                                </div>
                                <div><img src="../../imgs/all/date.svg" alt="" /></div>
                              </div>
                            </div>
                          </div>

                          <div className="row tables">
                            <div className="col-5">
                              <div className="details-card">
                                <div className="head">
                                  <p>Reservation</p>
                                </div>
                                <div className="details">
                                  <ul>
                                    <li>
                                      <img src="../../imgs/all/id.svg" alt="" />Id <span className="details-title">{childId}</span>
                                    </li>
                                    <li>
                                      <img src="../../imgs/all/name.svg" alt="" />Name <span className="details-title">{childName}</span>
                                    </li>
                                    <li>
                                      <img src="../../imgs/all/nursery-name.svg" alt="" />Nursery Name <span className="details-title">{nurseryName}</span>
                                    </li>
                                    <li>
                                      <img src="../../imgs/all/status.svg" alt="" />Status
                                      {childStatus == 'pending' ?
                                      <span className="details-title status pending">
                                        {childStatus}
                                      </span>
                                        : null}
                                      {childStatus == 'accept' ?
                                      <span className="details-title status accepted">
                                        {childStatus}
                                      </span>
                                        : null}
                                      {childStatus == 'reject' ?
                                      <span className="details-title status rejected">
                                        {childStatus}
                                      </span>
                                        : null}
                                      {childStatus == 'subscripted' ?
                                      <span className="details-title status done">
                                        {childStatus}
                                      </span>
                                        : null}
                                      
                                    </li>
                                    <li>
                                      <img src="../../imgs/all/dates.svg" alt="" />Created At <span className="details-title">{createdAt}</span>
                                    </li>
                                    <li>
                                      <img src="../../imgs/all/plan.svg" alt="" />Plan <span className="details-title">{reservationType ? reservationType : '-'}</span>
                                    </li>
                                    <li>
                                      <img src="../../imgs/all/dates.svg" alt="" />Start Date <span className="details-title">{startDate ? startDate : '-'}</span>
                                    </li>
                                    <li>
                                      <img src="../../imgs/all/price.svg" alt="" />Price <span className="details-title">{price}</span>
                                    </li>
                                    {this.state.childStatus == 'pending' ? <button className="cancel-reservation" onClick={() => this.handleReservationCancelation(this.state.childId)}>Cancel Reservation </button> : 
                                    <button className="cancel-reservation button-white">
                                      <Link to='/client-reservations'>Show Reservation</Link>
                                    </button>
                                    }
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-7 home-table update timeline-table">
                              <p className="table-title">Today’s Timeline</p>
                              <div>
                                <div className="table-row update">
                                  <div className="cell">Period</div>
                                  <div className="cell">Course</div>
                                </div>
                                {timeTableList ? timeTableList :
                                <div className='mt-5 text-center'>There is no time table yet</div>}
                            </div>
                            </div>
                          </div>
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
        </div>
        }
      </Fragment>
    )
  }
}

function mapStateToProps({ loginReducer, childReducer }) {
  return {
    token: loginReducer.token,
    childName: childReducer.childName,
    childId: childReducer.childId
  }
}

export default connect(mapStateToProps)(ClientDashboard)