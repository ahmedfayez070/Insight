import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './AddNewNursery.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'

import { apiUrlCreateNursery, apiUrlLocation, apiUrlActivitiesName, apiUrlCoursesName } from '../../../../api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

import Popup from '../../../popup/Popup'
import {BeatLoader, FadeLoader} from 'react-spinners'
import ProviderNavbar from '../ProviderNavbar/ProviderNavbar'
import ProviderSidebar from '../ProviderSidebar/ProviderSidebar'

class AddNewNursery extends Component {

  state = {
    governorates: [],
    cities: [],
    areas: [],
    nurseryGovernorate: '',
    nurseryCity: '',
    nurseryArea: '',
    nurseryName: '',
    nurseryAbout: '',
    nurseryTaxNumber: '',
    taxNumber: '',
    nurseryLicense: '',
    nurseryPhoto: '',
    nurseryPhone: '',
    nurseryCourses: [],
    nurseryActivities: [],
    addLoction: '',
    mapLocation: '',
    nurseryPhotos: '',
    minAge: '',
    maxAge: '',
    courses: [],
    activities: [],
    facebook: '',
    instgram: '',
    linkedin: '',
    subscriptionPlanList: [],
    subscriptionPlanListValues: [],
    subscriptionPlanListValuesTypes: [],
    subscriptionPlanIndex: 0,
    businessHoursList: [],
    businessHoursListValuesFirst: [],
    businessHoursListValuesSecond: [],
    businessHoursListValuesTypes: [],
    businessHoursIndex: 0,
    loader: true,
    token: '',
    redirect: false,
    btnLoader: false,
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    axios.get(apiUrlCoursesName).then(res => {
      this.setState({
        courses: res.data.data
      })
    })

    axios.get(apiUrlActivitiesName).then(res => {
      this.setState({
        activities: res.data.data,
      })
    })

    axios.get(apiUrlLocation).then(res => {
      this.setState({
        governorates: res.data.data,
      })
    })

    this.setState({
      token: this.props.token
    })

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 1000)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleChangeCourse = (nurseryCourses) => {
    this.setState({ nurseryCourses: nurseryCourses });
  }

  handleChangeActivity = (nurseryActivities) => {
    this.setState({ nurseryActivities: nurseryActivities });
  }
  
  handleFileProfile = (e) => {
    let file = e.target.files[0]
    this.setState({
      profilePhoto: file
    })
  }

  handleFileNursery = (e) => {
    let file = e.target.files[0]
    this.setState({
      nurseryPhoto: file
    })
  }

  handleNurseryLicense = (e) => {
    let file = e.target.files[0]
    this.setState({
      nurseryLicense: file
    })
  }

