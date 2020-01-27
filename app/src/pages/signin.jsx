import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core';
import { useEffect, useContext, useRef, useState } from 'react';
import Layout from '../components/Layout';
import GeneralSettingsForm from '../components/GeneralSettingsForm';

import SigninForm from '../components/SigninForm';
import SignedInChecker from '../components/SignedInChecker';
import { StoreContext } from '../store/Store';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(3),
  },
}));


function SigninPage() {
  const classes = useStyles();
  const {state, dispatch} = useContext(StoreContext);
  console.log(state);

  useEffect(() => {
    console.log(state);
  }, [state]);


  return (
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
            <h2>Sign in {state.login}</h2>
            <SignedInChecker />
            <SigninForm />
            <a href="/forgotPwd">Forgot your password?</a>
          </div>
        </Paper>
      </Container>
  );
}

export default SigninPage;
