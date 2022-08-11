import React, { Component, Fragment } from 'react'

import axios from 'axios'

import './ClientSubscriptions.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlChildShowSubscriptions } from '../../../api'

import $ from 'jquery'

import ClientNavbar from '../ClientNavbar/ClientNavbar'
import ClientSideBar from '../ClientSideBar/ClientSideBar'
import Popup from '../../popup/Popup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import {BeatLoader} from 'react-spinners'

class ClientSubscriptions extends Component {

  state = {
    subscriptions: [],
    token: '',
    loader: true,
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlChildShowSubscriptions + this.props.childId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        token: this.props.token,
        subscriptions: res.data.subscriptions ?? [],
        loader: false
      })
    })

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
        field: 'reservation_id',
        headerName: 'ID',
        maxWidth: 400,
        hideable: false
      },
      {
        field: 'child_name',
        headerName: 'name',
        maxWidth: 400,
        editable: false,
        hideable: false
      },
      {
        field: 'status',
        headerName: 'Payment Status',
        maxWidth: 400,
        editable: false,
        hideable: false
      },
      {
        field: 'start_date',
        headerName: 'Start Date',
        maxWidth: 400,
        editable: false,
        hideable: false
      },
      {
        field: 'due_date',
        headerName: 'Due Date',
        maxWidth: 400,
        editable: false,
        hideable: false
      },
      {
        field: 'payment_method',
        headerName: 'Payment Method',
        maxWidth: 400,
        editable: false,
        hideable: false
      },
      {
        field: 'payment_date',
        headerName: 'Payment Date',
        maxWidth: 400,
        editable: false,
        hideable: false
      },
      {
        field: 'created_at',
        headerName: 'Created At',
        maxWidth: 400,
        editable: false,
        sortable: false,
        hideable: false,
      },
      // {
      //   field: 'action',
      //   headerName: 'Action',
      //   maxWidth: 180,
      //   editable: false,
      //   sortable: false,
      //   hideable: false,
      //   renderCell: (params) => (
      //   <strong>
      //     <Button
      //       variant="contained"
      //       style={{
      //         color: '#00818f',
      //         padding: '6px 10px 4px',
      //         border: '2px solid #00818f',
      //         borderRadius: '16px',
      //         backgroundColor: ' #fff'
      //       }}
      //       onClick={() => this.handleSubscriptionCancelation(params.row.id)}
      //     >cancel</Button>
      //   </strong>
      //   ),
      // },
    ];

    // const rows = [
    //   { id: 1, name: 'Snow', status: 'Jon', start_date: 35, due_date: 1, payment_method: 'Snow', payment_data: 'Jon', reservation_id: 35, created_at: 35},
    //   { id: 2, name: 'Lannister', status: 'Cersei', start_date: 42, due_date: 1, payment_method: 'Snow', payment_data: 'Jon', reservation_id: 35, created_at: 35},
    //   { id: 3, name: 'Lannister', status: 'Jaime', start_date: 45, due_date: 1, payment_method: 'Snow', payment_data: 'Jon', reservation_id: 35, created_at: 35},
    //   { id: 4, name: 'Stark', status: 'Arya', start_date: 16, due_date: 1, payment_method: 'Snow', payment_data: 'Jon', reservation_id: 35, created_at: 35}
    // ];

    // if (this.state.subscriptions.length) {
    //   var rows = [...this.state.subscriptions]
    // } else {
    //   var rows = []
    // }

    const rows = [...this.state.subscriptions]
    
    const path = window.location.pathname.slice(1)
    
    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen} />
        {!this.state.loader ? 
        <section className="profile-container">
          <ClientSideBar path={path} />

          <div className="profile-content">
            
            <ClientNavbar />

            <div className="profile-nav-menu">
              <p>
                <Link to="/">Home</Link> / <Link to="/client-subscriptions">
                  My Subscriptions
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
                          <p>All Subscriptions</p>
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

function mapStateToProps({ loginReducer, childReducer }) {
  return {
    token: loginReducer.token,
    childName: childReducer.childName,
    childId: childReducer.childId
  }
}

export default connect(mapStateToProps)(ClientSubscriptions)