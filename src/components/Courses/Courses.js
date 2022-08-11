import React, { Component, Fragment } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'

import './Courses.css'
import StarRatings from 'react-star-ratings';

import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Popup from '../popup/Popup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery'

import { apiUrlCourse, apiUrlLocation } from '../../api'

import {BeatLoader} from 'react-spinners'

class Courses extends Component {

  state = {
    nurseries: [],
    links: [],
    courseName: '',
    nurseryName: '',
    maxCount: '9',
    rate: '',
    total: '0',
    numberOfPages: '',
    previousPageUrl: '',
    currentPageUrl: '',
    nextPageUrl: '',
    previousPage: '',
    activeHours: [],
    index: 0,
    courseId : 0,
    nurseryId: 0,
    redirect: false,
    city: '',
    governorate: '',
    governorates: [],
    cities: [],
    areas: [],
    courses: [],
    course: '',
    activities: [],
    activity: '',
    minAge: '',
    maxAge: '',
    rating: 0,
    rate: '',
    sortAttribute: 'name',
    sortType: 'ASC',
    messageForNone: 'No Data For Now',
    isOpen: false,
    txt: '',
    loader: true
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({courseId: this.props.courseId, courseName: this.props.courseName})
    const allApi = apiUrlCourse + '/' + this.props.courseId + '/nurseries'

    axios.get(allApi).then(res => {
      this.setState({
        nurseries: res.data.data.data,
        links: res.data.data.pagination.links,
        total: res.data.data.pagination.total,
        numberOfPages: res.data.data.pagination.numberOfPages,
        previousPageUrl: res.data.data.pagination.previousPageUrl,
        currentPageUrl: res.data.data.pagination.currentPageUrl,
        nextPageUrl: res.data.data.pagination.nextPageUrl,
        governorates: this.props.governorates,
        loader: false
      })
    }).catch(err => this.handleOpenPop('Page not found'))

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

  handleSortChange = (e) => {
    this.setState({
      [e.target.title]: e.target.value
    })

    setTimeout(() => {
      this.handleSubmit(e)
    }, 500)
  }

  handleReset = (e) => {
    window.scrollTo(0, 0)
    this.setState({
      governorate: '',
      city: '',
      cities: '',
      minAge: '',
      maxAge: '',
      nurseryName: '',
      rate: '',
      rating: 0
    })
    setTimeout(() => {
      axios.get(apiUrlCourse + '/' + this.state.courseId + '/nurseries' + '?filter_age_min=' + this.state.minAge + '&filter_age_max=' + this.state.maxAge + '&filter_city=' + this.state.city + '&max_count=' + this.state.maxCount + '&filter_name=' + this.state.nurseryName + '&filter_governorate=' + this.state.governorate + '&sort_attribute=' + this.state.sortAttribute + '&sort_type=' + this.state.sortType + '&filter_rate=' + this.state.rate)
      .then(res => {
      this.setState({
        nurseries: res.data.data.data,
        links: res.data.data.pagination.links,
        total: res.data.data.pagination.total,
        numberOfPages: res.data.data.pagination.numberOfPages,
        previousPageUrl: res.data.data.pagination.previousPageUrl,
        currentPageUrl: res.data.data.pagination.currentPageUrl,
        nextPageUrl: res.data.data.pagination.nextPageUrl,
      })
    }).catch(err => this.handleOpenPop(err))
    }, 500)
  }

  handleSubmit = (e) => {
    window.scrollTo(0, 0)
    e.preventDefault()
    axios.get(apiUrlCourse + '/' + this.state.courseId + '/nurseries' + '?max_count=' + this.state.maxCount + '&name=' + this.state.nurseryName + '&city=' + this.state.city + '&governorate=' + this.state.governorate + '&sort_attribute=' + this.state.sortAttribute + '&sort_type=' + this.state.sortType + '&rate=' + this.state.rate  + '&filter_age_min=' + this.state.minAge + '&filter_age_max=' + this.state.maxAge)
      .then(res => {
      this.setState({
        nurseries: res.data.data.data,
        links: res.data.data.pagination.links,
        total: res.data.data.pagination.total,
        numberOfPages: res.data.data.pagination.numberOfPages,
        previousPageUrl: res.data.data.pagination.previousPageUrl,
        currentPageUrl: res.data.data.pagination.currentPageUrl,
        nextPageUrl: res.data.data.pagination.nextPageUrl,
      })
    }).catch(err => this.handleOpenPop(err))
  }

  handlePagination = (i) => {
    window.scrollTo(0, 0);
    if (i < 0 || i >= this.state.numberOfPages) {
      return false
    } else { 
      const newIndex = i + 1
      this.setState({
        index: i,
        previousPage: '&page=' + newIndex
      })
      
      axios.get(this.state.links[i] + '&max_count=' + this.state.maxCount + '&name=' + this.state.nurseryName + '&city=' + this.state.city + '&governorate=' + this.state.governorate + '&sort_attribute=' + this.state.sortAttribute + '&sort_type=' + this.state.sortType + '&rate=' + this.state.rate).then(res => {
      this.setState({
        nurseries: res.data.data.data,
        links: res.data.data.pagination.links,
        total: res.data.data.pagination.total,
        numberOfPages: res.data.data.pagination.numberOfPages,
        previousPageUrl: res.data.data.pagination.previousPageUrl,
        currentPageUrl: res.data.data.pagination.currentPageUrl,
        nextPageUrl: res.data.data.pagination.nextPageUrl,
      })
    }).catch(err => console.log(err))
    }
  }

  saveIdCourseInfo = (nurseryId) => {
    this.setState({ nurseryId, redirect: true } , () => {
      
      const action = {
        type: 'CHANGE_NURSERY_COURSE_ID',
        data: [nurseryId, this.state.courseId]
      }

      const { dispatch } = this.props;
      dispatch(action)
    })
  }

  handleFilterChange = (e) => {
    this.setState({
      [e.target.title] : e.target.value
    })

    if (e.target.title === 'governorate') {
      this.sendGetGovernorateRequest(e)
    } else if (e.target.title === 'city') {
      this.sendGetCityRequest(e)
    }

    // this.handleSubmit(e)
  }

  sendGetGovernorateRequest = async (e) => {
    try {
      const response = await axios.get(apiUrlLocation + '?governorate=' + e.target.value)
      this.setState({
        cities: response.data.data,
        city: ''
      })
    } catch (err) {
      this.handleOpenPop(err);
    }
  }

  sendGetCityRequest = async (e) => {
    try {
      const response = await axios.get(apiUrlLocation + '?governorate=' + this.state.governorate + '&city=' + e.target.value)
      this.setState({
        areas: response.data.data
      })
    } catch (err) {
      this.handleOpenPop(err);
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

  changeRating = ( newRating, name ) => {
    this.setState({
      rating: newRating
    });
  }

  render() {

    const {redirect} = this.state;
    if (redirect) {
      return <Navigate to="/course-info"></Navigate>
    }

    var time = ''
    if (this.state.nurseries) {
      const { nurseries } = this.state
      var nurseriesList = nurseries.map((nursery) => {
        return (
          <div className="card col-md-3" key={nursery.id} onClick={() => this.saveIdCourseInfo(nursery.id)}>
            <img src="../imgs/all/Nursery.svg" className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">{nursery ? nursery.name : this.state.messageForNone}</h5>
              <ul>
                <li className='location'>
                  <span><img className="icon" src="../imgs/courses/location.svg" alt="" /></span>
                  <div>
                    { (nursery && nursery.location) ? nursery.location.governorate : this.state.messageForNone} 
                  </div>
                </li>
                <li className='time'>
                  <span><img className="icon" src="../imgs/courses/age.svg" alt="" /></span>
                  <div>
                    {/* {nursery.activeHours ? time = Object.keys(nursery.active_hours).map((key, index) => {
                    return(<div key={key}>{key} at {nursery.active_hours[key]} am</div>)
                    }) : this.state.messageForNone} */}
                    { (nursery && nursery.age.max > 0) ? 'From ' + nursery.age.min + ' to ' + nursery.age.max : this.state.messageForNone}
                  </div>
                </li>
                {/* <li className='type'>
                  <span><img className="icon" src="../imgs/courses/type.svg" alt="" /></span>
                  <div>Lorem, ipsum.</div>
                </li> */}
                <li className='price'>
                  <span>
                    <img className="icon" src="../imgs/courses/cost.svg" alt="" />
                  </span>
                  <Fragment>
                    {nursery.pricing ? <div>daily : {nursery.pricing.daily} , monthly : {nursery.pricing.monthly} </div>  : <div>{this.state.messageForNone}</div>}
                  </Fragment>
                </li>
              </ul>
              <div className="float-end">
                <StarRatings
                  rating={nursery.rate}
                  starRatedColor="#00818f"
                  numberOfStars={5}
                  name='rating'
                  starDimension="25px"
                  starSpacing="3px"
                />
              </div>
            </div>
          </div>
        )
      })
    }

    if (this.state.governorates.length) {
      const { governorates } = this.state
      var governoratesList = governorates.map((governorate, index) => {
        return (
          <option value={governorate} key={governorate}>{governorate}</option>
        )
      })
    }

    if (this.state.cities.length) {
      const { cities } = this.state
      var citiesList = cities.map((city, index) => {
        return (
          <option value={city} key={city}>{city}</option>
        )
      })
    }

    const array = Array.from({length: this.state.numberOfPages}, (v, i) => i)
    const paginatonBullets = array.map((i) => {
      return (
        <li onClick={() => this.handlePagination(i)} key={i + 1} title={i + 1} id={i}
        className={(i == 0 ? 'active' : '')}>
          <span className="num">{i + 1}</span>
        </li>
      )
    })

    let filterMenuLi = document.querySelectorAll('.filter-menu ul li')
    let navMenu = document.querySelector('.nav-menu')
    let content = document.querySelector('.container .content.nurseries-place')
    let gearContainer = document.querySelector('.slide-menu .gear-container')
    // $('.filter-menu ul div:first-of-type').slideDown()

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

    // Toggle divs in filterMenu
    if (filterMenuLi) {
      filterMenuLi.forEach((e) => {
        var that;
        e.onclick = (ev) => {
          if (ev.target.tagName.toLowerCase() === 'a') {
            that = ev.target.parentElement
          } else {
            that = ev.target
          }
          let arr = [...that.parentElement.children]
          arr.forEach((eve) => {
            if (eve.tagName.toLowerCase() === 'div') {
              if (that.nextElementSibling == eve) {
                return 0
              } else {
                $(eve).slideUp(300)
              }
            }
          })
          $(that).next().slideToggle(300)
        }
      })
    }

    // Close boxes and filterMenu when clicking on navMenu
    if (navMenu) {
      navMenu.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    // Close boxes and filterMenu when clicking on content
    if (content) {
      content.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    const firstPagination = document.getElementById('1')

    if (firstPagination) {
      firstPagination.classList.add('active')
    }

    document.querySelectorAll('.pagination-bullets .navigate li').forEach((e) => {
      if (e.id == this.state.index) {
        $(e).siblings().removeClass('active')
        e.classList.add('active')
      }
    })
    
    return (
      <Fragment>
        {!this.state.loader ?
        <Fragment>
          <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen}/>
        <Header />
        <div className="slide-menu filter-menu">
          <span className="gear-container">
            <FontAwesomeIcon icon={faGear}/>
          </span>
          <div className="filter">
            <img src="../imgs/browse-nurseries-imgs/filter.svg" alt="" />
            <p>Filter</p>
          </div>
          <ul>
            <li className="location"><a>Governorate</a></li>
            <div className="content" id="location">
              <select onChange={this.handleFilterChange} title='governorate' defaultValue='value'>
                <option value='value' disabled>choose governorate</option>
                {governoratesList ? governoratesList : ''}
              </select>
            </div>
            <li className="city"><a>City</a></li>
            <div className="content" id="city">
              <select onChange={this.handleFilterChange} title='city' defaultValue='value'>
                <option value='value' disabled>choose city</option>
                {citiesList ? citiesList : ''}
              </select>
            </div>
            <li className="age"><a>Age</a></li>
            <div id="age">
              <input className="mb-2 mt-2 filter-input" type="text" placeholder="Age Minimum" onChange={this.handleChange}
              id='minAge'/>
              <input className='mt-2 filter-input' type="text" placeholder="Age Maximum" onChange={this.handleChange}
              id='maxAge'/>
            </div>
            <li className="rating"><a>Rating</a></li>
            <div className="rating mt-2" id="rating">
              <div className='d-flex justify-content-end'>
                <StarRatings
                  rating={this.state.rating}
                  starRatedColor="#00818f"
                  changeRating={this.changeRating}
                  numberOfStars={5}
                  name='rating'
                  starDimension="25px"
                  starSpacing="3px"
                />
              </div>
            </div>
            <li className="price"><a>price</a></li>
            <div className="content" id="price">
              <select onChange={this.handleChangeType}
                title='type' defaultValue='value'>
                <option value='value' disabled>choose price type</option>
                <option value='daily'>daily</option>
                <option value='monthly'>monthly</option>
              </select>
              <input className="mb-2 mt-2 filter-input-price" type="text" placeholder="Price Minimum" onChange={this.handleChange}
              id='minPrice'/>
              <input className='mt-2 filter-input-price' type="text" placeholder="Price Maximum" onChange={this.handleChange}
              id='maxPrice'/>
            </div>
          </ul>
          <button className="reset-filters" onClick={this.handleReset}>
            <span>Reset Filters</span>
          </button>
          <button className="apply-filters" onClick={this.handleSubmit}>
            <span>Apply Filters</span>
          </button>
        </div>

        <div className="nav-menu">
          <p>
            <Link to="/">Home</Link> /&nbsp;
            <Link to="/browse-courses">Courses</Link> /&nbsp;
            <Link to="/courses">{this.state.courseName ? this.state.courseName : this.state.messageForNone}</Link>
          </p>
        </div>

        <section className="search-courses">
          <div className="container">
            <form className="search-bar-courses">
              <input className="input-text" type="text" placeholder="What are you looking for?" onChange={this.handleChange} id ='nurseryName'/>
              <button className="search-bar-item item-search" onClick={this.handleSubmit}>
                <img src="../imgs/courses/search.svg" alt="" />
                <span className="search-button">SEARCH</span>
              </button>
            </form>
          </div>
        </section>

        <div id="container" className="container">
          <div className="row">
            <div className="filter-list col-lg-3 filter-menu">
              <div className="filter">
                <img src="../imgs/browse-nurseries-imgs/filter.svg" alt="" />
                <p>Filter</p>
              </div>
              <ul>
                <li className="location"><a>Governorate</a></li>
                <div className="content" id="location">
                  <select onChange={this.handleFilterChange} title='governorate' defaultValue='value'>
                    <option disabled value='value'>choose governorate</option>
                    {governoratesList ? governoratesList : ''}
                  </select>
                </div>
                <li className="city"><a>City</a></li>
                <div className="content" id="city">
                  <select onChange={this.handleFilterChange} title='city' defaultValue='value'>
                    <option disabled value='value'>choose city</option>
                    {citiesList ? citiesList : ''}
                  </select>
                </div>
                <li className="age"><a>Age</a></li>
                <div id="age">
                  <input className="mb-2 mt-2 filter-input" type="text" placeholder="Age Minimum" onChange={this.handleChange}
                  id='minAge'/>
                  <input className='mt-2 filter-input' type="text" placeholder="Age Maximum" onChange={this.handleChange}
                  id='maxAge'/>
                </div>
                <li className="rating"><a>Rating</a></li>
                <div className="rating mt-2" id="rating">
                  <div className='d-flex justify-content-end'>
                    <StarRatings
                      rating={this.state.rating}
                      starRatedColor="#00818f"
                      changeRating={this.changeRating}
                      numberOfStars={5}
                      name='rating'
                      starDimension="25px"
                      starSpacing="3px"
                    />
                  </div>
                </div>
                <li className="price"><a>price</a></li>
                <div className="content" id="price">
                  <select onChange={this.handleChangeType}
                    title='type' defaultValue='value'>
                    <option disabled value='value'>choose price type</option>
                    <option value='daily'>daily</option>
                    <option value='monthly'>monthly</option>
                  </select>
                  <input className="mb-2 mt-2 filter-input-price" type="text" placeholder="Price Minimum" onChange={this.handleChange}
                  id='minPrice'/>
                  <input className='mt-2 filter-input-price' type="text" placeholder="Price Maximum" onChange={this.handleChange}
                  id='maxPrice'/>
                </div>
              </ul>
              <button className="reset-filters" onClick={this.handleReset}>
                <span>Reset Filters</span>
              </button>
              <button className="apply-filters" onClick={this.handleSubmit}>
                <span>Apply Filters</span>
              </button>
            </div>

            <div className="content col-lg-9 nurseries-place">
              <div>
                <p className="course-name">{this.state.courseName ? this.state.courseName : this.state.messageForNone} Courses :
                  <span className="results"> {this.state.total} {(this.state.total > 1) ? 'results' : 'result'}</span>
                </p>
                <div className="sorting d-flex mb-5">
                  <span>Sorting:</span>
                  <div className="most-relevant">
                    <select onChange={this.handleSortChange} title='sortAttribute'>
                      <option disabled>Sort Attribute</option>
                      <option value='name'>Name</option>
                      <option value='rate'>Rate</option>
                      <option value='price'>Price</option>
                      <option value='created_at'>Creation</option>
                      <option value='views'>Views</option>
                    </select>
                    <select onChange={this.handleSortChange} title='sortType'>
                      <option disabled>Sort By</option>
                      <option value='ASC'>ASC</option>
                      <option value='DESC'>DESC</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="row course">
                  {nurseriesList}
                </div>
              </div>
            </div>
          </div>
          <div className="pagination-bullets">
            <ul className="navigate">
              <li onClick={() => this.handlePagination(0)} id='a'>
                <span>
                  <img className="direction" src="../imgs/browse-nurseries-imgs/first.svg" alt="" />
                </span>
              </li>
              <li onClick={() => this.handlePagination((this.state.index - 1))} id='aa'>
                <span>
                  <img className="direction" src="../imgs/browse-nurseries-imgs/before.svg" alt="" />
                </span>
              </li>
              {paginatonBullets ? paginatonBullets : ''}
              <li onClick={() => this.handlePagination((this.state.index))} id='aaa'>
                <span>
                  <img className="direction" src="../imgs/browse-nurseries-imgs/after.svg" alt="" />
                </span>
              </li>
              <li onClick={() => this.handlePagination((this.state.numberOfPages - 1))} id='aaaa'>
                <span><img className="direction" src="../imgs/browse-nurseries-imgs/last.svg" alt=""/></span>
              </li>
            </ul>
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

function mapStateToProps({ reducer: reducer, infoReducer: infoReducer }) {
  return {
    courseId: reducer.courseId,
    courseName: reducer.courseName,
    governorates: infoReducer.governorates
  }
}

export default connect(mapStateToProps)(Courses)