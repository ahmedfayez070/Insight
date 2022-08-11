import React, { Component, Fragment } from 'react'

import { Link, Navigate } from 'react-router-dom'

import './LogIn1.css'
import { apiUrlLoginClient, apiUrlForgetClient, apiUrlCheckUserFirstTime, apiUrlSetUserFirstTime, apiUrlGoogleClient } from '../../api'
import axios from 'axios'
import { connect } from 'react-redux'
import {GoogleLogin} from 'react-google-login'

import Popup from '../popup/Popup'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { FadeLoader } from 'react-spinners'

class LogIn1 extends Component {

  state = {
    token: '',
    email: '',
    password: '',
    clientFirstData: '',
    redirect: false,
    homeRedirect: false,
    googleLogin: false,
    btnLoader: false,
    type: '',
    isOpen: false,
    txt: '',
    errors: [],
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.token ? this.setState({homeRedirect: true}) : this.setState({homeRedirect: false})
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({btnLoader: true})
    const info = {
      email: this.state.email,
      password: this.state.password
    }

    axios.post(apiUrlLoginClient, info)
      .then(res => {
      this.setState({
        token: res.data.token,
        type: res.data.type,
        errors: []
      })
      }).catch(
        err => this.setState({errors: err.response.data.errors})
      )

    // console.log(err.response.data.errors.email.flat(5))
    // err.response.data.errors

    setTimeout(() => {
      if (this.state.token) {
        this.handleReducer(this.state.token)
      }
    }, 1000)
  }

  handleReducer = (token) => {
    const action = {
      type: 'CHANGE_LOGIN_TOKEN',
      data: [this.state.token, this.state.type]
    }

    const { dispatch } = this.props;
    dispatch(action)

    axios.get(apiUrlCheckUserFirstTime, { headers: { Authorization: 'Bearer ' + token } })
      .then(res => {
      this.setState({
        clientFirstData: res.data.data
      })
    }).catch(err => null)

    setTimeout(() => {
      if (this.state.clientFirstData == '1') {
        axios.post(apiUrlSetUserFirstTime, {}, { headers: {Authorization: 'Bearer ' + this.state.token} }).then().catch(err => null)
      }
      this.setState({
        btnLoader: false
      })
      this.handleOpenPop('You are loged in successfully')
    }, 1000)

    setTimeout(() => {
      this.handleRedirect()
    }, 4000)
  }

  handleRedirect = () => {
    setTimeout(() => {
      this.setState({
        redirect: true
      })
    }, 1000)
  }

  handleGoogleLogin = () => {
    this.setState({
      googleLogin: true
    })
  }

  onSuccess = (res) => {
    this.setState({btnLoader: true})
    axios.post(apiUrlGoogleClient, { token: res.accessToken }).then(res => {
      this.setState({
        token: res.data.token,
        type: 'client',
        errors: []
      })
    }).catch(err =>
    {
      this.setState({btnLoader: false})
      this.handleOpenPop('Error login with google')
    })
    setTimeout(() => {
      console.log(this.state.token);
      if (this.state.token) {
        this.handleReducer(this.state.token)
      }
    }, 5000)
  }

  onFailure = () => {
    this.handleOpenPop('Error login with google')
  }

  handleForgetPass = () => {
    axios.get(apiUrlForgetClient).then().catch(err => this.setState({errors: err.response.data.errors}))
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

    const {homeRedirect} = this.state;
    if (homeRedirect) {
      alert('You are already logged in')
      return <Navigate to="/"></Navigate>
    }

    const {redirect} = this.state;
    if (redirect) {
      if (this.state.clientFirstData == '1') {
        return <Navigate to="/client-register2"></Navigate>
      } else {
        return <Navigate to="/client-dashboard"></Navigate>
      }
    }

    const clientId = '388114694427-l6mvh5s9ovjddrhdcdnq7514ltjhg5pf.apps.googleusercontent.com'

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
        <section className="login-container">
          <div className="login-image">
            <img src="../imgs/login2/Illustration.svg" alt="" />
            <div className="description-text">
              <p>Get  the Fastest childcare Facility Regestrasion </p>
              <p>Start for free and get attractive offers </p>
            </div>
          </div>

          <div className="login-ways">
            <div className="login-form">
              <Link to="/" className='wh' id="logo">
                <img src='../imgs/all/dashboard logo.svg' />
              </Link>
              <p id="welcome">WELCOME BACK</p>
              <p id="login-to">Login to Your Account</p>
              <p id="text">see What is going on with your requests</p>

              <div className="center">
                <div className="submit-buttons">
                  <div className="btn-content">
                    <div>
                      <img src="../imgs/login2/MB NUM.svg" alt="" />
                    </div>
                    <div>
                      <p className="submit-button">
                        <Link to='/login2'>Continue with Mobile Number</Link>
                      </p>
                    </div>
                  </div>
                  {/* <div className="btn-content">
                    <div>
                      <img src="../imgs/login2/Facebook.svg" alt="" /> 
                    </div>
                    <div>
                      <p className="submit-button" onClick={this.handleFacebook}>Continue with Facebook</p>
                    </div>
                  </div> */}
                  <div className="btn-content">
                    {/* <div>
                      <img src="../imgs/login2/Gmail.svg" alt="" />
                    </div> */}
                    {/* <div> */}
                      {/* <p className="submit-button" onClick={this.handleGoogle}>Continue with Google</p> */}
                      <GoogleLogin
                        clientId={clientId}
                        buttonText="Continue with Google"
                        onSuccess={this.onSuccess}
                        onFailure={this.onFailure}
                        // cookie Policy={'single_host_origin'}
                        style={{marginTop:'100px'}}
                        isSignedIn={this.state.googleLogin}
                        onClick={this.handleGoogleLogin}
                        className = 'google-btn'
                      />
                    {/* </div> */}
                  </div>
                </div>
              </div>
                
              <div className="divider">
                <p>or Login with Email Address</p>
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
                  <span className="show">
                    <img src="../imgs/login2/show.svg" alt="" />
                  </span>
                </div>
              </form>

              <div className="action">
                {/* <div className='remember-me'>
                  <input type="checkbox" id='remember2'/>
                  <label htmlFor="remember2">remember me</label>
                </div> */}
                <div><a href="http://localhost:8000/client/forgot-password/email" target="_blank">Forget Password?</a></div>
                {/* <div><span onClick={this.handleForgetPass}>Forget Password?</span></div> */}
              </div>

              {/* <form className="submit" > */}
                <button className="submit-button" type="submit" onClick={this.handleSubmit} form='form'>LogIn</button>
              {/* </form> */}

              <div className="otherwise">
                <div>Not Registered Yet? </div>
                <div><Link to="/signup1">Sign up</Link></div>
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
    token: loginReducer.token,
    type: loginReducer.type,
  }
}

export default connect(mapStateToProps)(LogIn1)