import React, { Component, Fragment } from 'react'

import { Link, Navigate } from 'react-router-dom'

import './SignUp1.css'

import { apiUrlSignupClient, apiUrlEmailVerificationResend } from '../../api'
import axios from 'axios'
import { connect } from 'react-redux'

import Popup from '../popup/Popup'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { FadeLoader } from 'react-spinners'

class SignUp1 extends Component {

  state = {
    email: '',
    password: '',
    errors: [],
    token: '',
    redirect: false,
    homeRedirect: false,
    btnLoader: false,
    isOpen: false,
    txt: ''
  }

  componentDidMount = () => {
    this.props.token ? this.setState({homeRedirect: true}) : this.setState({homeRedirect: false})
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleResendEmailVerification = () => {
    var newToken
    if (this.state.token) {
      newToken = this.state.token
    }
    else if (this.state.token) {
      newToken = this.state.token
    } else {
      newToken = this.state.providerToken
    }
    axios.post(apiUrlEmailVerificationResend, {},
      { headers: { Authorization: 'Bearer ' + newToken } })
      .then(res => {
        this.setState({
          token: res.data.token,
          errors: []
        })
        setTimeout(() => {
          this.handleOpenPop('The Email is Reresent')
        }, 800)
      }
    ).catch(err => this.setState({errors: err.response.data.errors, btnLoader: false}))
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({btnLoader: true})
    const info = {
      email: this.state.email,
      password: this.state.password
    }

    axios.post(apiUrlSignupClient, info).then(
      res => {
        this.setState({
          token: res.data.token,
          errors: [],
          btnLoader: false
        })
        setTimeout(() => {
          this.setState({btnLoader: false})
          this.handleOpenPop('Go to Your Mail For Vertification')
        }, 800)

        setTimeout(() => {
          this.handleRedirect()
        }, 4000)
      }
    ).catch(err =>this.setState({errors: err.response.data.errors}))
  }

  handleRedirect = () => {
    setTimeout(() => {
      this.setState({
        redirect: true
      })
    }, 1000)
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

    // const {redirect} = this.state;
    // if (redirect) {
    //   return <Navigate to="/login1"></Navigate>
    // }

    const {homeRedirect} = this.state;
    if (homeRedirect) {
      alert('You are already logged in')
      return <Navigate to="/"></Navigate>
    }

    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen}/>
        <section className="signup-container">
          {this.state.btnLoader ?
            <div className='d-flex justify-content-center align-items-center min-vh-100 loader'>
              <FadeLoader
                color={'#00818F'}
              />
            </div> : null
          }
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
              <p id="create">Create Your Account</p>
              <p id="text">Lorem ipsum dolor sit amet, consectetur adipiscing</p>

              <div className="center">
                <div className="submit-buttons">
                  <div className="btn-content" >
                    <div>
                      <img src="../imgs/signup1/MB NUM.svg" alt="" />
                    </div>
                    <div>
                      <p className="submit-button">
                        <Link to="/signup2">Continue with Mobile Number</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="divider">
                <p>or Signup with Email Address</p>
              </div>

              <form className="form" id='form'>
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
                <div id="email-label" htmlFor="email">
                  <h6>Email Address<span>&nbsp;*</span></h6>
                  <input id="email" type="text" placeholder="mail@abc.com" required onChange={this.handleChange}/>
                </div>
                <div id="password-label" htmlFor="Password">
                  <h6>Password<span>&nbsp;*</span></h6>
                  <input id="password" type="password" placeholder="**********" required onChange={this.handleChange}/>
                  <span className="show"><img  src="../imgs/signup1/show.svg" alt="" /></span>
                </div>
                <div className="action phone-verification">
                  <p className='phone-verify pointer' onClick={this.handleResendEmailVerification}>
                    Resend Email Verification
                  </p>
                </div>
              </form>

              {/* <form className="submit" onSubmit={this.handleSubmit}> */}
                <button className="submit-button" type="submit" onClick={this.handleSubmit} form='form'>Signup</button>
              {/* </form> */}

              <div className="otherwise">
                <div>Have an account ?</div>
                <div><Link to="/login1">Log in</Link></div>
              </div>
            </div>
          </div>
          </section>
        </Fragment>
    )
  }
}

function mapStateToProps({ loginReducer: loginReducer }) {
  return {
    token: loginReducer.token
  }
}

export default connect(mapStateToProps)(SignUp1)