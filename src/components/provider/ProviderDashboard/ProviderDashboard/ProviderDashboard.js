import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './ProviderDashboard.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'

import { apiUrlShowProvider, apiUrlProviderDashboard, apiUrlProviderCancelReservation} from '../../../../api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

import UpdatedPopup from '../../../UpdatedPpopup/UpdatedPopup'
import Popup from '../../../popup/Popup'

import {BeatLoader, FadeLoader} from 'react-spinners'
import ProviderNavbar from '../ProviderNavbar/ProviderNavbar'
import ProviderSidebar from '../ProviderSidebar/ProviderSidebar'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

class ProviderDashboard extends Component {

  state = {
    nurseries: [],
    nurseryId: '',
    nurseryName: '',
    totalReservations: '',
    totalSubscriptions: '',
    totalChildren: '',
    totalViews: '',
    reservations: [],
    subscriptions: [],
    isOpen: false,
    isOpen2: false,
    btnLoader: false,
    txt: '',
    loader: true,
    reservationId: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlShowProvider, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        token: this.props.token,
        nurseries: res.data.data.nurseries != null ? res.data.data.nurseries : [],
        nurseryId: res.data.data.nurseries != null ? res.data.data.nurseries[0].id : '',
        nurseryName: res.data.data.nurseries != null ? res.data.data.nurseries[0].name : '',
      })

      if (res.data.data.nurseries.length) {
        const action1 = {
          type: 'CHANGE_PROVIDER_NURSERY_ID',
          data: [res.data.data.nurseries[0].id, res.data.data.nurseries[0].name]
        }

        const { dispatch } = this.props;
        dispatch(action1)

        axios.get(apiUrlProviderDashboard + res.data.data.nurseries[0].id, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
          this.setState({
            totalReservations: res.data.data.total_reservations ?? '',
            totalSubscriptions: res.data.data.total_subscriptions ?? '',
            totalChildren: res.data.data.total_children ?? '',
            totalViews: res.data.data.views ?? '',
            reservations: res.data.data.reservations ?? [],
            subscriptions: res.data.data.subscriptions ?? [],
            loader: false
          })
        })
      }
    })

    setTimeout(() => {
      this.setState({
        loader: false
      })
    }, 25000)
  }

  handleNurseryChange = (e) => {
    this.setState({btnLoader: true})
    var target = parseInt(e.target.value)
    var index
    var count = e.target.childNodes.length
    var allChildNodes = e.target.childNodes

    for (var i = 0; i < count; i++ ) {
      if (allChildNodes[i].value == target) {
        index = allChildNodes[i].title
        break
      } else {
        continue
      }
    }

    this.setState({
      nurseryId : e.target.value,
      nurseryName: this.state.nurseries[index].name
    })

    setTimeout(() => {
      axios.get(apiUrlProviderDashboard + this.state.nurseries[index].id, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
        console.log(res.data.data);
        this.setState({
          totalReservations: res.data.data.total_reservations ?? '',
          totalSubscriptions: res.data.data.total_subscriptions ?? '',
          totalChildren: res.data.data.total_children ?? '',
          totalViews: res.data.data.views ?? '',
          reservations: res.data.data.reservations ?? [],
          subscriptions: res.data.data.subscriptions ?? [],
          btnLoader: false
        })
      }).catch(err => this.setState({btnLoader: false}))
    }, 1000)
    
    const action = {
      type: 'CHANGE_PROVIDER_NURSERY_ID',
      data: [this.state.nurseries[index].id, this.state.nurseries[index].name]
    }

    const { dispatch } = this.props;
    dispatch(action)
  }

  handleGoReservationRequest = (params) => {
    const action = {
      type: 'CHANGE_RESERVATION_ID',
      data: [params.row.id]
    }

    const { dispatch } = this.props;
    dispatch(action)

    this.setState({
      reservationId: params.row.id
    })
  }

  handleReservationCancelation = (id) => {
    this.handleOpenPop(id)
  }

  handleReservationAcceptance = (id) => {
    this.setState({btnLoader: true})
    let info = {
      status: 'accept'
    }
    axios.put(apiUrlProviderCancelReservation + id, info, { headers: { Authorization: 'Bearer ' + this.state.token } }).then(
      this.setState({ btnLoader: false }),
      this.handleOpenPop2('You accepted the reservation')
    ).catch(this.setState({ btnLoader: false }))
    setTimeout(() => {window.location.reload()}, 1500)
  }

  handleOpenPop2 = (txt) => {
    this.setState({
      isOpen2: true,
      txt 
    })
  }

  handleOpenPop = (id) => {
    this.setState({
      isOpen: true,
      reservationId: id
    })
  }

  handleClosePop = () => {
    this.setState({
      isOpen: false,
      isOpen2: false,
      txt: ''
    })
  }

  render() {

    // const { reservationId } = this.state
    // if (reservationId) {
    //   return(<Navigate to="/provider-reservation-req"></Navigate>)
    // }

    const { nurseryId } = this.state
    const { nurseries } = this.state

    const nurseriesList = nurseries.map((nursery, index) => {
      return (
        <option value={nursery.id} key={nursery.id} title={index}>{nursery.name}</option>
      )
    })
    
    let gearContainer = document.querySelector('.slide-menu .gear-container')
    const navDetails = document.getElementById('nav-details')
    const ProfileNavMenu = document.querySelector('.profile-nav-menu')

    // const tableRow = document.querySelector('.MuiDataGrid-virtualScrollerRenderZone.css-s1v7zr-MuiDataGrid-virtualScrollerRenderZone')

    // if (tableRow) {
    //   tableRow.onclick = () => {
    //     <Navigate to="/provider-reservation-req"></Navigate>
    //   }
    // }

    // Toggle slide menu in sm and md media
    if (gearContainer) {
      gearContainer.onclick = () => {
        if ($('.slide-menu').css("left") === "-200px") {
          $('.slide-menu').animate({ left: "0px" }, 300)
        }
        else {
          $('.slide-menu').animate({ left: "-200px" }, 300)
        }
      }
    }

    // Close filterMenu when clicking on body
    if (navDetails) {
      navDetails.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({ left: "-200px" }, 300)
        }
      }
    }

    if (ProfileNavMenu) {
      ProfileNavMenu.onclick = () => {
        if ($('.slide-menu').css("left") === "0px") {
          $('.slide-menu').animate({ left: "-200px" }, 300)
        }
      }
    }

    const columns = [
      {
        field: 'child_name',
        headerName: 'Name',
        maxWidth: 130,
        editable: false,
      },
      {
        field: 'status',
        headerName: 'Status',
        maxWidth: 100,
        editable: false,
      },
      {
        field: 'type',
        headerName: 'plan',
        maxWidth: 90,
        editable: false,
      },
      {
        field: 'start_date',
        headerName: 'Start Date',
        maxWidth: 140,
        editable: false,
      },
      {
        field: 'price',
        headerName: 'price',
        maxWidth: 90,
        editable: false,
      },
      {
        field: 'action',
        headerName: 'Action',
        sortable: false,
        minWidth: 200,
        maxWidth: 600,
        renderCell: (params) => (
          <Fragment>
            <strong>
              {params.row.status == 'pending' ?
                <Button
                  variant="contained"
                  style={{
                    color: '#00818f',
                    padding: '6px 10px 4px',
                    border: '2px solid #00818f',
                    borderRadius: '16px',
                    backgroundColor: ' #fff',
                    marginRight: '5px'
                  }}
                  onClick={() => this.handleReservationCancelation(params.row.id)}
                >Reject</Button> : '-'}
            </strong>
            <strong>
              {params.row.status == 'pending' ?
                <Button
                  variant="contained"
                  style={{
                    color: '#fff',
                    padding: '6px 10px 4px',
                    border: '2px solid #00818f',
                    borderRadius: '16px',
                    backgroundColor: ' #00818f'
                  }}
                  onClick={() => this.handleReservationAcceptance(params.row.id)}
                >Accept</Button> : '-'}
            </strong>
          </Fragment>
        ),
      },
    ];

    const columns2 = [
      {
        field: 'child_name',
        headerName: 'name',
        maxWidth: 90,
        editable: false,
        hideable: false
      },
      {
        field: 'type',
        headerName: 'Plan',
        maxWidth: 110,
        editable: false,
        hideable: false
      },
      {
        field: 'start_date',
        headerName: 'Start Date',
        maxWidth: 140,
        editable: false,
        hideable: false
      },
      {
        field: 'status',
        headerName: 'Status',
        maxWidth: 100,
        editable: false,
        hideable: false
      }
    ];

    const rows = [...this.state.reservations]

    const rows2 = [...this.state.subscriptions]

    const path = window.location.pathname.slice(1)

    console.log(this.state.token);

    return (
      <Fragment>
        <Popup body={this.state.txt} handleClose={this.handleClosePop} isOpen={this.state.isOpen2}/>
        <UpdatedPopup handleClose={this.handleClosePop} isOpen={this.state.isOpen} reservationId={this.state.reservationId}/>
        {!this.state.loader ? 
          <section className="profile-container">
            {this.state.btnLoader ?
              <div className='d-flex justify-content-center align-items-center min-vh-100 loader'>
                <FadeLoader
                  color={'#00818F'}
                />
              </div> : null
            }
          <ProviderSidebar path={path} />

          <div className="profile-content">
            
            <ProviderNavbar />

            {!this.state.loader ? 
              <div className="container tabs-container update">
              <div className="align-items-start">
                <div className="tab-content" id="v-pills-tabContent">
                  <div className="tab-pane fade show active"
                id="v-pills-provider-profile" role="tabpanel"
                aria-labelledby="v-pills-provider-profile-tab">
                <div className="search-action" >
                  {
                    <select className="options choose-child p-8"
                      defaultValue={nurseryId} onChange={this.handleNurseryChange}>
                      {nurseriesList ? nurseriesList : 'Add nursery First'}
                    </select>
                  }
                  <div>
                    <span>
                      <img src="../../imgs/all/add.svg" alt="" />
                    </span>
                    <Link to='/provider-add-new-nursery'>Add nursery</Link>
                  </div>
                </div>
                <div className="tab-content tabs-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" 
                    id="nav-details" role="tabpanel" 
                    aria-labelledby="nav-details-tab">
                    
                  <div className="row ">
                      <div className="col mb-3">
                          <div className="card">
                              <div>
                                  <h5>{this.state.totalReservations ?? '-'}</h5>
                                  <p>Total Reservations</p>
                              </div>
                              <div><img src="../../imgs/all/total reservations.svg" alt="" /></div>
                          </div>
                      </div>
                      <div className="col">
                          <div className="card">
                              <div>
                                  <h5>{this.state.totalSubscriptions ?? '-'}</h5>
                                  <p>Total Subscriptions</p>
                              </div>
                              <div><img src="../../imgs/all/total subscriptions.svg" alt="" /></div>
                          </div>
                      </div>
                      <div className="col">
                          <div className="card">
                              <div>
                                  <h5>{this.state.totalChildren ?? '-'}</h5>
                                  <p>Total Children</p>
                              </div>
                              <div><img src="../../imgs/all/total children.svg" alt="" /></div>
                          </div>
                      </div>
                      <div className="col">
                          <div className="card">
                              <div>
                                  <h5>{this.state.totalViews ?? '-'}</h5>
                                  <p>Nursery Views</p>
                              </div>
                              <div><img src="../../imgs/all/views.svg" alt="" /></div>
                          </div>
                      </div>
                  </div>

                  <div className="row">
                    <div className="col-7 home-table">
                      <h5 className="table-title">Recent Reservations</h5>
                      <Box sx={{ minHeight: 100, width: '100%' }}>
                        <DataGrid
                          rows={rows}
                          columns={columns}
                          pageSize={7}
                          rowsPerPageOptions={[7]}
                          disableSelectionOnClick
                          autoHeight
                          // onCellClick={(params) => {
                          //   this.handleGoReservationRequest(params)
                          // }}
                        />
                      </Box>
                    </div>
                    <div className="col-4 home-table subscription ">
                      <h5 className="table-title">Recent Subscriptions</h5>
                      <Box sx={{ minHeight: 100, width: '100%' }}>
                        <DataGrid
                          rows={rows2}
                          columns={columns2}
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
              :
              <div className='d-flex justify-content-center align-items-center min-vh-100'>
                <BeatLoader
                  color={'#00818F'}
                />
              </div>
            }
          </div>
        </section>
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

function mapStateToProps(
  { loginReducer, providerReducer, reservationReqReducer }) {
  return {
    token: loginReducer.token,
    nurseryId: providerReducer.nurseryId,
    nurseryName: providerReducer.nurseryName,
    reservationId: reservationReqReducer.reservationId
  }
}

export default connect(mapStateToProps)(ProviderDashboard)