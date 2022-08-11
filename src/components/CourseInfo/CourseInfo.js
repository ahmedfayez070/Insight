import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import $ from 'jquery'
import { connect } from 'react-redux'

import StarRatings from 'react-star-ratings';
import './CourseInfo.css'

import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Popup from '../popup/Popup'

import { apiUrlCourse, apiUrlReviews } from '../../api'

import {BeatLoader} from 'react-spinners'

class CourseInfo extends Component {

  state = {
    id: 0,
    courseId: 0,
    nurseryId: 0,
    courseName: '',
    nurseryName: '',
    about: '',
    content: '',
    tools: '',
    courseRate: {},
    nurseryRate: {},
    age: [],
    profileImage: '',
    activeHours: {},
    socialLinks: [],
    createdAt: '',
    updatedAt: '',
    location: [],
    rating: 0,
    rate: '',
    messageForNone: 'No Data For Now',
    responseStatus: '',
    reviews: [],
    isOpen: false,
    txt: '',
    loader: true
  }

  componentDidMount() {window.scrollTo(0, 0);
    this.setState({
      courseId: this.props.courseId,
      nurseryId: this.props.nurseryId
    })
    axios.get(apiUrlCourse + '/' + this.props.courseId + '/nursery/' + this.props.nurseryId)
      .then(res => {
      this.setState({
        id: res.data.data.id,
        courseName: res.data.data.course_name,
        nurseryName: res.data.data.nursery_name,
        about: res.data.data.about,
        content: res.data.data.content,
        tools: res.data.data.tools,
        courseRate: res.data.data.course_rate,
        nurseryRate: res.data.data.nursery_rate,
        age: res.data.data.age,
        profileImage: res.data.data.profile_image,
        activeHours: res.data.data.active_hours,
        socialLinks: res.data.data.social_links,
        createdAt: res.data.data.created_at,
        updatedAt: res.data.data.updated_at,
        location: res.data.data.location,
        loader: false
      })
    }).catch(err => this.handleOpenPop('page not found'))

    axios.get(apiUrlReviews + '?model_type=nursery&model_id=' + this.props.courseId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
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

    if (this.state.courseName) {
      var {courseName} = this.state
    }

    if (this.state.nurseryName) {
      var {nurseryName} = this.state
    }

    if (this.state.about) {
      var {about} = this.state
    }

    if (this.state.content) {
      var {content} = this.state
    }

    const { tools, courseRate, nurseryRate,
      location, activeHours, age, profileImage } = this.state
    
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
    
    return (
      <Fragment>
        {!this.state.loader ?
        <Fragment>
        <Header />
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen} />
          <div className="nav-menu">
            <p>
              <Link to="/">Home</Link> /&nbsp;
              <Link to="/browse-courses">Courses</Link> /&nbsp;
              <Link to="/courses">{courseName ? courseName : this.state.messageForNone}</Link>
            </p>
          </div>

          <div className="container all-course-info">
            <div className="row">
              <div className="col-12 col-lg-8">
                <div className="info-card">
                  <div id="imageSlider" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        {/* <img className="d-block" src={this.state.profileImage ?? ''} alt="First image" /> */}
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
                    <div className="coursen-r">
                      <h5>{courseName ? courseName : this.state.messageForNone}</h5>
                      <div className="rating">
                        <StarRatings
                          rating={courseRate.avg}
                          starRatedColor="#00818f"
                          numberOfStars={5}
                          name='rating'
                          starDimension="25px"
                          starSpacing="3px"
                        />
                        &nbsp;
                        <span className="number-of-rates">
                          {/* {courseRate.avg ? courseRate.avg : 'shit'} */}
                          {courseRate ? courseRate.total : 0}
                        </span>
                      </div>
                    </div>
                    <div className="nurseryn-r">
                      <p>
                        <span id="by">by</span> &nbsp; <span id="nursery-name">{nurseryName}
                        </span>
                      </p>
                      <div className="rating">
                        <StarRatings
                          rating={nurseryRate.avg}
                          starRatedColor="#00818f"
                          numberOfStars={5}
                          name='rating'
                          starDimension="25px"
                          starSpacing="3px"
                        />
                        &nbsp;
                        <span className="number-of-rates">
                          {/* {nurseryRateTotal} */}
                          {/* {nurseryRate && nurseryRate.avg ? nurseryRate.avg : ''} */}
                          {nurseryRate ? nurseryRate.total : 0}
                        </span>
                      </div>
                    </div>
                    <h6>About</h6>
                    <p>{about ? about : this.state.messageForNone}</p>
                    <h6>Content</h6>
                    <div className="content">
                      {content ? content : this.state.messageForNone}
                    </div>
                    <h6>Tools</h6>
                    <div className="tools">
                      {tools ? tools : this.state.messageForNone}
                    </div>
                    
                    <div className="rating-reviews">
                      <h6>Ratings &amp; Reviews</h6>
                      <div className="reviews">
                        <StarRatings
                          rating={courseRate.avg}
                          starRatedColor="#00818f"
                          numberOfStars={5}
                          name='rating'
                          starDimension="25px"
                          starSpacing="3px"
                        />
                        &nbsp; <span className="number-of-rates">
                          {courseRate != null ? courseRate.total : this.state.none}
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
                                {courseRate != null ? courseRate['5'] : this.state.messageForNone}
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
                                {courseRate != null ? courseRate['4'] : this.state.messageForNone}
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
                                {courseRate != null ? courseRate['3'] : this.state.messageForNone}
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
                                {courseRate != null ? courseRate['2'] : this.state.messageForNone}
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
                                {courseRate != null ? courseRate['1'] : this.state.messageForNone}
                              </span>
                            </div>
                          </section>
                        </div>
                        <div className="col-8 customer-reviews-side" >
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
                          <a href={this.state.socialLinks != null ? this.state.socialLinks.facbook :  ''} target='_blank'>
                            <img className="logos" src="../imgs/nursery-info/FB.svg" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href={this.state.socialLinks != null ? this.state.socialLinks.instagram :  ''} target='_blank'><img className="logos" src="../imgs/nursery-info/INS.svg" alt="" />
                          </a>
                        </li>
                        <li>
                          <a href={this.state.socialLinks != null ? this.state.socialLinks.linkedin :  ''} target='_blank'><img className="logos" src="../imgs/nursery-info/LIN.svg" alt="" />
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
                    <p>Course Details</p>
                  </div>
                  <div className="details">
                    <ul>
                      <li><img src="../imgs/nursery-info/location.svg" alt="" />Location</li>
                      <p className="description-details">lorem ipsum</p>
                      <li><img src="../imgs/nursery-info/age.svg" alt="" />Supported Age</li>
                      <p className="description-details">Age <span>from <span className="t-d">4</span> to <span className="t-d">8</span></span> </p> 
                      <li><img src="../imgs/nursery-info/time.svg" alt="" />Business Hours</li>
                      <ul className="time">
                        {/* {activeHours ? 
                        Object.keys(activeHours).map((key, index) => {
                          return(<li key={key}><p><span>{key}</span> at <span>{activeHours[key]}</span></p></li>)
                        }) : this.state.messageForNone
                        } */}
                        {activeHours != null ? <ul className="time">
                        {Object.keys(activeHours).map((key, index) => {
                          return (<li key={index}><p><span>{key}</span> from <span>{activeHours[key]['from']}</span> to <span>{activeHours[key]['to']}</span></p></li>)
                          })}
                        </ul> : <p className='description-details'>{this.state.messageForNone}</p>
                        }
                      </ul>
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

function mapStateToProps({ reducer: state }) {
  return {
    nurseryId: state.nurseryId,
    courseId: state.courseId
  }
}

export default connect(mapStateToProps)(CourseInfo)