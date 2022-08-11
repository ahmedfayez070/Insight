import React, { Component, Fragment } from 'react'

import axios from 'axios'

import './ClientReservations.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlChildShowReservations, apiUrlClientCancelReservation } from '../../../api'

import $ from 'jquery'

import ClientNavbar from '../ClientNavbar/ClientNavbar'
import ClientSideBar from '../ClientSideBar/ClientSideBar'
import Popup from '../../popup/Popup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import {BeatLoader, FadeLoader} from 'react-spinners'

class ClientReservations extends Component {

  state = {
    reservationId: '',
    reservations: [],
    childName: '',
    token: '',
    btnLoader: false,
    isOpen: false,
    txt: '',
    loader: true
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    console.log(this.props.childId);
    axios.get(apiUrlChildShowReservations + this.props.childId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        token: this.props.token,
        childName: this.props.childName,
        reservations: res.data.reservation,
        loader: false
      })
    }).catch(err => console.log(err))

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 25000)
  }

  handleReservationCancelation = (id) => {
    this.setState({btnLoader: true})
    axios.post(apiUrlClientCancelReservation + '/' + id, { client_end: 1, _method: 'put' }, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(
      this.setState({btnLoader: false}),
      this.handleOpenPop('Your cancellation is done')
    ).catch(err => null);
    
    setTimeout(() => {
      axios.get(apiUrlChildShowReservations, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
        this.setState({
          reservations: res.data.reservation
        })
      })
    }, 500)
  }

  handleShowReservation = (id) => {
    const action = {
      type: 'CHANGE_RESERVATION_ID',
      data: id
    }

    const { dispatch } = this.props;
    dispatch(action)

    this.setState({
      reservationId: id
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

    const { reservationId } = this.state
    if (reservationId) {
      return(<Navigate to="/client-nursery-res-acc"></Navigate>)
    }

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
        field: 'nursery_id',
        headerName: 'Nursery Id',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'Child Name',
        headerName: 'Child Name',
        editable: false,
        maxWidth: 160,
        valueGetter: (params) =>
          `${params.row.child.name || ''}`,
      },
      // {
      //   field: 'child_name',
      //   headerName: 'Child Name',
      //   maxWidth: 150,
      //   editable: false,
      //   hideable: false
      // },
      {
        field: 'status',
        headerName: 'Status',
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
        field: 'reservation_start_date',
        headerName: 'Start date',
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
        headerName: 'Action',
        maxWidth: 200,
        editable: false,
        sortable: false,
        hideable: false,
        renderCell: (params) => (
          <strong>
            {params.row.status == 'pending' ? 
            <Button
              variant="contained"
              style={{
                color: '#00818f',
                padding: '6px 10px 4px',
                border: '2px solid #00818f',
                borderRadius: '16px',
                backgroundColor: ' #fff'
              }}
              onClick={() => this.handleReservationCancelation(params.row.id)}
            >cancel</Button> : null}
            {params.row.status == 'accept' ? 
            <Button
              variant="contained"
              style={{
                color: '#00818f',
                padding: '6px 10px 4px',
                border: '2px solid #00818f',
                borderRadius: '16px',
                backgroundColor: ' #fff'
              }}
              onClick={() => this.handleShowReservation(params.row.id)}
            >Pay</Button> : null}
            {params.row.status == 'reject' && params.row.providr_end == 'not_ended' ? 
            <Button
              variant="contained"
              style={{
                color: '#00818f',
                padding: '6px 10px 4px',
                border: '2px solid #00818f',
                borderRadius: '16px',
                backgroundColor: ' #fff'
              }}
              onClick={() => this.handleReservationCancelation(params.row.id)}
            >cancel</Button> : '-'}
          </strong>
        ),
      },
    ];

    const rows = [...this.state.reservations];
    
    const path = window.location.pathname.slice(1)

    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen} />
        {!this.state.loader ? 
          <section className="profile-container">
            {this.state.btnLoader ?
              <div className='d-flex justify-content-center align-items-center min-vh-100 loader'>
                <FadeLoader
                  color={'#00818F'}
                />
              </div> : null
            }
          <ClientSideBar path={path} />

          <div className="profile-content">
            
            <ClientNavbar />

            <Fragment>
              <div className="profile-nav-menu">
                <p>
                  <Link to="/">Home</Link> / <Link to="/client-reservations">
                    My Reservations
                  </Link>
                </p>
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
                            <p>All Reservations</p>
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
            </Fragment>              
            
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

function mapStateToProps({ loginReducer, childReducer }) {
  return {
    token: loginReducer.token,
    childName: childReducer.childName,
    childId: childReducer.childId,
  }
}

export default connect(mapStateToProps)(ClientReservations)