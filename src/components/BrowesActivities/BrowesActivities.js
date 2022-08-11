import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import { apiUrlActivities } from '../../api'
import $ from 'jquery'

import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Popup from '../popup/Popup'

import { BeatLoader } from 'react-spinners'

class BrowseActivities extends Component {

  state = {
    activities: [],
    links: [],
    acivityName: '',
    total: '',
    numberOfPages: '',
    previousPageUrl: '',
    currentPageUrl: '',
    nextPageUrl: '',
    previousPage: '',
    index: 0,
    isOpen: false,
    txt: '',
    loader: true,
    errors: []
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const allApi = apiUrlActivities

    axios.get(allApi).then(res => {
      this.setState({
        activities: res.data.data.data,
        links: res.data.data.pagination.links,
        total: res.data.data.pagination.total,
        numberOfPages: res.data.data.pagination.numberOfPages,
        previousPageUrl: res.data.data.pagination.previousPageUrl,
        currentPageUrl: res.data.data.pagination.currentPageUrl,
        nextPageUrl: res.data.data.pagination.nextPageUrl,
        loader:false
      })
    }).catch(err => this.handleOpenPop('page not found'))

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 15000)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    axios.get(apiUrlActivities + '&name=' + this.state.courseName)
      .then(res => {
      this.setState({
        activities: res.data.data.data,
        links: res.data.data.pagination.links,
        total: res.data.data.pagination.total,
        numberOfPages: res.data.data.pagination.numberOfPages,
        previousPageUrl: res.data.data.pagination.previousPageUrl,
        currentPageUrl: res.data.data.pagination.currentPageUrl,
        nextPageUrl: res.data.data.pagination.nextPageUrl,
      })
    }).catch(err => this.handleOpenPop('Page not found'))
  }

  handlePagination = (i) => {
    window.scrollTo(0, 0);
    if (i < 0 || i >= this.state.numberOfPages) {
      return false
    } else {
      const newIndex = i + 1
      this.setState({
        index: i,
        previousPage: '&page=' + newIndex
      })
      axios.get(this.state.links[i] + '&max_count=' + this.state.maxCount + '&name=' + this.state.courseName).then(res => {
        this.setState({
          activities: res.data.data.data,
          links: res.data.data.pagination.links,
          total: res.data.data.pagination.total,
          numberOfPages: res.data.data.pagination.numberOfPages,
          previousPageUrl: res.data.data.pagination.previousPageUrl,
          currentPageUrl: res.data.data.pagination.currentPageUrl,
          nextPageUrl: res.data.data.pagination.nextPageUrl,
        })
      }).catch(err => console.log(err))
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

    if (this.state.activities.length) {
      const { activities } = this.state
      var activitiesList = activities.map((activity) => {
        return (
          <div className="card col-md-3" key={activity.id}>
            <img src={activity.profile_image ?? "../imgs/all/test.jpg"} className="card-img-top" alt=""/>
            <div className="card-body">
              <p className="card-text">{activity.name}</p>
            </div>
          </div>
        )
      })
    }

    const array = Array.from({length: this.state.numberOfPages}, (v, i) => i)
    const paginatonBullets = array.map((i) => {
      return (
        <li onClick={() => this.handlePagination(i)} key={i + 1} title={i + 1} id={i} className={(i == 0 ? 'active' : '')}>
          <span className="num">{i + 1}</span>
        </li>
      )
    })

    const firstPagination = document.getElementById('1')

    if (firstPagination) {
      firstPagination.classList.add('active')
    }

    document.querySelectorAll('.pagination-bullets .navigate li').forEach((e) => {
      if (e.id == this.state.index) {
        $(e).siblings().removeClass('active')
        e.classList.add('active')
      }
    })

    return (
      <Fragment>
        {!this.state.loader ?
        <Fragment>
          <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen}/>
          <Header />
          <div className="nav-menu">
            <p>
              <Link to="/">Home</Link> / <Link to="/browse-activities">Activities</Link>
            </p>
          </div>

          <section className="search-courses">
            <div className="container">
              <form className="search-bar-courses">
                <input className="input-text" type="text" placeholder="What are you looking for?" onChange={this.handleChange} id ='acivityName'/>
                <button className="search-bar-item item-search" >
                  <img src="../imgs/browse-courses/search.svg" alt="" />
                  <span className="search-button">SEARCH</span>
                </button>
              </form>
            </div>
          </section>
{/* onClick={this.handleSubmit} */}
          <div id="container" className="container">
            <div className="row courses">
              {activitiesList}
            </div>
            <div className="pagination-bullets">
                <ul className="navigate">
                  <li onClick={() => this.handlePagination(0)} id='a'>
                    <span>
                      <img className="direction" src="../imgs/browse-nurseries-imgs/first.svg" alt="" />
                    </span>
                  </li>
                  <li onClick={() => this.handlePagination((this.state.index - 1))} id='aa'>
                    <span>
                      <img className="direction" src="../imgs/browse-nurseries-imgs/before.svg" alt="" />
                    </span>
                  </li>
                  {paginatonBullets}
                  <li onClick={() => this.handlePagination((this.state.index + 1))} id='aaa'>
                    <span>
                      <img className="direction" src="../imgs/browse-nurseries-imgs/after.svg" alt="" />
                    </span>
                  </li>
                  <li onClick={() => this.handlePagination((this.state.numberOfPages - 1))} id='aaaa'>
                    <span>
                      <img className="direction" src="../imgs/browse-nurseries-imgs/last.svg" alt="" />
                    </span>
                  </li>
                </ul>
              </div>
          </div>
          <Footer />
        </Fragment>
        :
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

export default BrowseActivities