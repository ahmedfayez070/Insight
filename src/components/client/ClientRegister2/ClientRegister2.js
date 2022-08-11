import React, { Component, Fragment } from 'react'

import { Link, Navigate } from 'react-router-dom'

import './ClientRegister2.css'

import { apiUrlClientRegister2, apiUrlLocation } from '../../../api'
import axios from 'axios'
import { connect } from 'react-redux'

import Popup from '../../popup/Popup'

class ClientRegister2 extends Component {

  state = {
    parentName: '',
    parentGender: '0',
    governorate: '',
    city: '',
    area: '',
    governorates: [],
    cities: [],
    areas: [],
    token: '',
    token: '',
    redirect: false,
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlLocation)
    this.setState({
      token: this.props.token,
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

  handleSubmit = (e) => {
    e.preventDefault()
    axios.post(apiUrlClientRegister2,
      {
        fullname: this.state.parentName,
        gender: this.state.parentGender,
        governerate: this.state.governorate,
        city: this.state.city,
        area: this.state.area,
      },
      { headers: { Authorization: 'Bearer ' + this.state.token } })
      .then(
        this.handleOpenPop('You saved your data successfully'),
        this.setState({
          redirect: true
        })
      ).catch(err => this.handleOpenPop('Fill Your Data'))
    
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

    // this.handleSubmit(e)
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
      return <Navigate to="/client-dashboard"></Navigate>
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
        <section className="signup-container">

          <div className="signup-image">
            <img src="../imgs/signup1/Illustration.svg" alt="" />
            <div className="description-text">
              <p>Get  the Fastest childcare Facility Regestrasion </p>
              <p>Start for free and get attractive offers </p>
            </div>
          </div>

          <div className="signup-ways">
            <div className="signup-form">
              {/* <Link to="/" id="logo">LOGO</Link> */}
              <Link to="/" id="logo" className='wh'>
                <img src='../imgs/all/dashboard logo.svg' />
              </Link>
              <p id="welcome">WELCOME</p>
              <p id="create">Complete Your Profile</p>
              <p id="text">Lorem ipsum dolor sit amet, consectetur adipiscing</p>
            </div>

            <form className="form">
                <div>
                  <h6>Full Name<span>&nbsp;*</span></h6>
                  <input id="parentName" type="text" placeholder="John Dou" required onChange={this.handleChange}/>
                </div>
                
                <div>
                  <h6>Gender<span>&nbsp;*</span></h6>
                  <select className="options client-register-select"
                    onChange={this.handleChange} id='parentGender'>
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </select>
                </div>
                
                <div>
                  <h6>Governorate<span>&nbsp;*</span></h6>
                  <select className="options client-register-select"
                    onChange={this.handleFilterChange} id='governorate'
                    title='governorate' defaultValue='value'>
                    <option value='value'>choose governorate</option>
                    {governoratesList ? governoratesList: <option value=""></option>}
                  </select>
                </div>
                
                <div>
                  <h6>City<span>&nbsp;*</span></h6>
                  <select className="options client-register-select"
                    onChange={this.handleFilterChange} id='city' title='city' defaultValue='value'>
                    <option value='value'>choose city</option>
                    {citiesList ? citiesList : <option value=""></option>}
                  </select>
                </div>
                
                <div>
                  <h6>Area<span>&nbsp;*</span></h6>
                  <select className="options client-register-select"
                    onChange={this.handleFilterChange} id='area' title='area' defaultValue='value'>
                    <option value='value'>choose area</option>
                    {areasList ? areasList : <option value=""></option>}
                  </select>
                </div>
              </form>

            <form className="submit" onSubmit={this.handleSubmit}>
              <button className="submit-button" type="submit">Send</button>
            </form>
          </div>

          </section>
        </Fragment>
    )
  }
}

function mapStateToProps({loginReducer: loginReducer, infoReducer: infoReducer }) {
  return {
    token: loginReducer.token,
    governorates: infoReducer.governorates
  }
}

export default connect(mapStateToProps)(ClientRegister2)