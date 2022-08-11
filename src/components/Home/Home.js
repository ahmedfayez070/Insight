import React, { Component, Fragment} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'

import axios from 'axios'

import '../../App.css'
import './Home.css'
import './HomeMedia.css'

import { apiUrlLocation, apiUrlCoursesName } from '../../api'

import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Popup from '../popup/Popup'
import {BeatLoader} from 'react-spinners'

class Home extends Component {

  state = {
    governorates: [],
    courses: [],
    loader: false,
    isOpen: false,
    txt: ''
  }

  componentDidMount () {
    axios.get(apiUrlLocation).then(res => {
      this.setState({
        governorates: res.data.data
      })
    }).catch(err => null)

    axios.get(apiUrlCoursesName).then(res => {
      this.setState({
        courses: res.data.data
      })
    }).catch(err => null)

    setTimeout(() => {
      const action1 = {
        type: 'CHANGE_INFO',
        data: {
          governorates: this.state.governorates
        }
      }

      const { dispatch } = this.props;
      dispatch(action1)
    }, 1500)

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 25000)
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

    const { courses } = this.state
    if (courses.length) {
      var coursesList = courses.slice(0, 15).map((course, index) => {        
        return (
          <span key={course.id}>{course.name}</span>
        )
      })
    }
    
    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen} />
        {!this.state.loader ? 
        <Fragment>
          <Header />
            <div className="landing">
              <img src="../imgs/all/Homepage illustration1.svg" alt="" />
            
            {/* <div className="child-image">
              <img src="../imgs/home-page-imgs/child.svg" alt="" />
            </div>    */}
            <div className="written-section">
              <h1>Finding Nurseries is now easier</h1>
              <p>+100 Nurseries in Egypt now at your place to find your most suitable childcare facility</p>
              <button className="browse-nurseries button-white-hover"><Link to="/nurseries">Browse Nurseries</Link></button>
            </div>
          </div>

          <div className="how-it-works">
            <div className="container">
              <div className="top">
                <h2>step by step</h2>
                <div>
                  <h3>How It Works</h3>
                  <p>As easy as scrolling your Facebook timeline, scroll and find the best nursery for your child’s first educational year.</p>
                </div>
              </div>
              <div className="sections">
                <div className="container">
                  <div className="row">
                    <div className="cards col-6 col-lg-3">
                      <img src="../imgs/home-page-imgs/search.svg" alt=""/>
                      <h3>search</h3>
                      <p>The characteristics required in your nursery.</p>
                    </div>
                    <div className="cards col-6 col-lg-3">
                      <img src="../imgs/home-page-imgs/choose.svg" alt=""/>
                      <h3>choose</h3>
                      <p>The one that best meet your requirements.</p>
                    </div>
                    <div className="cards col-6 col-lg-3">
                      <img src="../imgs/home-page-imgs/confirm.svg" alt=""/>
                      <h3>confirm</h3>
                      <p>Your reservation to make sure that your child will be a part of it.</p>
                    </div>
                    <div className="cards col-6 col-lg-3">
                      <img src="../imgs/home-page-imgs/track.svg" alt=""/>
                      <h3>track</h3>
                      <p>Your requests and children’s progress through the dashboard</p>
                    </div>
                  </div>
                </div>
            
              </div>
            </div>
          </div>

          <div className="suggested-searches">
              <div className="container">
                <h3>suggested searches</h3>
                <div className="row">
                  <div className="icons col">
                    {coursesList}
                  </div>
                  <div className="discription col">
                    <h3>Choose Your Preferences</h3>
                    <p>Easily find nurseries with your own Preferences now by enhancing parent’s ability to gain knowledge about nurseries depending on the topics they care most based on predefined searches.</p>
                  </div>
                </div>
            </div>
          </div>

          <div className="browse-activities">
            <div className="container">
              <div className="row">
                <div className="discription col">
                  <h2>Preferred Activities?</h2>
                  <p>
                    Find nurseries now based on your child’s preferred activities 
                  </p>
                  <button className='button-green-hover'><Link to="/browse-activities">Browse Activities</Link></button>
                </div>
                <div className='browse-activities-img col'>
                  <img src="../imgs/home-page-imgs/activity.svg" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="what-they-say">
            <div className="container">
              <div className="directions">
                {/* <ul>
                  <li><a href=""><img src="../imgs/home-page-imgs/left.svg" alt=""/></a></li>
                  <li className="right"><a href=""><img src="../imgs/home-page-imgs/right.svg" alt=""/></a></li>
                </ul> */}
              </div>
              <div className="row content">
                <div className="personal-card col">
                  <img src="../imgs/home-page-imgs/Avatar.svg" alt=""/>
                  <p>I saved a lot of time searching nurseries but Insight helped me</p>
                  <div className="line"></div>
                  <h4>Yousef Saleh</h4>
                </div>
                <div className="personal-card col">
                  <img src="../imgs/home-page-imgs/Avatar.svg" alt=""/>
                  <p>Love visiting this web site to find the best nursery for my kids</p>
                  <div className="line"></div>
                  <h4>Ahmed Farag</h4>
                </div>
                <div className="text col">
                  <h2>What they say</h2>
                  <h5>Our Customer’s Reviews</h5>
                  <p>See what Insight’s customers say about their experience with us</p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </Fragment>
        :
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
          <BeatLoader
            color={'#00818F'}
          />
        </div>}
      </Fragment>
    )
  }
}

function mapStateToProps({ infoReducer: state }) {
  return {
    governorates: state.governorates
  }
}

export default connect(mapStateToProps)(Home)