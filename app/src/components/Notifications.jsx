import { useState, useContext, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Store } from '../store/Store';

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const { state } = useContext(Store);

  const handleClose = async () => {
    setOpen(false);
  };

  useEffect(() => {
    if (state.message !== '') {
      setOpen(true);
    }
  }, [state.message]);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={state.severity}
      >
        {state.message}
      </MuiAlert>
    </Snackbar>
  );
}
