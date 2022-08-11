import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Box from '@mui/material/Box';

import { apiUrlProviderCancelReservation } from '../../api'
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';

// import './Popup.css'

const style = {
  minWidth: 400,
  border: '1px solid #fff',
};

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function UpdatedPopup({ handleClose, isOpen, reservationId }) {

  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  const token = useSelector(state => state.loginReducer.token)

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  let info = {
    status: 'reject',
    reply: message,
    provider_end: 'ended'
  }

  let info2 = {
    status: 'reject',
    reply: message,
    provider_end: 'not_ended'
  }

  const handleRejectWithEnd = () => {
    if (message) {
      axios.put(apiUrlProviderCancelReservation + reservationId, info, { headers: { Authorization: 'Bearer ' + token } }).then(
        setSuccess('You ended the reservation'),
        setError(''),
      )
        .catch(err => setError(err.response.data.errors[0]))
    } else {
      setError('You need to write a reason for rejection')
    }
  }

  const handleReject = () => {
    if (message) {
      axios.put(apiUrlProviderCancelReservation + reservationId, info2, { headers: { Authorization: 'Bearer ' + token } }).then(
        setSuccess('You rejected the reservation'),
        setError(''),
      )
        .catch(err => setError(err.response.data.errors[0]))
    } else {
      setError('You need to write a reason for rejection')
    }
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <Box sx={style}>
          <DialogTitle style={{ cursor: 'move', fontWeight: 'bold' }} id="draggable-dialog-title">
            Message
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <textarea rows='10' cols='50' placeholder='Enter rejection reason' onChange={handleChange}></textarea>
              {
                error ? 
                  <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="error" variant="outlined">
                      {error}
                    </Alert>
                  </Stack>
                  : null
                }
              {
                success ? 
                  <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="success" variant="outlined">
                      {success}
                    </Alert>
                  </Stack>
                  : null
                }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleRejectWithEnd}
              className='popup-btn-hover'
            >
              Reject With End
            </Button>
            <Button
              autoFocus
              onClick={handleReject}
              className='popup-btn-hover'
            >
              Reject Without End
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}