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

import './Popup.css'

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

export default function Popup({ body, handleClose, isOpen }) {

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
              {body}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleClose}
              className='popup-btn-hover'
            >
              Ok
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}