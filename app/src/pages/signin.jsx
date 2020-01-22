import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Stepper, Step, StepLabel, Button, Paper,
} from '@material-ui/core';
import Layout from '../components/Layout';
import GeneralSettingsForm from '../components/GeneralSettingsForm';


import api from '../api';
import SigninForm from '../components/SigninForm';

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

function HomePage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const classes = useStyles();

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
            <h2>Sign in</h2>
            <SigninForm submitData={callbackSigninData} />
            <a href="/forgotPwd">Forgot your password?</a>
          </div>
        </Paper>
      </Container>
    </Layout>
  );
}

export default HomePage;
