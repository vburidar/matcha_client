<<<<<<< HEAD
import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core';
import { useEffect, useContext, useRef, useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Stepper, Step, StepLabel, Button, Paper,
} from '@material-ui/core';
>>>>>>> parent of 7804579... Changes page Signin and component signinForm so that the api request is part of the signinForm component and not the signin page
import Layout from '../components/Layout';
import GeneralSettingsForm from '../components/GeneralSettingsForm';

<<<<<<< HEAD
=======

import api from '../api';
>>>>>>> parent of 7804579... Changes page Signin and component signinForm so that the api request is part of the signinForm component and not the signin page
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

<<<<<<< HEAD

function SigninPage() {
=======
function HomePage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
>>>>>>> parent of 7804579... Changes page Signin and component signinForm so that the api request is part of the signinForm component and not the signin page
  const classes = useStyles();
  const store = useContext(contextTest);
  console.log(store);

  useEffect(() => {
    console.log(store.connected);
  }, [store]);

  useEffect(() => {
    console.log(store.connected);
  }, [SignedInChecker]);

  const callbackSigninData = async ([childLogin, childPassword]) => {
    setLogin(childLogin);
    setPassword(childPassword);
  };

  useEffect(() => {
    async function readUser() {
      if (login !== '' && password !== '') {
        try {
          const user = await api.post('auth/signin', {
            login,
            password,
          });
          console.log(user);
        } catch (err) {
          console.log(err);
        }
      }
    }
    readUser();
  });


  return (
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
<<<<<<< HEAD
            <h2>Sign in {store.login}</h2>
            <SignedInChecker />
            <SigninForm />
=======
            <h2>Sign in</h2>
            <SigninForm submitData={callbackSigninData} />
>>>>>>> parent of 7804579... Changes page Signin and component signinForm so that the api request is part of the signinForm component and not the signin page
            <a href="/forgotPwd">Forgot your password?</a>
          </div>
        </Paper>
      </Container>
    </Layout>
  );
}

export default HomePage;
