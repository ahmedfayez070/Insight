import React, { Component, Fragment } from 'react'

import { Link, Navigate } from 'react-router-dom'

import { apiUrlSignupProvider } from '../../../api'

import axios from 'axios'
import { connect } from 'react-redux'

import Popup from '../../popup/Popup'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { FadeLoader } from 'react-spinners'

class ProviderSignup2 extends Component {

  state = {
    phoneNumber: '',
    password: '',
    num: '',
    token: '',
    redirect: false,
    homeRedirect: false,
    errors: [],
    btnLoader: false,
    isOpen: false,
    txt: ''
  }

  componentDidMount() {window.scrollTo(0, 0);
    this.props.token ? this.setState({homeRedirect: true}) : this.setState({homeRedirect: false})
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })

    setTimeout(() => {
      this.handleNumber()
    }, 1000)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({btnLoader: true})
    const info = {
      phone: this.state.num,
      password: this.state.password
    }

    axios.post(apiUrlSignupProvider, info).then(
      res => {
        this.setState({
          token: res.data.token,
          errors: [],
        })
      }
    ).catch(err => this.setState({errors: err.response.data.errors, btnLoader: false}))

    const action = {
      type: 'CHANGE_PHONE_NUMBER',
      data: this.state.num
    }

    const { dispatch } = this.props;
    dispatch(action)

    setTimeout(() => {
      this.setState({btnLoader: false})
      this.handleOpenPop('You need to verify your phone')
      this.handle()
    }, 800)

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

  handle = () => {
    const action = {
      type: 'CHANGE_LOGIN_TOKEN_PROVIDER',
      data: this.state.token
    }

    const { dispatch } = this.props;
    dispatch(action)
  }

  handleNumber = () => {
    // adding +2
    let num = ['+2']
    let { phoneNumber } = this.state
    phoneNumber = phoneNumber.split()
    num = num.concat(phoneNumber).join('')
    this.setState({num})
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
      return <Navigate to="/phone-verification"></Navigate>
    }

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
            <img src="../../imgs/providerlogin/Provider illustrator.svg" alt="" />
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
                        <img src="../imgs/signup1/Email.svg" alt="" />
                      </div>
                      <div>
                        <p className="submit-button">
                          <Link to='/provider-signup1'>Continue with Email Address</Link>
                        </p>
                      </div>
                  </div>
                </div>
              </div>

              <div className="divider">
                <p>or Signup with Mobile Number</p>
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
                <div id="phone-label" htmlFor="phone number">
                  <h6>Phone Number<span>&nbsp;*</span></h6>
                  <input id="phoneNumber" type="text" placeholder="01234567890" required onChange={this.handleChange}/>
                </div>
                <div id="password-label" htmlFor="Password">
                  <h6>Password<span>&nbsp;*</span></h6>
                  <input id="password" type="password" placeholder="**********" required onChange={this.handleChange}/>
                  <span className="show">
                    <img  src="../imgs/signup1/show.svg" alt="" />
                  </span>
                </div>
                <div className="action phone-verification">
                  <Link to='/phone-verification' className='phone-verify pointer' onClick={this.handle}>
                    Verify Your Phone
                  </Link>
                </div>
              </form>

              {/* <form className="submit" onSubmit={this.handleSubmit}> */}
                <button className="submit-button" type="submit"  onClick={this.handleSubmit} form='form'>Signup</button>
              {/* </form> */}

              <div className="otherwise">
                <div>Have an account ?</div>
                <div><Link to="/provider-login1">Log in</Link></div>
              </div>
            </div>
          </div>

        </section>
      </Fragment>
    )
  }
}

function mapStateToProps(
  { loginReducer: loginReducer, phoneNumberReducer: phoneNumberReducer }) {
  return {
    token: loginReducer.token,
    phoneNumber: phoneNumberReducer.phoneNumber,
  }
}

export default connect(mapStateToProps)(ProviderSignup2)