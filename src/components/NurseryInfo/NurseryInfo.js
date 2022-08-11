import React, { Component, Fragment } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import $ from 'jquery'

import { apiUrlNurseries, apiUrlViewChildren, apiUrlClientReqReservation, apiUrlReviews, apiUrlViewChild } from '../../api'

import StarRatings from 'react-star-ratings';
import './NurseyInfo.css'
import { connect } from 'react-redux'

import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Popup from '../popup/Popup'

import { BeatLoader, FadeLoader } from 'react-spinners'

class NurseryInfo extends Component {

  state = {
    courseId: 1,
    nursery: {},
    id: 0,
    name: '',
    about: '',
    location: [],
    activeHours: {},
    status: '',
    rate: {},
    pricing: {},
    socialLinks: [],
    age: {},
    profileImage: '',
    courses: [],
    activities: [],
    childId: 1,
    childName: '',
    planDate: '',
    rating: 0,
    rate: '',
    nurseryRate: {},
    children: [],
    messageForNone: 'No data to show',
    token: '',
    subscriptionPlanMoney: '',
    coursePageRedirect: false,
    reviews: [],
    isOpen: false,
    errors: [],
    txt: '',
    loader: true,
    btnLoader: false,
    type: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlNurseries + '/' + this.props.nurseryId + '?view=true').then(res => {
      console.log(res.data.data.profile_image);
      this.setState({
        nursery: res.data.data ?? [],
        id: res.data.data.id ?? '',
        name: res.data.data.name ?? '',
        about: res.data.data.about ?? '',
        location: res.data.data.location ?? [],
        activeHours: res.data.data.active_hours ?? {},
        nurseryRate: res.data.data.rate ?? {},
        pricing: res.data.data.pricing ?? {},
        socialLinks: res.data.data.social_links ?? null,
        age: res.data.data.age ?? null,
        profileImage: res.data.data.profile_image ?? '',
        courses: res.data.data.courses ?? [],
        activities: res.data.data.activities ?? [],
        token: this.props.token,
        type: this.props.type,
      })
    }).catch(err => console.log(err))

