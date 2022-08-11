import React, { Component, Fragment } from 'react'
import axios from 'axios'

import './ChildrenArchive.css'

import { Link, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { apiUrlProviderArchiveChildren } from '../../../../api'

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

class ProviderChildren extends Component {

  state = {
    nurseryId: '',
    children: [],
    loader: true,
    token: '',
    isOpen: false,
    txt: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get(apiUrlProviderArchiveChildren + '?nursery_id=' + this.props.nurseryId, { headers: { Authorization: 'Bearer ' + this.props.token } }).then(res => {
      this.setState({
        token: this.props.token,
        children: res.data.data.data != null ? res.data.data.data : [],
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
        field: 'subscription_id',
        headerName: 'Subscription Id',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'name',
        headerName: 'Name',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'parent_name',
        headerName: 'Parent',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'age',
        headerName: 'Age',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'time_table',
        headerName: 'TimeTable',
        maxWidth: 150,
        editable: false,
        hideable: false
      },
      {
        field: 'delete',
        headerName: 'Delete',
        maxWidth: 150,
        editable: false,
        sortable: false,
        hideable: false,
        renderCell: (params) => (
          <strong>
            <img src="../../../imgs/all/delete.svg" alt="" className='pointer ml-3'
              onClick={() => this.handleDeleteChild(params.row.id)}
            />
          </strong>
        ),
      },
    ];

    const rows = [...this.state.children]
    // const rows = [
    //   { id: 1, name: 'Snow', status: 'Jon', start_date: 35, due_date: 1, payment_method: 'Snow', payment_data: 'Jon', reservation_id: 35, created_at: 35}
    // ];
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
                <Link to="/">Home</Link> / <Link to="/provider-children-archive">
                  Children Archive
                </Link>
              </p>
            </div>

            <div className='d-flex justify-content-end'>
              <div class="all-archive archive">
                <Link to="/provider-children">
                  <img src="../../../imgs/all/all children archive.svg" alt="" />
                  <span>All Children</span>
                </Link>
              </div>
            </div>

            <div className="container tabs-container update">
              <div className="align-items-start">
                <div className="tab-content update" id="v-pills-tabContent">
                  <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                    <div className="tab-content update tabs-content" id="nav-tabContent">
                      <div class="tab-pane fade show active" id="v-pills-children"
                        role="tabpanel" aria-labelledby="v-pills-children-tab">
                        <div class="tab-pane fade show active" id="nav-details" aria-labelledby="nav-details-tab" role="tabpanel">
                          <h5 class="table-title">Children Archive</h5>
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

export default connect(mapStateToProps)(ProviderChildren)