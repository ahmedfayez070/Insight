import React, { Component, Fragment } from 'react'
import './Footer.css'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Popup from '../popup/Popup'

class Footer extends Component {

  state = {
    token: '',
    type: '',
    isOpen: false,
    txt: ''
  }

  componentDidMount() {window.scrollTo(0, 0);
    this.setState({
      token: this.props.token
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
    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen}/>
        <div className="footer">
          <div className="container">
            <div className="row">
              <div className='logo col-12 col-lg-5'>
                <h2>
                  <Link to="/">
                    <img src='../imgs/all/white logo.svg' />
                  </Link>
                </h2>
                <p>Copyright @ company. All Rights Reserved</p>
              </div>
              <div className="footer-lists col-12 col-lg-7">
                <div className="row">
                  <ul className="first col list">
                    <li className="title">MENU</li>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/nurseries">Nurseries</Link></li>
                    {
                      this.props.token ? '' :
                      <Fragment>
                        <li><Link to="/signup1">Sign up</Link></li>
                        <li><Link to="/login1">Log in</Link></li>
                      </Fragment>
                    }
                  </ul>
                  {/* <ul className="col list">
                    <li className="title">Company</li>
                    <li><Link to="">About us</Link></li>
                    <li><Link to="">Our Values</Link></li>
                    <li><Link to="">How it works</Link></li>
                  </ul> */}
                  {this.props.token ? '' :
                    <Fragment>
                      <ul className="col list">
                        <li className="title">Nursery</li>
                        <li><Link to="/provider-signup1">Sign up</Link></li>
                        <li><Link to="/provider-login1">Log in</Link></li>
                      </ul>
                    </Fragment>
                  }
                  {/* <ul className="col list">
                    <li className="title">SUPPORT</li>
                    <li><Link to="/">Contact us</Link></li>
                    <li><Link to="/provider-nursery-res-acc">Privacy policy</Link></li>
                    <li><Link to="/provider-reservation-req">Site map</Link></li>
                  </ul> */}
                  <ul className="col list">
                    <li className="title">Follow us</li>
                    <div className="icons">
                      <li><a href=""><img className="logos" src="../imgs/home-page-imgs/facebook.svg" alt=""/></a></li>
                      <li><a href=""><img className="logos" src="../imgs/home-page-imgs/insta.svg" alt=""/></a></li>
                      <li><a href=""><img className="logos" src="../imgs/home-page-imgs/linkedIn.svg" alt=""/></a></li>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps)(Footer)