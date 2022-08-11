import React, { Component, Fragment } from 'react'

import { Link } from 'react-router-dom'

import './PhoneVerification.css'

import { apiUrlPhoneVerification, apiUrlPhoneVerificationResend } from '../../api'
import axios from 'axios'
import { connect } from 'react-redux'

import Popup from '../popup/Popup'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { FadeLoader } from 'react-spinners'

class PhoneVerification extends Component {

  state = {
    phoneOTP: '',
    phoneNumber: '',
    errors: [],
    btnLoader: false,
    token: '',
    isOpen: false,
    txt: ''
  }

  componentDidMount () {
    this.setState({
      phoneNumber: this.props.phoneNumber,
      token: this.props.token
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleResendPhoneVerification = () => {
    var newToken
    if (this.state.token) {
      newToken = this.state.token
    }
    axios.post(apiUrlPhoneVerificationResend, {},
      { headers: { Authorization: 'Bearer ' + newToken } })
      .then(res => {
        this.setState({
          token: res.data.token
        })
      }
      ).catch(err => this.setState({errors: err.response.data.errors}))
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({btnLoader: true})
    axios.post(apiUrlPhoneVerification,
      { phone: this.state.phoneNumber, otp: this.state.phoneOTP },
      { headers: { Authorization: 'Bearer ' + this.state.token } })
      .then(res => {
        this.handleOpenPop('Your phone is verified successfully')
        this.setState({
          btnLoader: false
        })
      })
      .catch(err => this.setState({errors: err.response.data.errors, btnLoader: false}))
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
    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen} />
        {this.state.btnLoader ?
          <div className='d-flex justify-content-center align-items-center min-vh-100 loader'>
            <FadeLoader
              color={'#00818F'}
            />
          </div> : null
        }
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
              <Link to="/" className='wh' id="logo">
                <img src='../imgs/all/dashboard logo.svg' />
              </Link>
              <p id="welcome">WELCOME</p>
              <p id="create">Verify Your Phone</p>
              <p id="text">Lorem ipsum dolor sit amet, consectetur adipiscing</p>
            </div>

            <div className="action phone-verification">
              <p className='phone-verify' onClick={this.handleResendPhoneVerification}>
                Resend A Verification OTP
              </p>
            </div>

            <form className='form'>
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
              <div>
                <input type='text' placeholder='Enter Your OTP' id='phoneOTP' onChange={this.handleChange}/>
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


function mapStateToProps(
  { phoneNumberReducer: phoneNumberReducer,
    loginReducer: loginReducer }) {
  return {
    phoneNumber: phoneNumberReducer.phoneNumber,
    token: loginReducer.token,
  }
}

export default connect(mapStateToProps)(PhoneVerification)