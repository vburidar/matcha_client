import { makeStyles } from '@material-ui/core/styles';
import router from 'next/router';
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { StoreContext } from '../../store/Store';
import { ApiContext } from '../../api/Api';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

function ButtonListConnected() {
  const { state, dispatch } = useContext(StoreContext);
  const { sessionDelete } = useContext(ApiContext);

  async function handleLogout(event) {
    try {
      await sessionDelete();
      dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: false });
    } catch (err) {
      console.log('error');
    }
    router.push('/signin');
  }

  useEffect(() => {
  }, [state.inSession]);
  if (state.inSession === true) {
    return (
      <div>
        <Button color="inherit">MyProfile</Button>
        <Button color="inherit">Chat</Button>
        <Button color="inherit">Activity</Button>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </div>
    );
  }
  return (null);
}


export default ButtonListConnected;
