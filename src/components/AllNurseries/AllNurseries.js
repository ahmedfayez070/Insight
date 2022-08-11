import React, { Fragment } from 'react'
import axios from 'axios'
import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'

import StarRatings from 'react-star-ratings';
import $ from 'jquery'

import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Popup from '../popup/Popup'

import MultiRangeSlider from "../multiRangeSlider/MultiRangeSlider";
import '../../App.css'
import './AllNurseries.css'
import './AllNurseriesMedia.css'

import { apiUrlNurseries, apiUrlLocation, apiUrlCoursesName, apiUrlActivitiesName } from '../../api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import { BeatLoader } from 'react-spinners'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

class AllNurseries extends React.Component {

  state = {
    nurseries: [],
    links: [],
    nurseryName: '',
    minAge: '',
    maxAge: '',
    maxCount: '9',
    city: '',
    governorate: '',
    total: '0',
    numberOfPages: '',
    previousPageUrl: '',
    currentPageUrl: '',
    nextPageUrl: '',
    previousPage: '',
    index: 0,
    nurseryId: 0,
    type: '',
    minPrice: '',
    maxPrice: '',
    courses: [],
    course: '',
    activities: [],
    activity: '',
    redirect: false,
    governorates: [],
    cities: [],
    areas: [],
    rating: 0,
    rate: '',
    sortAttribute: 'name',
    sortType: 'ASC',
    messageForNone: 'No Data For Now',
    responseStatus: '',
    isOpen: false,
    txt: '',
    loader: true,
    errors: []
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const allApi = apiUrlNurseries + '?filter_age_min=' + this.state.minAge + '&filter_age_max=' + this.state.maxAge + '&max_count=' + this.state.maxCount + '&filter_name=' + this.state.nurseryName + '&filter_governorate=' + this.state.governorate + '&sort_attribute=' + this.state.sortAttribute + '&sort_type=' + this.state.sortType

    axios.get(allApi).then(res => {
      this.setState({
        nurseries: res.data.data.data,
        links: res.data.data.pagination.links,
        total: res.data.data.pagination.total,
        numberOfPages: res.data.data.pagination.numberOfPages,
        previousPageUrl: res.data.data.pagination.previousPageUrl,
        currentPageUrl: res.data.data.pagination.currentPageUrl,
        nextPageUrl: res.data.data.pagination.nextPageUrl,
        responseStatus: res.data.data.status,
      })
    }).catch(err => console.log(err))

    axios.get(apiUrlLocation).then(res => {
      this.setState({
        governorates: res.data.data
      })
    }).catch(err => this.handleOpenPop(err))

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 15000)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleChangeType = (e) => {
    this.setState({
      [e.target.title] : e.target.value
    })
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
      axios.get(apiUrlNurseries + '?filter_age_min=' + this.state.minAge + '&filter_age_max=' + this.state.maxAge + '&filter_city=' + this.state.city + '&max_count=' + this.state.maxCount + '&filter_name=' + this.state.nurseryName + '&filter_governorate=' + this.state.governorate + '&sort_attribute=' + this.state.sortAttribute + '&sort_type=' + this.state.sortType + '&filter_rate=' + this.state.rate)
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
    this.setState({ rate: this.state.rating })
    setTimeout(() => {
      axios.get(apiUrlNurseries + '?filter_age_min=' + this.state.minAge + '&filter_age_max=' + this.state.maxAge + '&filter_city=' + this.state.city + '&max_count=' + this.state.maxCount + '&filter_name=' + this.state.nurseryName + '&filter_governorate=' + this.state.governorate + '&sort_attribute=' + this.state.sortAttribute + '&sort_type=' + this.state.sortType + '&filter_rate=' + this.state.rate)
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
      axios.get(this.state.links[i] + '&filter_age_min=' + this.state.minAge + '&filter_age_max=' + this.state.maxAge + '&filter_city=' + this.state.city + '&max_count=' + this.state.maxCount + '&filter_name=' + this.state.nurseryName + '&filter_governorate=' + this.state.governorate + '&sort_attribute=' + this.state.sortAttribute + '&sort_type=' + this.state.sortType + '&filter_course=' + this.state.course + '&filter_activity=' + this.state.activity).then(res => {
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

  saveIdNurseryInfo = (nurseryId) => {
    this.setState({ nurseryId, redirect: true } , () => {
      
      const action1 = {
        type: 'CHANGE_NURSERY_ID',
        data: nurseryId
      }

      const { dispatch } = this.props;
      dispatch(action1)
    })
  }

  sendGetRequest = async () => {
    try {
      const resp = await axios.get('https://jsonplaceholder.typicode.com/posts');
    } catch (err) {
      this.handleOpenPop(err);
    }
  }

  handleSortChange = (e) => {
    this.setState({
      [e.target.title]: e.target.value
    })

    setTimeout(() => {
      this.handleSubmit(e)
    }, 500)
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
      return <Navigate to="/nursery-info"></Navigate>
    }

    if (this.state.nurseries.length) {
      const { nurseries } = this.state
      var nurseriesList = nurseries.map((nursery) => {
        return (
          <div className="card col-md-3" key={nursery.id} onClick={() => this.saveIdNurseryInfo(nursery.id)}>
            {/* <img src="../imgs/browse-nurseries-imgs/test.jpg" className="card-img-top" alt="..." /> */}
            <img src="../imgs/all/Nursery.svg" className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">
                {nursery.name ? nursery.name : this.state.messageForNone}
              </h5>
              <ul>
                <li className="location">
                  <span>
                    <img className="icon" src="../imgs/browse-nurseries-imgs/location.svg" alt="" />
                  </span>
                  <Fragment>
                    { (nursery.location && nursery.location.governorate) ? <div>{nursery.location.governorate}</div> : <div>{this.state.messageForNone}</div>}
                  </Fragment>
                </li>
                <li className="time">
                  <span><img className="icon" src="../imgs/browse-nurseries-imgs/age.svg" alt="" /></span>
                  <Fragment>
                    { (nursery.age && nursery.age.max > 0) ? <div>From {nursery.age.min} to  {nursery.age.max} </div>  : <div>{this.state.messageForNone}</div>}
                  </Fragment>
                </li>
                <li className='price'>
                  <span><img className="icon" src="../imgs/courses/cost.svg" alt="" /></span>
                  <Fragment>
                    {nursery.pricing ? <div>daily : {nursery.pricing.daily} , monthly : {nursery.pricing.monthly} </div>  : <div>{this.state.messageForNone}</div>}
                  </Fragment>
                </li>
              </ul>
              <div className="stars-container">
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
          <option value={governorate} key={index}>{governorate}</option>
        )
      })
    }

    if (this.state.cities.length) {
      const { cities } = this.state
      var citiesList = cities.map((city, index) => {
        return (
          <option value={city} key={index}>{city}</option>
        )
      })
    }

    if (this.state.areas.length) {
      const { areas } = this.state
      var areasList = areas.map((area, index) => {
        return (
          <option value={area} key={index}>{area}</option>
        )
      })
    }

    // if (this.state.courses.length) {
    //   const { courses } = this.state
    //   var coursesList = courses.map((course, index) => {
    //     return (
    //       <option value={course} key={index}>{course}</option>
    //     )
    //   })
    // }

    // if (this.state.activities.length) {
    //   const { activities } = this.state
    //   var activitiesList = activities.map((activity, index) => {
    //     return (
    //       <option value={activity} key={index}>{activity}</option>
    //     )
    //   })
    // }

    const array = Array.from({length: this.state.numberOfPages}, (v, i) => i)
    const paginatonBullets = array.map((i) => {
      return (
        <li onClick={() => this.handlePagination(i)} key={i + 1} title={i + 1} id={i}
        className={(i == 0 ? 'active' : '')}>
          <span className="num">{i + 1}</span>
        </li>
      )
    })
    
    let searchBarItems = document.querySelectorAll('.search .search-bar .search-bar-item')
    let boxChildren = document.querySelectorAll('.box .box-child')
    let navMenu = document.querySelector('.nav-menu')
    let content = document.querySelector('.container .content.nurseries-place')
    let gearContainer = document.querySelector('.slide-menu .gear-container')
    let filterMenuLi = document.querySelectorAll('.filter-menu ul li')
    searchBarItems.forEach((e) => {
      e.onclick = (ev) => {
        var that
        var target = ev.target
        if (ev.target.tagName.toLowerCase() !== 'div') {
          if ($(target).parent().hasClass('search-bar-item')) {
            that = ev.target.parentElement
          } else {
            that = ev.target.parentElement.parentElement
          }
        } else {
          that = ev.target
        }
        boxChildren.forEach((eve) => {
          if (eve.getAttribute('data-input') !== that.id) {
            $(eve).slideUp(300)
          } else {
            $(eve).slideToggle(300)
          }
        })
      }
    })

    // Close boxes and filterMenu when clicking on navMenu
    if (navMenu) {
      navMenu.onclick = () => {
        boxChildren.forEach((eve) => {
          $(eve).slideUp(300)
        })
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    // Close boxes and filterMenu when clicking on content
    if (content) {
      content.onclick = () => {
        boxChildren.forEach((eve) => {
          $(eve).slideUp(300)
        })
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    // if (boxChildren) {
    //   boxChildren.forEach((e) => {
    //     e.onmouseover = () => {
    //       document.querySelector('.search .search-bar').style.backgroundColor = '#f2a88d'
    //     }
    //     e.onmouseout = () => {
    //       document.querySelector('.search .search-bar').style.backgroundColor = '#ffdabd'
    //     }
    //   })
    // }
    
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
              if (that.nextElementSibling === eve) {
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
                {/* <MultiRangeSlider
                  min={0}
                  max={20}
                  onChange={({ min, max }) => null}
                /> */}
                <input className="mb-2 mt-2 filter-input" type="text" placeholder="Age Minimum" onChange={this.handleChange}
                id='minAge'/>
                <input className='mt-2 filter-input' type="text" placeholder="Age Maximum" onChange={this.handleChange}
                id='maxAge'/>
              </div>
              {/* <li className="games"><a>Activities</a></li>
              <div className="content">
                <select onChange={this.handleChange}
                  id='activities' defaultValue='value'>
                  <option disabled value='value'>choose activity</option>
                  {governoratesList ? governoratesList : ''}
                </select>
              </div>
              <li className="courses"><a>Courses</a></li>
              <div className="content">
                <select onChange={this.handleChange}
                  id='courses' defaultValue='value'>
                  <option disabled value='value'>choose course</option>
                  {governoratesList ? governoratesList : ''}
                </select>
              </div> */}
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
                {/* <MultiRangeSlider
                  min={0}
                  max={1000}
                  onChange={({ min, max }) => null}
                /> */}
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
              <Link to="/">Home</Link> / <Link to="/nurseries">Nurseries</Link>
            </p>
          </div>

          <section className="search">
            <div className="container">
              <div className="search-bar">
                <div className="search-bar-item" id="search-name">
                  <span className="item-title">Find Nursery</span>
                  <div className="item-icon">
                    <img src="../imgs/browse-nurseries-imgs/home.svg" alt="" />
                    <span>Nursery</span>
                  </div>
                </div>

                <div className="search-bar-item" id="search-location">
                  <span className="item-title">Choose Governorate</span>
                  <div className="item-icon">
                    <img src="../imgs/browse-nurseries-imgs/location.svg" alt="" />
                    <span>Governorate</span>
                  </div>
                </div>

                <div className="search-bar-item" id="search-city">
                  <span className="item-title">Choose City</span>
                  <div className="item-icon">
                    <img src="../imgs/browse-nurseries-imgs/location.svg" alt="" />
                    <span>City</span>
                  </div>
                </div>

                <div className="search-bar-item" id="search-age">
                  <span className="item-title">Choose Age</span>
                  <div className="item-icon">
                    <img src="../imgs/browse-nurseries-imgs/type.svg" alt="" />
                    <span>Age</span>
                  </div>
                </div>
          
                <div className="search-bar-item" id="search-type">
                  <span className="item-title">Choose Type</span>
                  <div className="item-icon">
                    <img src="../imgs/browse-nurseries-imgs/type.svg" alt="" />
                    <span>Type</span>
                  </div>
                </div>

                <div className="search-bar-item item-search" onClick={this.handleSubmit}>
                  <img src="../imgs/browse-nurseries-imgs/search.svg" alt="" />
                  <span className="search-button">SEARCH</span>
                </div>
              </div>
            </div>
          </section>

          <div className="box">
            <div className="box-name search-name-input box-child" data-input="search-name">
              <input type="text" placeholder="Enter Nursery Name" onChange={this.handleChange}
              id='nurseryName'/>
            </div>
            <div className="box-location search-location-input box-child" data-input="search-location">
              <input type="text" placeholder="Choose Governorate" onChange={this.handleChange}
              id='governorate'/>
              <div className="content">
                <select onChange={this.handleFilterChange} title='governorate' defaultValue='value'>
                  <option disabled value='value'>choose governorate</option>
                  {governoratesList ? governoratesList : ''}
                </select>
              </div>
            </div>
            <div className="box-city search-city-input box-child" data-input="search-city">
              <input type="text" placeholder="Choose City" onChange={this.handleChange}
              id='city'/>
              <div className="content">
                <select onChange={this.handleFilterChange} title='city' defaultValue='value'>
                  <option disabled value='value'>choose city</option>
                  {citiesList ? citiesList : ''}
                </select>
              </div>
            </div>
            <div className="box-age search-age-input box-child" data-input="search-age">
              <input className="mb-3" type="text" placeholder="Age Minimum" onChange={this.handleChange}
              id='minAge'/>
              <input type="text" placeholder="Age Maximum" onChange={this.handleChange}
              id='maxAge'/>
            </div>
            <div className="box-type search-type-input box-child" data-input="search-type">
              <div className="content">
                <select className="mb-3"  onChange={this.handleChangeType}
                  title='type' defaultValue='value'>
                  <option disabled value='value'>choose price type</option>
                  <option value='daily'>Daily</option>
                  <option value='monthly'>Monthly</option>
                </select>
                  <div>
                    <input className="mb-3"  type="text" placeholder="Price Minimum" onChange={this.handleChange}
                    id='minPrice'/>
                    <input type="text" placeholder="Price Maximum" onChange={this.handleChange}
                    id='maxPrice'/>
                  </div>
              </div>
            </div>
          </div>

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
                    <select onChange={this.handleFilterChange}
                      title='governorate' defaultValue='value'>
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
                    {/* <MultiRangeSlider
                      min={0}
                      max={20}
                      onChange={({ min, max }) => null}
                    /> */}
                    <input className="mb-2 mt-2 filter-input" type="text" placeholder="Age Minimum" onChange={this.handleChange}
                    id='minAge'/>
                    <input className='mt-2 filter-input' type="text" placeholder="Age Maximum" onChange={this.handleChange}
                    id='maxAge'/>
                  </div>
                  {/* <li className="games"><a>Activities</a></li>
                  <div className="content">
                    <select onChange={this.handleChange}
                      id='activity' defaultValue='value'>
                      <option disabled value='value'>choose activity</option>
                      {activitiesList ? activitiesList : ''}
                    </select>
                  </div>
                  <li className="courses"><a>Courses</a></li>
                  <div className="content">
                    <select onChange={this.handleChange}
                      id='course' defaultValue='value'>
                      <option disabled value='value'>choose course</option>
                      {coursesList ? coursesList : ''}
                    </select>
                  </div> */}
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
                    {/* <MultiRangeSlider
                      min={0}
                      max={1000}
                      onChange={({ min, max }) => null}
                    /> */}
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
                  <p className="all-nurseries">
                    All Nurseries
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
                  <div className="row nursery">
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
                {paginatonBullets}
                <li onClick={() => this.handlePagination((this.state.index + 1))} id='aaa'>
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
    nurseryId: reducer.nurseryId,
    governorates: infoReducer.governorates
  }
}

export default connect(mapStateToProps)(AllNurseries)