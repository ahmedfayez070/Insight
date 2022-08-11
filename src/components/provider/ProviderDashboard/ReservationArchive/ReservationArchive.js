import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './ReservationArchive.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlProviderArchiveReservations, apiUrlRestoreFromReservationsArchive } from '../../../../api'

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

class ProviderReservationsArchive extends Component {

  state = {
    reservations: [],
    token: '',
    nurseryId: '',
    loader: true,
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlProviderArchiveReservations + '?nursery_id=' + this.props.nurseryId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        token: this.props.token,
        reservations: res.data.data.data != null ? res.data.data.data : [],
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

  handleRestore = (id) => {
    axios.get(apiUrlRestoreFromReservationsArchive + id + 'nersery_id=' + this.state.nurseryId, { headers: { Authorization: 'Bearer ' + this.props.token } })
  }

  // handleDeleteReservation = (id) => {
  //   try {
  //     axios.post(apiUrlProviderCancelReservation + '/' + id, { client_end: 1, _method: 'put' }, { headers: { Authorization: 'Bearer ' + this.state.token } }).then();
  //     this.handleOpenPop('Your cancellation is done');
  //   } catch(err) {
  //     this.handleOpenPop(err);
  //   }
  //   setTimeout(() => {
  //     axios.get(apiUrlProviderReservations, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
  //       this.setState({
  //         reservations: res.data.reservations
  //       })
  //     })
  //   }, 500)
  // }

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
        maxWidth: 150,
        hideable: false
      },
      {
        field: 'child_name',
        headerName: 'name',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'status',
        headerName: 'Status',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'created_at',
        headerName: 'Created At',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'type',
        headerName: 'Plan',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'start_date',
        headerName: 'Start Date',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'price',
        headerName: 'Price',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'action',
        headerName: 'Permenant Delete',
        maxWidth: 150,
        editable: false,
        sortable: false,
        hideable: false,
        renderCell: (params) => (
          <strong>
            <img src="../../../imgs/all/delete.svg" alt="" className='pointer ml-3'
              onClick={() => this.handleDeleteReservation(params.row.id)} />
          </strong>
        ),
      },
      // {
      //   field: 'restore',
      //   headerName: 'Restore',
      //   maxWidth: 250,
      //   editable: false,
      //   sortable: false,
      //   hideable: false,
      //   renderCell: (params) => (
      //     <strong>
      //       <img src='../../../imgs/all/restore.svg' alt='' onClick={() => this.handleRestore(params.row.id)}/>
      //     </strong>
      //   ),
      // },
    ];

    const rows = [...this.state.reservations];

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
                <Link to="/">Home</Link> / <Link to="/provider-reservations-archive">
                  Reservations Archive
                </Link>
              </p>
            </div>

            <div className='d-flex justify-content-end'>
              <div className="all-archive archive">
                <Link to="/provider-reservations">
                  <img src="../../../imgs/all/all reservations archive.svg" alt="" />
                  <span>All Reservations</span>
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
                          <p>Reservations Archive</p>
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

export default connect(mapStateToProps)(ProviderReservationsArchive)