import React, { Component, Fragment } from 'react'
import { Link, Navigate } from 'react-router-dom'

import './add-nursery.css'

import axios from 'axios'
import { connect } from 'react-redux'
import { apiUrlCreateNursery, apiUrlLocation } from '../../../api'

import Popup from '../../popup/Popup'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { FadeLoader } from 'react-spinners'

class AddNursery extends Component {

  state = {
    nurseryName: '',
    governorate: "",
    city: "",
    area: "",
    addLocation: '',
    phoneNumber: '',
    taxNumber: '',
    nurseryLicense: '',
    token: '',
    governorates: [],
    cities: [],
    areas: [],
    errors: [],
    redirect: false,
    btnLoader: false,
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({
      token: this.props.token,
    })

    axios.get(apiUrlLocation).then(res => {
      this.setState({
        governorates: res.data.data
      })
    }).catch(err => this.handleOpenPop(err))
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleFile = (e) => {
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

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({btnLoader: true})
    let locationDetails = {
      additional: this.state.addLocation
    }

    let file = this.state.nurseryLicense

    let formData = new FormData()

    formData.append('nursery_license', file)
    formData.append('name', this.state.nurseryName)
    formData.append('phone', '+2' + this.state.phoneNumber)
    formData.append('tax_number', this.state.taxNumber)
    formData.append('governorate', this.state.governorate)
    formData.append('city', this.state.city)
    formData.append('area', this.state.area)

    formData = this.buildFormData(formData, locationDetails, 'location_details');

    setTimeout(() => {
      axios.post(apiUrlCreateNursery, formData, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(res => {
        this.setState({btnLoader:false})
        this.handleOpenPop('Your nursery is added successfully, please wait the admin to aprove your request')
        setTimeout(() => {
          this.setState({
            redirect: true,
            errors: []
          })
        }, 3000)
      }).catch(err => this.setState({errors: err.response.data.errors, btnLoader: false}))
    }, 1500)
    
  }

  handleFilterChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })

    if (e.target.title === 'governorate') {
      this.sendGetGovernorateRequest(e)
    } else if (e.target.title === 'city') {
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
      const response = await axios.get(apiUrlLocation + '?governorate=' + this.state.governorate + '&city=' + e.target.value)
      this.setState({
        areas: response.data.data
      })
    } catch (err) {
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

  render() {

    const {redirect} = this.state;
    if (redirect) {
      return <Navigate to="/provider-dashboard"></Navigate>
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

    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen}/>
        <section className="add-nursery-container">
          {this.state.btnLoader ?
              <div className='d-flex justify-content-center align-items-center min-vh-100 loader'>
                <FadeLoader
                  color={'#00818F'}
                />
              </div> : null
            }
          <div className="add-nursery-image">
            <img src="../../imgs/providerlogin/Provider illustrator.svg" alt="" />
            <div className="description-text">
              <p>Get  the Fastest childcare Facility Regestrasion </p>
              <p>Start for free and get attractive offers </p>
            </div>
          </div>

          <div className="add-nursery">
            <div className="add-form">
              <Link to="/" className='wh' id="logo">
                <img src='../imgs/all/dashboard logo.svg' />
              </Link>
              <p id="start">Srart Now</p>
              <p id="add">Add Your Nursery</p>
              <p id="text">Step 3 of 3</p>
              {
                this.state.errors.length ? 
                this.state.errors.map((error, index) => {
                  return (
                    <Stack sx={{ width: '100%' }} spacing={2} key={index}>
                      <Alert severity="error" variant="outlined">
                        {error}
                      </Alert>
                    </Stack>
                  )
                }) : null
              }
              <form id='form'>
                <div id="nursery-label" htmlFor="nursery name">
                  <h6>Nursery Name<span>&nbsp;*</span></h6>
                  <input id="nurseryName" type="text" placeholder="Name" required onChange={this.handleChange}/>
                </div>
                <div className="row-content">
                  <div id="governorate-label" htmlFor="governorate" className="first">
                    <h6>Governorate <span>&nbsp;*</span></h6>
                    <select className="options client-register-select"
                      onChange={this.handleFilterChange} id='governorate'
                      title='governorate' defaultValue='value'>
                      <option value='value'>choose governorate</option>
                      {governoratesList ? governoratesList: <option value=""></option>}
                    </select>
                  </div>
                  <div id="city-label" htmlFor="city" className="second">
                    <h6>City<span>&nbsp;*</span></h6>
                    <select className="options client-register-select"
                      onChange={this.handleFilterChange} id='city' title='city' defaultValue='value'>
                      <option value='value'>choose city</option>
                      {citiesList ? citiesList : <option value=""></option>}
                    </select>
                  </div>
                </div>
                <div className="row-content">
                  <div id="nursery-label" htmlFor="nursery name" className="first">
                    <h6>Area<span>&nbsp;*</span></h6>
                    <select className="options client-register-select"
                      onChange={this.handleFilterChange} id='area' title='area' defaultValue='value'>
                      <option value='value'>choose area</option>
                      {areasList ? areasList : <option value=""></option>}
                    </select>
                  </div>
                  <div id="additional-label" htmlFor="additional" className="second">
                    <h6>Additional<span>&nbsp;*</span></h6>
                    <input id="addLocation" type="text" placeholder="Additional location info" required  onChange={this.handleChange}/>
                  </div>
                </div>
                <div className="row-content">
                  <div id="phone-label" htmlFor="phone number" className="first">
                    <h6>Mobile Number <span>&nbsp;*</span></h6>
                    <input id="phoneNumber" type="text" placeholder="00000000000" required  onChange={this.handleChange}/>
                  </div>
                  <div id="tax-label" htmlFor="tax number" className="second">
                  <h6>Tax Number <span>&nbsp;*</span></h6>
                  <input id="taxNumber" type="text" placeholder="555555555" required  onChange={this.handleChange}/>
                </div>
                </div>
                <div id="licence-label" htmlFor="nursery licence">
                  <h6>Nursery License<span>&nbsp;*</span></h6>
                  <div id="DragArea">
                    <div className="cloud">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
                          <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                      </svg>
                    </div>
                    <p id="drag-text">Select a file or drag and drop here</p>
                    <p id="file-type">JPG or PNG, file size no more than 10MB</p>
                    <input type="file" className="input-class" id="actual-btn" accept="image/*,application/pdf" onChange={this.handleFile}/>
                    <label className="label-class" htmlFor="actual-btn">Select file</label>
                  </div>
                </div>
              </form>
              {/* <form className="submit" onSubmit={this.handleSubmit}> */}
              <button className="add-nursery-submit-button button-green-hover" type="submit" onClick={this.handleSubmit} form='form'>Add</button>
              {/* </form> */}
            </div>
          </div>

          </section>
        </Fragment>
    )
  }
}

function mapStateToProps(
  { infoReducer: infoReducer, loginReducer: loginReducer }) {
  return {
    governorates: infoReducer.governorates,
    token: loginReducer.token
  }
}

export default connect(mapStateToProps)(AddNursery)