  buildFormData = (formData, data, parentKey) => {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
      this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
      });
    } else {
      const value = data == null ? '' : data;
    
      formData.append(parentKey, value);
    }
    return formData
  }

  handleAddNursery = () => {
    this.setState({btnLoader: true})
    let pricing = {}
    let activeHours = {}
    let courses = []
    let activities = []

    const { subscriptionPlanListValuesTypes } = this.state
    const { subscriptionPlanListValues } = this.state
    const { businessHoursListValuesTypes } = this.state
    const { businessHoursListValuesFirst } = this.state
    const { businessHoursListValuesSecond } = this.state
    const { nurseryCourses } = this.state
    const { nurseryActivities } = this.state
    
    nurseryCourses.map((course, index) => {
      courses[index] = course.id
    })
    
    nurseryActivities.map((activity, index) => {
      activities[index] = activity.id
    })

    if (subscriptionPlanListValues.length == subscriptionPlanListValuesTypes.length) {
      for (let i = 0; i < subscriptionPlanListValuesTypes.length; i++) {
        pricing[subscriptionPlanListValuesTypes[i]] = subscriptionPlanListValues[i]
      }
    } else {
      this.handleOpenPop('Some values are missing')
      return 1
    }

    if (businessHoursListValuesTypes.length == businessHoursListValuesFirst.length) {
      if (businessHoursListValuesSecond.length == businessHoursListValuesFirst.length) {
        for (let i = 0; i < businessHoursListValuesTypes.length; i++) {
          activeHours[businessHoursListValuesTypes[i]] = {
            from: businessHoursListValuesFirst[i],
            to: businessHoursListValuesSecond[i]
          }
        }
      } else {
        this.handleOpenPop('Some values are missing')
        return 1
      }
    } else {
      this.handleOpenPop('Some values are missing')
      return 1
    }

    setTimeout(() => {

      let locationDetails = {
        additional: this.state.addLoction,
        map_link: this.state.mapLocation
      }

      // let pricing = {
      //   daily: this.state.subscriptionPlanInputDaily,
      //   monthly: this.state.subscriptionPlanInputMonthly,
      // }

      let socialLinks = [
        {
          site: 'facebook',
          link: this.state.facebook
        },
        {
          site: 'instagram',
          link: this.state.instgram
        },
        {
          site: 'linkedin',
          link: this.state.linkedin
        }
      ]

      let age = {
        min: this.state.minAge,
        max: this.state.maxAge,
      }

      if (typeof this.state.profilePhoto === 'string' || this.state.profilePhoto instanceof String) {
          var file = this.state.profilePhoto.search('https') > -1 ? '' : this.state.profilePhoto
        } else {
          var file = this.state.profilePhoto
        }

        if (typeof this.state.nurseryPhoto === 'string' || this.state.nurseryPhoto instanceof String) {
          var file1 = this.state.nurseryPhoto.search('https') > -1 ? '' : this.state.nurseryPhoto
        } else {
          var file1 = this.state.nurseryPhoto
        }

        if (typeof this.state.nurseryLicense === 'string' || this.state.nurseryLicense instanceof String) {
          var file2 = this.state.nurseryLicense.search('https') > -1 ? '' : this.state.nurseryLicense
        } else {
          var file2 = this.state.nurseryLicense
        }

      let mediafile = [
        {
          mediafile: file,
          type: 'profile_image'
        },
        {
          mediafile: file1,
          type: 'nursery_pics'
        }
      ]

      var formData = new FormData()

      formData.append('name', this.state.nurseryName)
      formData.append('about', this.state.nurseryAbout)
      formData.append('tax_number', this.state.nurseryTaxNumber)
      formData.append('nursery_license', file2)
      formData.append('mediafile', mediafile)
      formData.append('governorate', this.state.nurseryGovernorate)
      formData.append('city', this.state.nurseryCity)
      formData.append('area', this.state.nurseryArea)
      formData.append('phone', '+2' + this.state.nurseryPhone)
      formData.append('courses', courses)
      formData.append('activities', activities)

      formData = this.buildFormData(formData, locationDetails, 'location_details');
      formData = this.buildFormData(formData, age, 'age');
      formData = this.buildFormData(formData, pricing, 'pricing');
      formData = this.buildFormData(formData, socialLinks, 'social_links');
      formData = this.buildFormData(formData, activeHours, 'active_hours');
      formData = this.buildFormData(formData, mediafile, 'mediafile');
      formData = this.buildFormData(formData, courses, 'courses');
      formData = this.buildFormData(formData, activities, 'activities');

      // let info = {
      //   name : this.state.nurseryName,
      //   tax_number: this.state.nurseryTaxNumber,
      //   profile_image : this.state.profile_image,
      //   phone: '+2' + this.state.nurseryPhone,
      //   pricing: pricing,
      //   active_hours: activeHours,
      //   courses: courses,
      //   activities: activities,
      //   age: {
      //     min: this.state.minAge,
      //     max: this.state.maxAge,
      //   },
      //   location_details: {
      //     additional: this.state.addLoction,
      //     map_link: this.state.mapLocation
      //   },
      //   governorate: this.state.nurseryGovernorate,
      //   city: this.state.nurseryCity,
      //   area: this.state.nurseryArea,
      //   about: this.state.nurseryAbout,
      //   socialLinks : [
      //   {
      //     site: 'facebook',
      //     link: this.state.facebook
      //   },
      //   {
      //     site: 'instagram',
      //     link: this.state.instgram
      //   },
      //   {
      //     site: 'linkedin',
      //     link: this.state.linkedin
      //   }
      //   ]
      // }

      setTimeout(() => {
        axios.post(apiUrlCreateNursery, formData, { headers: { Authorization: 'Bearer ' + this.state.token, ContentType: "multipart/form-data", type: "formData" } })
          .then(
          this.setState({btnLoader: false}),
          this.handleOpenPop('Your nursery is added successfully, please wait the admin to aprove your request'),
          setTimeout(() => {
            this.setState({ redirect: true})
          }, 3000)
        )
          .catch(err => {
            this.handleOpenPop(err.response.data.errors[0],
            this.setState({btnLoader: false}))
          })
      }, 4000)
      
    }, 4000)
  }

  handleSubscriptionPlanPlus = () => {
    const { subscriptionPlanIndex } = this.state
    this.setState({
      subscriptionPlanIndex: subscriptionPlanIndex + 1
    })
    setTimeout(() => {
      const subscriptionId = this.state.subscriptionPlanIndex
      const subscriptionPlanDynamic =
        <div className='details-info-content' key={subscriptionId}>
          <div className='details-type flex-3'></div>
          <div className='details-value phone-num flex-5'>
            <select defaultValue='type' onBlur={this.handleSubscriptionPlanTypeChange}
              id={`subscription-plan-${subscriptionId}`}>
              <option value='type' disabled>Type</option>
              <option value='daily'>Daily</option>
              <option value='monthly'>Monthly</option>
            </select>
            <input type='text' className='value' placeholder='200' title={subscriptionId}
            onBlur={this.handleSubscriptionPlanChange} id={`subscription-plans-${subscriptionId}`}/>
          </div>
        </div>
      
      var { subscriptionPlanList } = this.state
      subscriptionPlanList.push(subscriptionPlanDynamic)
      setTimeout(() => {
        this.setState({
          subscriptionPlanList: subscriptionPlanList
        })
      }, 1000)
    }, 1000)
  }

  handleSubscriptionPlanMinus = () => {
    const { subscriptionPlanList } = this.state
    const { subscriptionPlanIndex } = this.state
    let { subscriptionPlanListValues } = this.state
    let { subscriptionPlanListValuesTypes } = this.state
    subscriptionPlanListValues.pop()
    subscriptionPlanListValuesTypes.pop()
    subscriptionPlanList.pop()
    setTimeout(() => {
      this.setState({
        subscriptionPlanList: subscriptionPlanList,
        subscriptionPlanIndex: subscriptionPlanIndex - 1,
        subscriptionPlanListValues,
        subscriptionPlanListValuesTypes
    })
    }, 1500)
  }

  handleBusinessHourPlus = () => {
    const array = Array.from({length: 13}, (v, i) => i)
    const selectOptions = array.map((i) => {
      return (
        <option value={ i + 7 }>{i + 7}</option>
      )
    })

    const {businessHoursIndex} = this.state
    this.setState({
      businessHoursIndex: businessHoursIndex + 1
    })
    setTimeout(() => {
      const businessId = this.state.businessHoursIndex
      const businessHourDynamic =
        <div className='details-info-content' key={businessId}>
          <div className='details-type flex-3'></div>
          <div className="details-value business-info flex-5">
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
            {/* <input type="text" placeholder="10AM" onBlur={this.handleBusinessHourChangeFirst} title={businessId} id={`business-hour1-${businessId}`}/>
            <input type="text" placeholder="2PM" onBlur={this.handleBusinessHourChangeSecond} title={businessId} id={`business-hour2-${businessId}`}/> */}
            <select className='' id={`business-hour1-${businessId}`} onBlur={this.handleBusinessHourChangeFirst} title={businessId} defaultValue='7'>
              <option value='7'>Choose time</option>
              {selectOptions}
            </select>
            <select className='' id={`business-hour2-${businessId}`} onBlur={this.handleBusinessHourChangeSecond} title={businessId} defaultValue='7'>
              <option value='7'>Choose time</option>
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
    }, 1000)
  }

  handleBusinessHourMinus = () => {
    const { businessHoursList } = this.state
    const { businessHoursIndex } = this.state
    let { businessHoursListValuesFirst } = this.state
    let { businessHoursListValuesSecond } = this.state
    let { businessHoursListValuesTypes } = this.state
    businessHoursListValuesFirst.pop()
    businessHoursListValuesSecond.pop()
    businessHoursListValuesTypes.pop()
    businessHoursList.pop()
    setTimeout(() => {
      this.setState({
        businessHoursList: businessHoursList,
        businessHoursIndex: businessHoursIndex - 1,
        businessHoursListValuesFirst,
        businessHoursListValuesSecond,
        businessHoursListValuesTypes
    })
    }, 1500)
  }

  handleSubscriptionPlanTypeChange = (e) => {
    let num = e.target.id
    num = num.slice(18)
    num = parseInt(num)
    let { subscriptionPlanListValuesTypes } = this.state
    subscriptionPlanListValuesTypes.splice(num, 1, e.target.value)
    this.setState({
      subscriptionPlanListValuesTypes
    })
  }

  handleSubscriptionPlanChange = (e) => {
    let num = e.target.id
    num = num.slice(19)
    num = parseInt(num)
    let { subscriptionPlanListValues } = this.state
    subscriptionPlanListValues.splice(num, 1, e.target.value)
    this.setState({
      subscriptionPlanListValues
    })
  }

  handleBusinessHourChangeType = (e) => {
    let num = e.target.id
    num = num.slice(14)
    num = parseInt(num)
    let { businessHoursListValuesTypes } = this.state
    businessHoursListValuesTypes.splice(num, 1, e.target.value)
    this.setState({
      businessHoursListValuesTypes
    })
  }

  handleBusinessHourChangeFirst = (e) => {
    let num = e.target.id
    num = num.slice(15)
    num = parseInt(num)
    let { businessHoursListValuesFirst } = this.state
    businessHoursListValuesFirst.splice(num, 1, e.target.value)
    this.setState({
      businessHoursListValuesFirst
    })
  }

  handleBusinessHourChangeSecond = (e) => {
    let num = e.target.id
    num = num.slice(15)
    num = parseInt(num)
    let { businessHoursListValuesSecond } = this.state
    businessHoursListValuesSecond.splice(num, 1, e.target.value)
    this.setState({
      businessHoursListValuesSecond
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

  handleLocationChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })

    if (e.target.title === 'nurseryGovernorate') {
      this.sendGetGovernorateRequest(e)
    } else if (e.target.title === 'nurseryCity') {
      this.sendGetCityRequest(e)
    }
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
      const response = await axios.get(apiUrlLocation + '?governorate=' + this.state.nurseryGovernorate + '&city=' + e.target.value)
      this.setState({
        areas: response.data.data
      })
    } catch (err) {
    }
  }

  render() {

    const {redirect} = this.state;
    if (redirect) {
      return <Navigate to="/provider-dashboard"></Navigate>
    }

    const animatedComponents = makeAnimated();
    const {nurseryCourses} = this.state
    const {nurseryActivities} = this.state

    const { courses } = this.state
    if (courses) {
      var coursesList = courses.map((course) => {
        return (
          {value: course.id, label: course.name, id: course.id}
        )
      })
    }
    
    const { activities } = this.state
    if (activities) {
      var activitiesList = activities.map((activity) => {
        return (
          {value: activity.id, label: activity.name, id: activity.id}
        )
      })
    }

    const {subscriptionPlanList} = this.state
    if (subscriptionPlanList.length) {
      var subscriptionPlanListLists = subscriptionPlanList.map((subscriptionPlan) => {
        return (
          subscriptionPlan
        )
      })
    }

    const {businessHoursList} = this.state
    if (businessHoursList.length) {
      var businessHoursListLists = businessHoursList.map((businessHour) => {
        return (
          businessHour
        )
      })
    }

    let gearContainer = document.querySelector('.slide-menu .gear-container')
    const navDetails = document.getElementById('nav-details')
    const vPillsSettings = document.getElementById('v-pills-settings')
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

    if (ProfileNavMenu) {
      ProfileNavMenu.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    if (this.state.governorates) {
      const { governorates } = this.state
      var governoratesList = governorates.map((governorate, index) => {
        return (
          <option value={governorate} key={index}>{governorate}</option>
        )
      })
    }

    if (this.state.cities) {
      const { cities } = this.state
      var citiesList = cities.map((city, index) => {
        return (
          <option value={city} key={index}>{city}</option>
        )
      })
    }

    if (this.state.areas) {
      const { areas } = this.state
      var areasList = areas.map((area, index) => {
        return (
          <option value={area} key={index}>{area}</option>
        )
      })
    }

    const array = Array.from({length: 13}, (v, i) => i)
    const selectOptions = array.map((i) => {
      return (
        <option value={ i + 7 }>{i + 7}</option>
      )
    })

    const path = window.location.pathname.slice(1)

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
          <ProviderSidebar path={path} />

          <div className="profile-content">
            
            <ProviderNavbar />
            
            <div className="profile-nav-menu">
              <p><Link to="/">Home</Link> / <Link to="/provider-add-new-nursery">Add Nursery</Link></p>
            </div>

            <div className="container tabs-container">
              <div className="align-items-start">
                <div className="tab-content" id="v-pills-tabContent">

                  <div className="tab-pane fade show active" id="v-pills-settings"
                    role="tabpanel"
                    aria-labelledby="v-pills-settings-tab">
                    
                    <div className="tab-content tabs-content update-nursery update" id="nav-tabContent">
                      <div className="tab-pane fade show active"
                        id="nav-details-update" role="tabpanel"
                        aria-labelledby="nav-details-tab">
                        <div className="tab-content-header">
                          <p>Add New Nursery</p>
                          <div className="update-actions">
                            <span className='pointer' onClick={this.handleAddNursery}>Add</span>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type flex-3">Nursery Name</p>
                            <div className="details-value details flex-5">
                              <input type="text" placeholder="Add Nuresery Name" id='nurseryName' onChange={this.handleChange}/>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type flex-3">About</p>
                            <p className="details-value flex-5">
                              {/* <input type="text" placeholder="Put something about the nursery" id='nurseryAbout' onChange={this.handleChange} value={this.state.nurseryAbout} /> */}
                              <textarea placeholder="Put something about the nursery" id='nurseryAbout' onChange={this.handleChange} value={this.state.nurseryAbout} rows='6' cols='50'></textarea>
                            </p>
                          </div>
                        </div>
                        <div className="details-info">
                          <h5>Business Details</h5>
                          <div className="details-info-content">
                            <p className="details-type flex-3">Tax Number</p>
                            <div className="details-value details flex-5">
                              <input type="text" placeholder="Add Tax Number" id='nurseryTaxNumber' onChange={this.handleChange}/>
                            </div>
                          </div>
                          <div className="details-info-content">
                            <p className="details-type flex-3">Nursery License</p>
                            <div className="details-value details flex-5 d-flex">
                              <p>Upload Attachment From Device</p>
                              <input type="file" className="input-class" id="actual-btn-nursery-license" accept="image/*" onChange={this.handleNurseryLicense} />
                              <label className="label-class client-profile nursery-profile" htmlFor="actual-btn-nursery-license">Upload</label>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type flex-3">Profile Image</p>
                            <div className="details-value flex-5">
                              <li>
                                <img className="update-imgs" src="../../imgs/provider-dashboard/icons.svg" alt="" />
                                <input type="file" className="input-class" id="actual-btn-profile" accept="image/*" onChange={this.handleFileProfile} />
                                <label className="label-class client-profile nursery-profile" htmlFor="actual-btn-profile">Upload</label>
                              </li>
                              <li></li>
                              <li></li>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <h5>Location Details</h5>
                          <div className="details-info-content">
                            <p className="details-type flex-3">Governorate</p>
                            <p className="details-value flex-5">
                              <select className="options select-50"
                                onChange={this.handleLocationChange} id='nurseryGovernorate'
                                title='nurseryGovernorate' defaultValue='value'>
                                <option value='value' disabled>choose governorate</option>
                                {governoratesList ? governoratesList: <option value=""></option>}
                              </select>
                            </p>
                          </div>
                          <div className="details-info-content">
                            <p className="details-type flex-3">City</p>
                            <p className="details-value flex-5">
                              <select className="options select-50"
                                onChange={this.handleLocationChange} id='nurseryCity'
                                title='nurseryCity' defaultValue='value'>
                                <option value='value' disabled>choose city</option>
                                {citiesList ? citiesList: <option value=""></option>}
                              </select>
                            </p>
                          </div>
                          <div className="details-info-content">
                            <p className="details-type flex-3">Area</p>
                            <p className="details-value flex-5">
                              <select className="options select-50"
                                onChange={this.handleLocationChange} id='nurseryArea'
                                title='nurseryArea' defaultValue='value'>
                                <option value='value' disabled>choose area</option>
                                {areasList ? areasList: <option value=""></option>}
                              </select>
                            </p>
                          </div>
                          <div className="details-info-content">
                            <p className="details-type flex-3">Additional Info</p>
                            <div className="details-value details flex-5">
                              <input type="text" placeholder="Add Additional Location Info here" id='addLoction' onChange={this.handleChange} value={this.state.addLoction}/>
                            </div>
                          </div>
                          <div className="details-info-content">
                            <p className="details-type flex-3">Map Location</p>
                            <div className="details-value details flex-5">
                              <input type="text" placeholder="Paste Your Google Maps location link here" id='mapLocation' onChange={this.handleChange} value={this.state.mapLocation}/>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <div className="details-type flex-3">Phone Numbers</div>
                            <div className="details-value phone-num flex-5">
                              <input type="text" placeholder="01234567891" id='nurseryPhone' onChange={this.handleChange} />
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type flex-3">Nursery Photos</p>
                            <div className="details-value flex-5">
                              <li>
                                <img className="update-imgs" src="../../imgs/provider-dashboard/icons.svg" alt="" />
                                <input type="file" className="input-class" id="actual-btn-nursery" accept="image/*" onChange={this.handleFileNursery} />
                                <label className="label-class client-profile nursery-profile" htmlFor="actual-btn-nursery">Upload</label>
                              </li>
                              <li></li>
                              <li></li>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type flex-3">Supported Age</p>
                            <div className="details-value age-values flex-5">
                              <input type="text" placeholder="Minimum Age" id='minAge' onChange={this.handleChange} value={this.state.minAge}/>
                              <input type="text" placeholder="Maximum Age" id='maxAge' onChange={this.handleChange} value={this.state.maxAge}/>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <div className="details-type flex-3">Subscription Plan</div>
                            <div className="details-value phone-num flex-5" defaultValue="Type">
                              <select defaultValue='type' onBlur={this.handleSubscriptionPlanTypeChange} id='subscription-plan-0'>
                                <option value="type" disabled>Type</option>
                                <option value='daily'>Daily</option>
                                <option value='monthly'>Monthly</option>
                              </select>
                              <input type="text" className="value" placeholder="200" onBlur={this.handleSubscriptionPlanChange} id='subscription-plans-0'/>
                              <div className="add-img">
                                <div className="add-img d-flex">
                                  <img src='../../imgs/provider-dashboard/add.svg' className='pointer' alt='' onClick={this.handleSubscriptionPlanPlus}/>
                                  {this.state.subscriptionPlanList.length ? 
                                    <div className='union pointer' onClick={this.handleSubscriptionPlanMinus}></div> : <span></span>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          {subscriptionPlanListLists}
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type flex-3">Business Hours</p>
                            <div className="details-value business-info flex-5">
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
                              {/* <input type="text" placeholder="10AM" id='business-hour1-0' onBlur={this.handleBusinessHourChangeFirst}/>
                              <input type="text" placeholder="2PM" id='business-hour2-0' onBlur={this.handleBusinessHourChangeSecond} /> */}
                              <select className='mr-3' id='business-hour1-0' onBlur={this.handleBusinessHourChangeFirst} defaultValue='7' >
                                <option value='7'>Choose time</option>
                                {selectOptions}
                              </select>
                              <select className='mr-3' id='business-hour2-0' onBlur={this.handleBusinessHourChangeSecond} defaultValue='7'>
                                <option value='7'>Choose time</option>
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
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type flex-3">Courses</p>
                            <div className="details-value flex-5">
                              <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                options={coursesList}
                                onChange={this.handleChangeCourse}
                                value={nurseryCourses}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type flex-3">Activities</p>
                            <div className="details-value flex-5">
                              <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                isMulti
                                options={activitiesList}
                                onChange={this.handleChangeActivity}
                                value={nurseryActivities}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <h5>Community</h5>
                          <div className="details-info-content">
                            <p className="details-type flex-3">Facebook</p>
                            <div className="details-value details flex-5">
                              <input type="text" placeholder="Paste Your Facebook link here" id='facebook' onChange={this.handleChange} value={this.state.facebook}/>
                            </div>
                          </div>
                          <div className="details-info-content">
                            <p className="details-type flex-3">Instagram</p>
                            <div className="details-value details flex-5">
                              <input type="text" placeholder="Paste Your Instagram link here" id='instgram' onChange={this.handleChange} value={this.state.instgram} />
                            </div>
                          </div>
                          <div className="details-info-content">
                            <p className="details-type flex-3">LinkedIn</p>
                            <div className="details-value details flex-5">
                              <input type="text" placeholder="Paste Your linkedIn link here" id='linkedin' onChange={this.handleChange} value={this.state.linkedin}/>
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
        </section> : 
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
          <BeatLoader
            color={'#00818F'}
          />
        </div>}
        
      </Fragment>
      
    )
  }
}

function mapStateToProps(
  { loginReducer: loginReducer, infoReducer: infoReducer }) {
  return {
    token: loginReducer.token,
    governorates: infoReducer.governorates
  }
}

export default connect(mapStateToProps)(AddNewNursery)