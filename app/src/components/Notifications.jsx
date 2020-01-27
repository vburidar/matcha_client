import { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { StoreContext } from '../store/Store';
import { closeNotification } from '../store/actions';

export default function Notifications() {
  const { state, dispatch } = useContext(StoreContext);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={state.open}
      autoHideDuration={3000}
      onClose={() => closeNotification(dispatch, {})}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={() => closeNotification(dispatch, {})}
        severity={state.severity}
      >
        {state.message}
      </MuiAlert>
    </Snackbar>
  );
}
