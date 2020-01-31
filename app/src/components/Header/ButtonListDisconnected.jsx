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

function ButtonListDisconnected() {
  const { state, dispatch } = useContext(StoreContext);

  useEffect(() => {
  }, [state.inSession]);

  function handleClickSignin() {
    router.push('/signin');
  }

  function handleClickSignup() {
    router.push('/signup');
  }

  if (state.inSession === false) {
    return (
      <div>
        <Button color="inherit" onClick={handleClickSignup}>Signup</Button>
        <Button color="inherit" onClick={handleClickSignin}>Signin</Button>
      </div>
    );
  }
  return (null);
}

export default ButtonListDisconnected;