    if (this.props.token && this.props.type == 'client') {
      axios.get(apiUrlViewChildren, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
        console.log(res.data.children);
        this.setState({
          children: res.data.children,
          loader: false
        })
        if (res.data.children != null) {
          this.setState({
            childId: res.data.children[0].id,
            childName: res.data.children[0].name
          })
        }
      }).catch(err => console.log(err))
    }

    axios.get(apiUrlReviews + '?model_type=nursery&model_id=' + this.props.nurseryId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        reviews: res.data.reviews ?? []
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

  handleChildChange = (e) => {
    const target = parseInt(e.target.value)
    axios.get(apiUrlViewChild + target, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        childId: res.data.child.id,
        childName: res.data.child.name
      })
    })
  }

  handleSubscriptionPlan = (e) => {
    const targetValue = e.target.value
    this.setState({
      subscriptionPlanMoney: targetValue
    })
  }

  handleReservation = () => {
    this.setState({btnLoader: true})
    let type = this.state.subscriptionPlanMoney == 'daily' ? 1 :  0
    const info = {
      nursery_id: this.state.id,
      child_id: this.state.childId,
      type,
      reservation_start_date: this.state.planDate
    }
    axios.post(apiUrlClientReqReservation, info, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(res => {
      this.setState({btnLoader: false})
      res.data.errors ? this.handleOpenPop(res.data.errors) : this.handleOpenPop(res.data.message)
      }).catch(err => {
        this.setState({btnLoader: false})
        this.handleOpenPop(err.response.data.errors[0])
    })
  }

  handleRedirectCourse = (id, name) => {
    const action2 = {
      type: 'CHANGE_COURSE_ID',
      data: [id, name]
    }

    const action = {
      type: 'CHANGE_NURSERY_COURSE_ID',
      data: [this.state.id, id]
    }

    const { dispatch } = this.props;
    dispatch(action, action2)


    setTimeout(() => {
      this.setState({
        coursePageRedirect: true
      })
    }, 500)
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

  changeRating = ( newRating, name ) => {
    this.setState({
      rating: newRating
    });
  }

  render() {

    console.log(this.state.activeHours);
    console.log(this.props.token);
    console.log(this.state.token);

    const { reviews } = this.state
    const reviewsList = reviews.map((review) => {
      return (
        <li>
          <div className="customer-card">
            <span className="customer-img"><img src="../imgs/nursery-info/Avatar.svg" alt="" /> &nbsp;{review.client_fullname}</span>
            <div className="customer-rate">
              <StarRatings
                rating={review.rate != null ? review.rate : 0}
                starRatedColor="#00818f"
                numberOfStars={5}
                name='rating'
                starDimension="25px"
                starSpacing="3px"
              />
            </div>
          </div>
          <p className="verified-review">Verified Review</p>
          <p>{review.content}</p>
        </li>
      )
    })

    const {coursePageRedirect} = this.state;
    if (coursePageRedirect) {
      return <Navigate to="/course-info"></Navigate>
    }

    const { children } = this.state
    if (children.length) {
      var childrenList = children.map((child) => {
        return (
          <option value={child.id} key={child.id}>{child.name}</option>
        )
      })
    }

    const { childId } = this.state
    if (this.state.pricing) {
      if(this.state.pricing.daily != null){var {dailyPlan} = this.state.pricing.daily}
      if(this.state.pricing.monthly != null){var {monthlyPlan} = this.state.pricing.monthly}
    }

    if (this.state.name) {
      var {name} = this.state
    }

    if (this.state.location) {
      var {location} = this.state
    }

    if (this.state.age) {
      var {age} = this.state
    }

    if (this.state.activeHours) {
      var {activeHours} = this.state
    }

    const {nurseryRate, pricing} = this.state

    const { subscriptionPlanMoney } = this.state
    
    const { courses } = this.state
    const coursesList = courses.map((course) => {
      return (
        <span key={course.id} onClick={() => this.handleRedirectCourse(course.id, course.name)} className='pointer'>{course.name}</span>
      )
    })
    
    const { activities } = this.state
    const activitiesList = activities.map((activity) => {
      return (
        <span key={activity.id}>{activity.name}</span>
      )
    })

    return (
      <Fragment>
        {!this.state.loader ?
        <Fragment>
            <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen} />
            {this.state.btnLoader ?
              <div className='d-flex justify-content-center align-items-center min-vh-100 loader'>
                <FadeLoader
                  color={'#00818F'}
                />
              </div> : null
            }
          <Header />
          <Fragment>
            <div className="nav-menu">
              <p>
                <Link to="/">Home</Link> /&nbsp;
                <Link to="/nurseries">Nurseries</Link> /&nbsp;
                <Link to="/nursery-info">Nursery Info</Link>
              </p>
            </div>

            <div className="container all-nursery-info">
              <div className="row">
                <div className="col-12 col-lg-8">
                  <div className="info-card">
                    <div id="imageSlider" className="carousel slide" data-ride="carousel">
                      <div className="carousel-inner">
                        <div className="carousel-item active">
                          <img className="d-block wh" src='../imgs/all/Nursery.svg' alt="First image" />
                        </div>
                        <div className="carousel-item">
                          <img className="d-block" src="" alt="Second image" />
                        </div>
                        <div className="carousel-item">
                          <img className="d-block" src="" alt="Third image" />
                        </div>
                      </div>
                      {/* <a className="carousel-control-prev" href="#imageSlider" role="button" data-slide="prev">
                        <img src="../imgs/nursery-info/left.svg" alt="" />
                      </a>
                      <a className="carousel-control-next" href="#imageSlider" role="button" data-slide="next">
                        <img src="../imgs/nursery-info/right.svg" alt="" />
                      </a> */}
                      <img className="react" src="../imgs/nursery-info/love.svg" alt="" />
                    </div>
                    
                    <div className="card-body">
                      <div className="nurseryn-r">
                        <h5>{ name ?? this.state.messageForNone }</h5>
                        <div className="rating">
                          <StarRatings
                            rating={nurseryRate != null ? nurseryRate.avg : 0}
                            starRatedColor="#00818f"
                            numberOfStars={5}
                            name='rating'
                            starDimension="25px"
                            starSpacing="3px"
                          />
                          &nbsp; <span className="number-of-rates">
                            {nurseryRate != null ? nurseryRate.total : this.state.messageForNone}
                          </span>
                        </div>
                      </div>
                      <h6>About</h6>
                      <p>
                        {this.state.about ?? this.state.messageForNone}
                      </p>
                      <h6>Courses</h6>
                      <div className="courses-activites">
                        <div className="container" >
                          <div className="row">
                            <div className="icons col">
                              {coursesList}
                            </div>
                          </div>
                        </div>
                      </div>
                      <h6>Activities</h6>
                      <div className="courses-activites">
                        <div className="container" >
                          <div className="row">
                            <div className="icons col">
                              {activitiesList}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rating-reviews">
                        <h6>Ratings &amp; Reviews</h6>
                        <div className="reviews">
                          <StarRatings
                            rating={nurseryRate != null ? nurseryRate.avg : 0}
                            starRatedColor="#00818f"
                            numberOfStars={5}
                            name='rating'
                            starDimension="25px"
                            starSpacing="3px"
                          />
                          &nbsp; <span className="number-of-rates">
                            {nurseryRate != null ? nurseryRate.total : this.state.messageForNone}
                          </span>
                        </div>
                      </div>

                      <div className="container customer-rating-reviews">
                        <div className="row">
                          <div className="col-4 rates-side">
                            <section>
                                <div className="rates">
                                  <StarRatings
                                    rating={5}
                                    starRatedColor="#00818f"
                                    numberOfStars={5}
                                    name='rating'
                                    starDimension="25px"
                                    starSpacing="3px"
                                  />
                                &nbsp; <span className="rates-num">
                                  {nurseryRate != null ? nurseryRate['5'] : this.state.messageForNone}
                                  </span>
                                </div>
                                <div className="rates">
                                  <StarRatings
                                    rating={4}
                                    starRatedColor="#00818f"
                                    numberOfStars={4}
                                    name='rating'
                                    starDimension="25px"
                                    starSpacing="3px"
                                  />
                                &nbsp; <span className="rates-num">
                                  {nurseryRate != null ? nurseryRate['4'] : this.state.messageForNone}
                                  </span>
                                </div>
                                <div className="rates">
                                  <StarRatings
                                    rating={3}
                                    starRatedColor="#00818f"
                                    numberOfStars={3}
                                    name='rating'
                                    starDimension="25px"
                                    starSpacing="3px"
                                  />
                                &nbsp; <span className="rates-num">
                                  {nurseryRate != null ? nurseryRate['3'] : this.state.messageForNone}
                                  </span>
                                </div>
                                <div className="rates">
                                  <StarRatings
                                    rating={2}
                                    starRatedColor="#00818f"
                                    numberOfStars={2}
                                    name='rating'
                                    starDimension="25px"
                                    starSpacing="3px"
                                  />
                                &nbsp; <span className="rates-num">
                                  {nurseryRate != null ? nurseryRate['2'] : this.state.messageForNone}
                                  </span>
                                </div>
                                <div className="rates">
                                  <StarRatings
                                    rating={1}
                                    starRatedColor="#00818f"
                                    numberOfStars={1}
                                    name='rating'
                                    starDimension="25px"
                                    starSpacing="3px"
                                  />
                                &nbsp; <span className="rates-num">
                                  {nurseryRate != null ? nurseryRate['1'] : this.state.messageForNone}
                                  </span>
                                </div>
                            </section>
                          </div>
                          <div className="col-8 customer-reviews-side">
                            <section className="opinions">
                                <ul>
                                  {reviewsList}
                                  {/* <li>
                                    <div className="customer-card">
                                      <span className="customer-img"><img src="../imgs/nursery-info/Avatar.svg" alt="" /> &nbsp;Customer Name</span>
                                      <div className="customer-rate">
                                        <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                        <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                        <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                        <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                        <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                      </div>
                                    </div>
                                    <p className="verified-review">Verified Review</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                  </li>
                                  <li>
                                    <div className="customer-card">
                                        <span className="customer-img"><img src="../imgs/nursery-info/Avatar.svg" alt="" /> &nbsp;Customer Name</span>
                                        <div className="customer-rate">
                                          <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                          <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                          <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                          <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                          <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                        </div>
                                    </div>
                                    <p className="verified-review">Verified Review</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                  </li>
                                  <li>
                                    <div className="customer-card">
                                        <span className="customer-img"><img src="../imgs/nursery-info/Avatar.svg" alt="" /> &nbsp;Customer Name</span>
                                        <div className="customer-rate">
                                          <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                          <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                          <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                          <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                          <span><img src="../imgs/nursery-info/rate.svg" alt="" /></span>
                                        </div>
                                    </div>
                                    <p className="verified-review">Verified Review</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                  </li> */}
                                </ul>
                            </section>
                          </div>
                        </div>
                      </div>
          
                      <div className="community">
                        <h6>Our Community</h6>
                        <div className="community-icons">
                          <li>
                            <a href={this.state.socialLinks != null ? this.state.socialLinks.facebook : ''} target='_blank'>
                              <img className="logos" src="../imgs/nursery-info/FB.svg" alt="" />
                            </a>
                          </li>
                          <li>
                            <a href={this.state.socialLinks != null ? this.state.socialLinks.instagram : ''} target='_blank'>
                              <img className="logos" src="../imgs/nursery-info/INS.svg" alt="" />
                            </a>
                          </li>
                          <li>
                            <a href={this.state.socialLinks != null ? this.state.socialLinks.linkedin : ''} target='_blank'>
                              <img className="logos" src="../imgs/nursery-info/LIN.svg" alt="" />
                            </a>
                          </li>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="reservasion-details">
                    <div className="head">
                      <p>Nursery Details</p>
                    </div>
                    <div className="details">
                      <ul>
                        <li><img src="../imgs/nursery-info/location.svg" alt="" />Location</li>
                        <p className="description-details">
                          {location != null ? location.governorate : this.state.messageForNone}
                        </p>
                        <li><img src="../imgs/nursery-info/age.svg" alt="" />Supported Age</li>
                        <div className="description-details">
                          {age != null ? <p>
                            Age <span>from <span className="t-d">{age != null ? age.min : this.state.messageForNone}</span> to <span className="t-d">{age != null ? age.max : this.state.messageForNone}</span></span>
                          </p> : this.state.messageForNone}
                        </div>
                        <li><img src="../imgs/nursery-info/time.svg" alt="" />Business Hours</li>
                        {activeHours != null ? <ul className="time">
                          {Object.keys(activeHours).map((key, index) => {
                            return (<li key={index}><p><span>{key}</span> from <span>{activeHours[key]['from']}</span> to <span>{activeHours[key]['to']}</span></p></li>)
                          })}
                        </ul> : <p className='description-details'>{this.state.messageForNone}</p>
                        }
                        <li><img src="../imgs/nursery-info/cost.svg" alt="" />Price</li>
                        <div className="membership grid">
                          <div className="type daily-membership g-col-6">
                            <p>Daily Membership</p>
                            {pricing != null ? 
                            <div className="cost">
                              <span className="LE">LE</span>
                              <span className="price">{pricing.daily}</span> <sub>/day</sub>
                            </div> : this.state.messageForNone}
                          </div>

                          <div className="type monthly-membership g-col-6">
                            <p>Monthly Membership</p>
                            {pricing != null ? 
                            <div className="cost">
                              <span className="LE">LE</span>
                              <span className="price">{pricing.monthly}</span><sub>/Month</sub>
                            </div> : this.state.messageForNone}
                          </div>
                        </div>
                      </ul>
                    </div>
                  </div>
                  {(this.props.token && this.props.type == 'client' ) &&
                    <div className="details-card reservation-details">
                      <div className="head">
                        <p>Reservation Details</p>
                      </div>
                      <div className="details">
                        <ul>
                          <li><img src="../imgs/all/icon.svg" alt="" />Child Details</li>
                          <div className="details-description">
                            {
                              <select className="selecting-child"
                                onChange={this.handleChildChange} defaultValue={childId}>
                                {childrenList}
                              </select>
                            }
                            <Link to='/client-add-child'>
                              <img className='selecting-child-img pointer' src="../imgs/all/add.svg" alt="" id="add" />
                            </Link>
                          </div>
                          <li><img src="../imgs/all/plan.svg" alt="" /> Reservation Plan</li>
                          <div className="details-description details-description-plan">
                            <select defaultValue='type' className='selecting-child selecting-child-plan' onChange={this.handleSubscriptionPlan}>
                              <option value="type" disabled>Select Type</option>
                              <option value="daily">daily</option>
                              <option value="monthly">monthly</option>
                            </select>
                            <div className='plan-chosen'>
                              <span className='plan-money'>
                                {subscriptionPlanMoney ? this.state.pricing[subscriptionPlanMoney] : 'value'}
                              </span>
                              <span className='plan-currency'>LE</span>
                            </div>
                          </div>
                          <input type="date" placeholder="dd/mm/yyyy" onChange={this.handleChange} id='planDate' />
                        </ul>
                        <button className="reserve-now button-green-hover" onClick={this.handleReservation}>Reserve Now</button>
                      </div>
                    </div>
                  }
                  {(this.props.token && this.props.type == 'provider') &&
                    <div className="details-card reservation-details">
                      <div className="head">
                        <p>Reservation Details</p>
                      </div>
                      <div className="details">
                        <div className='text-center'>
                          You can not reserve in a nursery
                        </div>
                        <button className="reserve-now" onClick={() => this.handleOpenPop('You need to log in first and add a child')}>Reserve Now</button>
                      </div>
                    </div>
                  }
                  { (this.props.type != 'client' && this.props.type != 'provider') &&
                    <div className="details-card reservation-details">
                      <div className="head">
                        <p>Reservation Details</p>
                      </div>
                      <div className="details">
                        <div className='text-center'>
                          You need to log in first
                        </div>
                        <button className="reserve-now" onClick={()=> this.handleOpenPop('You need to log in first and add a child')}>Reserve Now</button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </Fragment>
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

function mapStateToProps({ reducer, loginReducer, reducer: state}) {
  return {
    nurseryId: reducer.nurseryId,
    token: loginReducer.token,
    type: loginReducer.type,
    courseId: state.courseId
  }
}

export default connect(mapStateToProps)(NurseryInfo)