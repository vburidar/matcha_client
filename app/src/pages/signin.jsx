import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core';
import { useEffect, useContext, useRef, useState } from 'react';
import Layout from '../components/Layout';

import SigninForm from '../components/SigninForm';
import SignedInChecker from '../components/SignedInChecker';
import { contextTest, StateProvider } from '../contextTest';

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
  const store = useContext(contextTest);
  console.log(store);

  useEffect(() => {
    console.log(store.connected);
  }, [store]);

  useEffect(() => {
    console.log(store.connected);
  }, [SignedInChecker]);

  return (
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
            <h2>Sign in {store.login}</h2>
            <SignedInChecker />
            <SigninForm />
            <a href="/forgotPwd">Forgot your password?</a>
          </div>
        </Paper>
      </Container>
    </Layout>
  );
}

export default SigninPage;
