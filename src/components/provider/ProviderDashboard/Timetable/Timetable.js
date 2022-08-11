import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './Timetable.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlProviderTimetables, apiUrlStoreInTimetablesArchive } from '../../../../api'

import $ from 'jquery'

import ProviderNavbar from '../ProviderNavbar/ProviderNavbar'
import Popup from '../../../popup/Popup'
import {BeatLoader} from 'react-spinners'
import ProviderSidebar from '../ProviderSidebar/ProviderSidebar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

class ProviderTimetable extends Component {

  state = {
    timetable: [],
    loader: true,
    token: '',
    nurseryId: '',
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlProviderTimetables + '?nursery_id=' + this.props.nurseryId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        token: this.props.token,
        timetable: res.data.data.data != null ? res.data.data.data : [],
        nurseryId: this.props.nurseryId,
        loader: false
      })
    })

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 25000)
  }

  handleArchive = (id) => {
    axios.get(apiUrlStoreInTimetablesArchive + id, { headers: { Authorization: 'Bearer ' + this.props.token } })
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

    let gearContainer = document.querySelector('.slide-menu .gear-container')
    const navDetails = document.getElementById('nav-details')
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

    if (ProfileNavMenu) {
      ProfileNavMenu.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({left:"-200px"}, 300)
        }
      }
    }

    const columns = [
      {
        field: 'id',
        headerName: 'ID',
        maxWidth: 250,
        hideable: false
      },
      {
        field: 'name',
        headerName: 'name',
        maxWidth: 250,
        editable: false,
        hideable: false
      },
      {
        field: 'update',
        headerName: 'Update',
        maxWidth: 250,
        editable: false,
        sortable: false,
        hideable: false,
        renderCell: (params) => (
          <strong>
            <img src='../../../imgs/all/update.svg' alt='' />
          </strong>
        ),
      },
      {
        field: 'archive',
        headerName: 'Archive',
        maxWidth: 250,
        editable: false,
        sortable: false,
        hideable: false,
        renderCell: (params) => (
          <strong>
            <img src='../../../imgs/all/archive.svg' alt='' onClick={() => this.handleArchive(params.row.id)}/>
          </strong>
        ),
      },
    ];

    const rows = [...this.state.timetable];

    const path = window.location.pathname.slice(1)
    
    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen} />
        {!this.state.loader ? 
        <section className="profile-container">
          <ProviderSidebar path={path} />

          <div className="profile-content">
            
            <ProviderNavbar />

            <div className="profile-nav-menu">
              <p>
                <Link to="/">Home</Link> / <Link to="/provider-timetable">
                  Timetable
                </Link>
              </p>
            </div>

            <div className='d-flex justify-content-end'>
              <div className="all-archive archive mr">
                <Link to="/provider-add-timetable">
                  <img src="../../../imgs/all/add timetable.svg" alt="" />
                  <span>Add Timetable</span>
                </Link>
              </div>

              <div className="archive">
                <Link to="/provider-timetable-archive">
                  <img src="../../../imgs/all/archive.svg" alt="" />
                  <span>Archive</span>
                </Link>
              </div>
            </div>

            

            <div className="container tabs-container update">
              <div className="align-items-start">
                <div className="tab-content update" id="v-pills-tabContent">
                  <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                    <div className="tab-content update tabs-content" id="nav-tabContent">
                      <div className="tab-pane fade show active" 
                        id="nav-details" role="tabpanel" 
                        aria-labelledby="nav-details-tab">
                        <div className="tab-content-header">
                          <p>Timetable</p>
                        </div>
                        <div className="row">
                          <div className="col-12 pending-reservations">
                            <Box sx={{ minHeight: 150, width: '100%' }}>
                              <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={7}
                                rowsPerPageOptions={[7]}
                                disableSelectionOnClick
                                autoHeight
                              />
                            </Box>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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

function mapStateToProps(
  { loginReducer, providerReducer }) {
  return {
    token: loginReducer.token,
    nurseryId: providerReducer.nurseryId,
    nurseryName: providerReducer.nurseryName
  }
}

export default connect(mapStateToProps)(ProviderTimetable)