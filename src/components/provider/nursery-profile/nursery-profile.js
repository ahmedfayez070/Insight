import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './nursery-profile.css'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'

import { apiUrlUpdateNursery, apiUrlViewMoreProvider, apiUrlCoursesName, apiUrlActivitiesName, apiUrlNursery } from '../../../api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import Popup from '../../popup/Popup'
import {BeatLoader, FadeLoader} from 'react-spinners'
import ProviderNavbar from '../ProviderDashboard/ProviderNavbar/ProviderNavbar'

import Select from 'react-select'
import makeAnimated from 'react-select/animated';

class Nurseryprofile extends Component {

  state = {
    profilePic: '',
    nurseries: [],
    nurseryId: 1,
    nurseryName: '',
    nurseryAbout: '',
    nurseryTaxNumber: '',
    nurseryLicense: '',
    nurseryPhoto: '',
    nurseryPhone: '',
    nurseryGovernorate: '',
    nurseryCity: '',
    nurseryArea: '',
    addLoction: '',
    mapLocation: '',
    mobileNumbers: [],
    nurseryPhotos: '',
    minAge: '',
    maxAge: '',
    nurseryCourses: [],
    nurseryActivities: [],
    nurserySubscriptionPlan: [],
    nurseryBusinessHours: [],
    courses: [],
    activities: [],
    facebook: '',
    instgram: '',
    linkedin: '',
    token: '',
    requestChangeFromAdmin: 'Request change from Admin',
    messageForNone: 'Update Nuresery Profile To Add This',
    logoutRedircet: false,
    subscriptionPlanDaily: '',
    subscriptionPlanMonthly: '',
    subscriptionPlanInputDaily: null,
    subscriptionPlanInputMonthly: null,
    businessHoursList: [],
    businessHoursListValuesFirst: [],
    businessHoursListValuesSecond: [],
    businessHoursListValuesTypes: [],
    businessHoursIndex: 0,
    loader: true,
    btnLoader: false,
    isOpen: false,
    txt: '',
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlViewMoreProvider, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        nurseries: res.data.data.nurseries,
        token: this.props.token,
        nurseryId: this.props.nurseryId,
        nurseryName: this.props.nurseryName,
        profilePic: res.data.data.profile_image
      })
    }).catch(err => console.log(err))

    axios.get(apiUrlCoursesName).then(res => {
      this.setState({
        courses: res.data.data
      })
    })

    axios.get(apiUrlActivitiesName).then(res => {
      this.setState({
        activities: res.data.data
      })
    })

    axios.get(apiUrlNursery + this.props.nurseryId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      console.log(this.props.nurseryId);
      console.log(res.data.data);
        this.setState({
        nurseryId: res.data.data.id,
        nurseryAbout: res.data.data.about,
        nurseryTaxNumber: res.data.data.tax_number ?? null,
        nurseryLicense: res.data.data.nursery_license != null ? res.data.data.nursery_license.mediafile : null,
        nurseryPhoto: res.data.data.profile_image != null ? res.data.data.profile_image.mediafile : null,
        nurseryPhone: res.data.data.phone,
        nurseryGovernorate: res.data.data.location.governorate,
        nurseryCity: res.data.data.location.city,
        nurseryArea: res.data.data.location.area,
        addLoction: res.data.data.location_details != null ? res.data.data.location_details.additional : '',
        mapLocation: res.data.data.location_details != null ? res.data.data.location_details.map_link : '',
        nurseryPhotos:res.data.data.nursery_pics != null ? res.data.data.nursery_pics[0].mediafile : null,
        minAge: res.data.data.age != null ? res.data.data.age.min : '',
        maxAge: res.data.data.age != null ? res.data.data.age.max : '',
        subscriptionPlanInputDaily: res.data.data.pricing != null ? res.data.data.pricing.daily : null,
        subscriptionPlanInputMonthly: res.data.data.pricing != null ? res.data.data.pricing.monthly : null,
        nurseryBusinessHours: res.data.data.active_hours ?? null,
        nurseryCourses: res.data.data.courses,
        nurseryActivities: res.data.data.activities,
        facebook: res.data.data.social_links != null ? res.data.data.social_links[0].link : '',
        instgram: res.data.data.social_links != null ? res.data.data.social_links[1].link : '',
        linkedin: res.data.data.social_links != null ? res.data.data.social_links[2].link : '',
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

  handleNurseryChange = (e) => {
    this.setState({btnLoader: true})
    // var target = parseInt(e.target.value)
    // var index
    // var count = e.target.childNodes.length
    // var allChildNodes = e.target.childNodes

    // for (var i = 0; i < count; i++ ) {
    //   if (allChildNodes[i].value == target) {
    //     index = allChildNodes[i].title
    //     break
    //   } else {
    //     continue
    //   }
    // }

    // this.setState({
    //   nurseryId : e.target.value,
    //   nurseryName: this.state.nurseries[index].name ?? '',
    //   nurseryAbout: this.state.nurseries[index].about ?? '',
    //   nurseryTaxNumber: this.state.nurseries[index].tax_number ?? '',
    //   nurseryLicense: this.state.nurseries[index].nursery_license ?? '',
    //   nurseryPhoto: this.state.nurseries[index].profile_image?? null,
    //   nurseryGovernorate: this.state.nurseries[index].governorate ?? '',
    //   nurseryCity: this.state.nurseries[index].city ?? '',
    //   nurseryArea: this.state.nurseries[index].area ?? '',
    //   addLoction: this.state.nurseries[index].location_details != null ? this.state.nurseries[index].location_details.additional : '',
    //   mapLocation: this.state.nurseries[index].location_details != null ? this.state.nurseries[index].location_details.map_link : '',
    //   nurseryPhone: this.state.nurseries[index].phone ?? '',
    //   nurseryPhotos: this.state.nurseries[index].nursery_pics ?? null,
    //   minAge: this.state.nurseries[index].age != null ? this.state.nurseries[index].age.min : '',
    //   maxAge: this.state.nurseries[index].age != null ? this.state.nurseries[index].age.max : '',
    //   nurserySubscriptionPlan: this.state.nurseries[index].pricing ?? null,
    //   subscriptionPlanInputDaily: this.state.nurseries[index].pricing != null ? this.state.nurseries[index].pricing.daily : null,
    //   subscriptionPlanInputMonthly: this.state.nurseries[index].pricing != null ? this.state.nurseries[index].pricing.monthly : null,
    //   nurseryBusinessHours: this.state.nurseries[index].active_hours ?? null,
    //   courses: this.state.nurseries[index].courses,
    //   activities: this.state.nurseries[index].activities,
    //   facebook: this.state.nurseries[0].social_links != null ? this.state.nurseries[0].social_links.facebook : '',
    //   instgram: this.state.nurseries[0].social_links != null ? this.state.nurseries[0].social_links.instgram : '',
    //   linkedin: this.state.nurseries[0].social_links != null ? this.state.nurseries[0].social_links.linkedin : ''
    // })

    axios.get(apiUrlNursery + e.target.value, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
        this.setState({
        nurseryId: res.data.data.id ?? '',
        nurseryName: res.data.data.name ?? '',
        nurseryAbout: res.data.data.about ?? null,
        nurseryTaxNumber: res.data.data.tax_number ?? null,
        nurseryLicense: res.data.data.nursery_license != null ? res.data.data.nursery_license.mediafile : null,
        nurseryPhoto: res.data.data.profile_image != null ? res.data.data.profile_image.mediafile : null,
        nurseryPhone: res.data.data.phone ?? null,
        nurseryGovernorate: res.data.data.location.governorate,
        nurseryCity: res.data.data.location.city,
        nurseryArea: res.data.data.location.area,
        addLoction: res.data.data.location_details != null ? res.data.data.location_details.additional : '',
        mapLocation: res.data.data.location_details != null ? res.data.data.location_details.map_link : '',
        nurseryPhotos:res.data.data.nursery_pics != null ? res.data.data.nursery_pics[0].mediafile : null,
        minAge: res.data.data.age != null ? res.data.data.age.min : '',
        maxAge: res.data.data.age != null ? res.data.data.age.max : '',
        subscriptionPlanInputDaily: res.data.data.pricing != null ? res.data.data.pricing.daily : null,
        subscriptionPlanInputMonthly: res.data.data.pricing != null ? res.data.data.pricing.monthly : null,
        nurseryBusinessHours: res.data.data.active_hours ?? null,
        nurseryCourses: res.data.data.courses,
        nurseryActivities: res.data.data.activities,
        facebook: res.data.data.social_links != null ? res.data.data.social_links[0].link : '',
        instgram: res.data.data.social_links != null ? res.data.data.social_links[1].link : '',
        linkedin: res.data.data.social_links != null ? res.data.data.social_links[2].link : '',
        loader: false,
        btnLoader: false
      })
    }).catch(err => this.setState({btnLoader: false}))
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

  handleUpdateNursery = () => {
    this.setState({btnLoader: true})
    var activeHours = {}
    let courses = {}
    let activities = {}

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

    let info = {}

    setTimeout(() => {
      if (this.state.nurseries.length) {

        let locationDetails = {
          additional: this.state.addLoction,
          map_link: this.state.mapLocation
        }

        let pricing = {
          daily: this.state.subscriptionPlanInputDaily,
          monthly: this.state.subscriptionPlanInputMonthly,
        }

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
        
        formData.append('about', this.state.nurseryAbout)
        formData.append('phone', '+2' + this.state.nurseryPhone)
        formData.append('courses', courses)
        formData.append('activities', activities)
        formData.append('mediafile', mediafile)
        formData = this.buildFormData(formData, locationDetails, 'location_details');
        formData = this.buildFormData(formData, age, 'age');
        formData = this.buildFormData(formData, pricing, 'pricing');
        formData = this.buildFormData(formData, socialLinks, 'social_links');
        formData = this.buildFormData(formData, activeHours, 'active_hours');
        formData = this.buildFormData(formData, mediafile, 'mediafile');
        formData = this.buildFormData(formData, courses, 'courses');
        formData = this.buildFormData(formData, activities, 'activities');
        formData.append('_method', 'put')

        // info = {
        //   about : this.state.nurseryAbout,
        //   phone: '+2' + this.state.nurseryPhone,
        //   pricing: {
        //     daily: this.state.subscriptionPlanInputDaily,
        //     monthly: this.state.subscriptionPlanInputMonthly,
        //   },
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
        //   social_links : [
        //     {
        //       site: 'facebook',
        //       link: this.state.facebook
        //     },
        //     {
        //       site: 'instagram',
        //       link: this.state.instgram
        //     },
        //     {
        //       site: 'linkedin',
        //       link: this.state.linkedin
        //     }
        //   ]
        // }
      }
      
      setTimeout(() => {

        for(var pair of formData.entries()){
          console.log(pair[0], pair[1]);
        }

        axios.post(apiUrlUpdateNursery + '/' + this.state.nurseryId, formData, { headers: { Authorization: 'Bearer ' + this.state.token, ContentType: "multipart/form-data", type: "formData" } })
        .then(res => {
        this.setState({
          nurseryId: res.data.data.id,
          nurseryAbout: res.data.data.about ?? '',
          nurseryTaxNumber: res.data.data.tax_number ?? '',
          nurseryLicense: res.data.data.nursery_license ?? '',
          nurseryPhoto: res.data.data.profile_image != null ? res.data.data.profile_image.mediafile : null,
          nurseryPhone: res.data.data.phone ?? '',
          nurseryGovernorate: res.data.data.location.governorate,
          nurseryCity: res.data.data.location.city,
          nurseryArea: res.data.data.location.area,
          addLoction: res.data.data.location_details != null ? res.data.data.location_details.additional : '',
          mapLocation: res.data.data.location_details != null ? res.data.data.location_details.map_link : '',
          nurseryPhotos: res.data.data.nursery_pics != null ? res.data.data.nursery_pics.mediafile : null,
          minAge: res.data.data.age != null ? res.data.data.age.min : '',
          maxAge: res.data.data.age != null ? res.data.data.age.max : '',
          subscriptionPlanInputDaily: res.data.data.pricing != null ? res.data.data.pricing.daily : null,
          subscriptionPlanInputMonthly: res.data.data.pricing != null ? res.data.data.pricing.monthly : null,
          nurseryBusinessHours: res.data.data.active_hours ?? null,
          nurseryCourses: res.data.data.courses ?? [],
          nurseryActivities: res.data.data.activities ?? [],
          facebook: res.data.data.social_links != null ? res.data.data.social_links[0].link : '',
          instgram: res.data.data.social_links != null ? res.data.data.social_links[1].link : '',
          linkedin: res.data.data.social_links != null ? res.data.data.social_links[2].link : '',
        })
        this.setState({btnLoader: false})
        this.handleOpenPop(`You updated ${this.state.nurseryName} nursery successfully`)
      })
          .catch(err => {
            this.handleOpenPop(err.response.data.errors[0])
            this.setState({btnLoader: false})
          })
      }, 4000)
      
    }, 3000)
    
  }

  handleUpdateCancelation = () => {
    axios.get(apiUrlNursery + this.state.nurseryId, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(res => {
      this.setState({
        nurseryId: res.data.data.id,
        nurseryAbout: res.data.data.about ?? '',
        nurseryTaxNumber: res.data.data.tax_number ?? '',
        nurseryLicense: res.data.data.nursery_license ?? '',
        nurseryPhoto: res.data.data.profile_image ?? null,
        nurseryPhone: res.data.data.phone ?? '',
        nurseryGovernorate: res.data.data.governorate,
        nurseryCity: res.data.data.city,
        nurseryArea: res.data.data.area,
        addLoction: res.data.data.location_details != null ? res.data.data.location_details.additional : '',
        mapLocation: res.data.data.location_details != null ? res.data.data.location_details.map_link : '',
        mobileNumbers: res.data.data.mobileNumbers,
        nurseryPhotos: res.data.data.nursery_pics ?? null,
        minAge: res.data.data.age != null ? res.data.data.age.min : '',
        maxAge: res.data.data.age != null ? res.data.data.age.max : '',
        subscriptionPlanInputDaily: res.data.data.pricing != null ? res.data.data.pricing.daily : null,
        subscriptionPlanInputMonthly: res.data.data.pricing != null ? res.data.data.pricing.monthly : null,
        nurseryBusinessHours: res.data.data.active_hours ?? null,
        nurseryCourses: res.data.data.courses,
        nurseryActivities: res.data.data.activities,
        facebook: res.data.data.social_links != null ? res.data.data.social_links[0].link : '',
        instgram: res.data.data.social_links != null ? res.data.data.social_links[1].link : '',
        linkedin: res.data.data.social_links != null ? res.data.data.social_links[2].link : '',
      })

      this.handleOpenPop('You canceled your update')
    }).catch(err => console.log(err))
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

  render() {

    const { nurseryId } = this.state

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

    /* Show */
    if (nurseryCourses) {
      var coursesListShow = nurseryCourses.map((course) => {
        return (
          <span key={course.id} className='nursery-course'>{course.name} </span>
        )
      })
    }
    
    if (nurseryActivities) {
      var activitiesListShow = nurseryActivities.map((activity) => {
        return (
          <span key={activity.id} className='nursery-course'>{activity.name} </span>
        )
      })
    }

    const { nurseries } = this.state
    const nurseriesList = nurseries.map((nursery, index) => {
      return (
        <option value={nursery.id} key={nursery.id} title={index}>{nursery.name}</option>
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

    if (clientUpdate) {
      clientUpdate.onclick = () => {
        document.getElementById('v-pills-settings-tab').click()
        document.getElementById('nav-details-tab-update').click()
        vPillsHomeTab.classList.add('active-plus')
      }
    }

    if (childProfile) {
      childProfile.onclick = () => {
        vPillsProfileTab.click()
      }
    }

    if (clientProfile) {
      clientProfile.onclick = () => {
        vPillsHomeTab.click()
        document.getElementById('nav-details-tab').click()
      }
    }

    if (paymentUpdate) {
      paymentUpdate.onclick = () => {
        document.getElementById('v-pills-settings-tab').click()
        document.getElementById('nav-payment-tab-update').click()
        vPillsHomeTab.classList.add('active-plus')
      }
    }

    if (clientProfileFp) {
      clientProfileFp.onclick = () => {
        vPillsHomeTab.click()
        document.getElementById('nav-payment-tab').click()
      }
    }

    if (vPillsProfileTab) {
      vPillsProfileTab.onclick = () => {
        vPillsHomeTab.classList.remove('active-plus')
      }
    }

    const clientprofile = document.getElementById('go-clientprofile')
    if (clientprofile) {
      clientprofile.onclick = () => {
        vPillsHomeTab.click()
      }
    }

    let gearContainer = document.querySelector('.slide-menu .gear-container')
    const navDetails = document.getElementById('nav-details')
    const vPillsSettings = document.getElementById('v-pills-settings')
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

    if (vPillsSettings) {
      vPillsSettings.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

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

    const array = Array.from({length: 13}, (v, i) => i)
    const selectOptions = array.map((i) => {
      return (
        <option value={ i + 7 }>{i + 7}</option>
      )
    })

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
              <button className="nav-link active button" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home"
                type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
                Nursery Profile
              </button>
              <button className="profile-hover button">
                <Link to='/provider-child-info'>Child Info</Link>
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
              <button className="nav-link display-none button" id="v-pills-settings-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settings"
                type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">
                Settings
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

                  {/* show My Profile */}
                  <div className="tab-pane fade show active"
                    id="v-pills-home" role="tabpanel"
                    aria-labelledby="v-pills-home-tab">
                    <nav className='display-none'>
                      <div className="nav nav-tabs nav-buttons mb-5" id="nav-tab" role="tablist">
                        <button className="nav-link nav-button active button" id="nav-details-tab" data-bs-toggle="tab" data-bs-target="#nav-details"
                          type="button" role="tab" aria-controls="nav-details" aria-selected="true">Nursery Profile</button>
                        <button className="nav-link nav-button button" id="nav-payment-tab" data-bs-toggle="tab" data-bs-target="#nav-payment"
                          type="button" role="tab" aria-controls="nav-payment" aria-selected="false">Payment Info</button>
                      </div>
                    </nav>
                    <div className="tab-content tabs-content update" id="nav-tabContent">
                      <div className="tab-pane fade show active" 
                        id="nav-details" role="tabpanel" 
                        aria-labelledby="nav-details-tab">
                        <div className="tab-content-header">
                          <p>Nursery Profile</p>
                          <span><img src="../../imgs/provider-dashboard/edit.svg" alt="" id="go-client-update" /></span>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Choose A Nursery</p>
                            <div className='details-value'>
                              {
                                <select className="options choose-child p-8"
                                  defaultValue={nurseryId} onChange={this.handleNurseryChange}>
                                  {nurseriesList ? nurseriesList : ''}
                                </select>
                              }
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Nursery Name</p>
                            {
                              this.state.nurseryName ? 
                              <p className="details-value">
                                {this.state.nurseryName}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">About</p>
                            {
                              this.state.nurseryAbout ? 
                              <p className="details-value">
                                {this.state.nurseryAbout}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                        </div>
                        <div className="details-info">
                          <h5>Business Details</h5>
                          <div className="details-info-content">
                            <p className="details-type">Tax Number</p>
                            {
                              this.state.nurseryTaxNumber ? 
                              <p className="details-value">
                                {this.state.nurseryTaxNumber}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">Nursery License</p>
                            <p className="details-value">Attachment</p>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Profile Image</p>
                              <div className="details-value">
                                <div className='mw-90'>
                                  <img src={this.state.nurseryPhoto ?? "../../imgs/provider-dashboard/icon.svg"} alt="" className='before-update wh'/>
                                </div>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <h5>Location Details</h5>
                          <div className="details-info-content">
                            <p className="details-type">Governorate</p>
                            {
                              this.state.nurseryGovernorate ? 
                              <p className="details-value">
                                {this.state.nurseryGovernorate}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">City</p>
                            {
                              this.state.nurseryCity ? 
                              <p className="details-value">
                                {this.state.nurseryCity}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">Area</p>
                            {
                              this.state.nurseryArea ? 
                              <p className="details-value">
                                {this.state.nurseryArea}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">Additional Info</p>
                            {
                              this.state.addLoction ? 
                              <p className="details-value">
                                {this.state.addLoction}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">Map Location</p>
                            {
                              this.state.mapLocation ? 
                              <p className="details-value">
                                {this.state.mapLocation}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">Phone Numbers</p>
                            {
                              this.state.nurseryPhone ? 
                              <p className="details-value">
                                {this.state.nurseryPhone}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Nursery Photos</p>
                              <div className="details-value">
                                <div className='mw-90'>
                                  <img src={this.state.nurseryPhotos ?? "../../imgs/provider-dashboard/icon.svg"} alt=""
                                  className='before-update wh' />
                                </div>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Supported Age</p>
                            {
                              this.state.minAge ? 
                              <p className="details-value">
                                The Nursery Support From {this.state.minAge} Years to {this.state.maxAge} Years
                              </p> :
                              <p className="details-value update-to">
                              {this.state.messageForNone}
                              </p>
                            }
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Subscription Plan</p>
                            {
                              this.state.subscriptionPlanInputDaily != null ? 
                                <div className="details-value">
                                  <p>Daily: {this.state.subscriptionPlanInputDaily}</p>
                                  {this.state.subscriptionPlanInputMonthly != null ?
                                    <p>Monthly: {this.state.subscriptionPlanInputMonthly}</p> : null}
                                </div> : null
                            }
                            {
                              ((this.state.subscriptionPlanInputDaily == null) && (this.state.subscriptionPlanInputMonthly != null)) ? 
                                <div className="details-value">
                                  <p>Monthly: {this.state.subscriptionPlanInputMonthly}</p>
                                </div> : null
                            }
                            { ((this.state.subscriptionPlanInputDaily == null) && (this.state.subscriptionPlanInputMonthly == null)) ? 
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p> : null
                            }
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Business Hours</p>
                            {
                              this.state.nurseryBusinessHours != null ? 
                                <div className="details-value">
                                  {Object.keys(this.state.nurseryBusinessHours).map((key, index) => {
                                  return (<div key={index}><p><span>{key}</span> from <span>{this.state.nurseryBusinessHours[key]['from']}</span> to <span>{this.state.nurseryBusinessHours[key]['to']}</span></p></div>)
                                  })}
                                </div>
                              :
                              <p className="details-value update-to">
                              {this.state.messageForNone}
                              </p>
                            }
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Courses</p>
                            {
                              nurseryCourses.length ? 
                              <p className="details-value">
                                {coursesListShow}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Activities</p>
                            {
                              nurseryActivities.length ? 
                              <p className="details-value">
                                {activitiesListShow}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                        </div>
                        <div className="details-info">
                          <h5>Community</h5>
                          <div className="details-info-content">
                            <p className="details-type">Facebook</p>
                            {
                              this.state.facebook ? 
                              <p className="details-value">
                                {this.state.facebook}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">Instagram</p>
                            {
                              this.state.instgram ? 
                              <p className="details-value">
                                {this.state.instgram}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">LinkedIn</p>
                            {
                              this.state.linkedin ? 
                              <p className="details-value">
                                {this.state.linkedin}
                              </p> :
                              <p className="details-value update-to">
                                {this.state.messageForNone}
                              </p>
                            }
                          </div>
                        </div>
                      </div>
                      <div className="tab-pane fade"
                        id="nav-payment" role="tabpanel"
                        aria-labelledby="nav-payment-tab">
                        <div className="tab-content-header">
                          <p>Payment Info</p>
                          <img src="../../imgs/provider-dashboard/edit.svg" alt="" id="go-payment-update" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update My Profile */}
                  <div className="tab-pane fade" id="v-pills-settings"
                    role="tabpanel"
                    aria-labelledby="v-pills-settings-tab">
                    <nav className='display-none'>
                      <div className="nav nav-tabs nav-buttons mb-5" id="nav-tab" role="tablist">
                        <button className="nav-link nav-button button active" id="nav-details-tab-update" data-bs-toggle="tab" data-bs-target="#nav-details-update"
                          type="button" role="tab" aria-controls="nav-details-update" aria-selected="true">
                          Nursery Profile
                        </button>
                        <button className="nav-link nav-button button" id="nav-payment-tab-update" data-bs-toggle="tab" data-bs-target="#nav-payment-update"
                          type="button" role="tab" aria-controls="nav-payment-update" aria-selected="false">
                          Payment Info
                        </button>
                      </div>
                    </nav>
                    <div className="tab-content tabs-content update-nursery update" id="nav-tabContent">
                      <div className="tab-pane fade show active"
                        id="nav-details-update" role="tabpanel"
                        aria-labelledby="nav-details-tab">
                        <div className="tab-content-header">
                          <p>Update Nursery Profile</p>
                          <div className="update-actions">
                            <span id="go-client-profile" onClick={this.handleUpdateNursery} className='pointer'>Update</span>
                            <img src="../imgs/all/exit.svg" alt="" onClick={this.handleUpdateCancelation} id='go-clientprofile' />
                          </div>
                        </div>
                        {/* <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type flex-3">Choose A Nursery</p>
                            <div className='details-value flex-5'>
                              {
                                <select className="options choose-child"
                                  onChange={this.handleNurseryChange} defaultValue={nurseryId}>
                                  {nurseriesList ? nurseriesList : ''}
                                </select>
                              }
                            </div>
                          </div>
                        </div> */}
                        <div className="details-info">
                          <div className="details-info-content">
                            <p className="details-type">Nursery Name</p>
                            <p className="details-value">{this.state.nurseryName}</p>
                            <span className="request-change">{this.state.requestChangeFromAdmin}</span>
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
                            <p className="details-type">Tax Number</p>
                            <p className="details-value">{this.state.nurseryTaxNumber}</p>
                            <span className="request-change">{this.state.requestChangeFromAdmin}</span>
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">Nursery License</p>
                            <p className="details-value">Attachment</p>
                            <span className="request-change">{this.state.requestChangeFromAdmin}</span>
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
                            <p className="details-type">Governorate</p>
                            <p className="details-value">{this.state.nurseryGovernorate}</p>
                            <span className="request-change">{this.state.requestChangeFromAdmin}</span>
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">City</p>
                            <p className="details-value">{this.state.nurseryCity}</p>
                            <span className="request-change">{this.state.requestChangeFromAdmin}</span>
                          </div>
                          <div className="details-info-content">
                            <p className="details-type">Area</p>
                            <p className="details-value">{this.state.nurseryArea}</p>
                            <span className="request-change">{this.state.requestChangeFromAdmin}</span>
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
                          <h5>Phone Numbers</h5>
                          <div className="details-info-content">
                            <div className="details-type flex-3"></div>
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
                                <input type="file" className="input-class" id="actual-btn-nursery" accept="image/*" onChange={this.handleFileNursery}/>
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
                          <h5>Subscription Plan</h5>
                          <div className="details-info-content">
                            <div className="details-type flex-3"></div>
                            <div className="details-value phone-num flex-5" defaultValue="Type">
                              <select defaultValue='daily' id='subscriptionPlanDaily'>
                                <option value='daily'>Daily</option>
                              </select>
                              <input type="text" className="value" placeholder="200" onChange={this.handleChange} id='subscriptionPlanInputDaily' value={this.state.subscriptionPlanInputDaily ?? ''}/>
                            </div>
                          </div>
                          <div className="details-info-content">
                            <div className="details-type flex-3"></div>
                            <div className="details-value phone-num flex-5" defaultValue="Type">
                              <select defaultValue='monthly' id='subscriptionPlanMonthly'>
                                <option value='monthly'>Monthly</option>
                              </select>
                              <input type="text" className="value" placeholder="200" onChange={this.handleChange}id='subscriptionPlanInputMonthly' value={this.state.subscriptionPlanInputMonthly != null ? this.state.subscriptionPlanInputMonthly : ''}/>
                            </div>
                          </div>
                        </div>
                        <div className="details-info">
                          <div className="details-info-content">
                            <div className="details-type flex-3">
                              <p>Business Hours</p>
                            </div>
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
                          {businessHoursListLists ?? <p className='buisness-pharse'>Input days from begining</p>}
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
                      <div className="tab-pane fade" id="nav-payment-update"
                        role="tabpanel"
                        aria-labelledby="nav-payment-tab">
                        <div className="tab-content-header">
                          <p>Update My Payment Info</p>
                          <img src="../../imgs/provider-dashboard/exit.svg" alt="" id="go-client-profile-fp" />
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

export default connect(mapStateToProps)(Nurseryprofile)