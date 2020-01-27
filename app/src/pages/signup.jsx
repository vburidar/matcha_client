import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import api from '../api';
import SignupForm from '../components/SignupForm';
import { StoreContext } from '../store/Store';
import Router from 'next/router';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(3),
  },
  button: {
    color: theme.palette.primary,
  },
}));

function SignupPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const classes = useStyles();
  const { state } = useContext(StoreContext);


  const callbackSignupData = async ([childLogin, childPassword, childEmail]) => {
    setLogin(childLogin);
    setPassword(childPassword);
    setEmail(childEmail);
    console.log(childLogin);
  };

  useEffect(() => {
    if (state.inSession) {
      Router.push('/myHomepage');
    }
  }, [state.inSession]);

  useEffect(() => {
    async function createUser() {
      if (login !== '' && password !== '' && email !== '') {
        const user = await api.post('auth/signup', {
          login,
          password,
          email,
        });
        console.log('User created!', user);
      }
    }
    createUser();
  }, [login]);

  return (
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
            <h1>Sign up</h1>
            <SignupForm signupData={callbackSignupData} />
          </div>
        </Paper>
      </Container>
  );
}

export default SignupPage;
