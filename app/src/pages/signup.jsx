import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Paper,
} from '@material-ui/core';
import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { createApiRequester, IsSessionAuthOnPage } from '../api/Api';
import SignupForm from '../components/SignupForm';
import api from '../api';

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

  const callbackSignupData = async ([childLogin, childPassword, childEmail]) => {
    setLogin(childLogin);
    setPassword(childPassword);
    setEmail(childEmail);
    console.log(childLogin);
  };

  useEffect(() => {
    async function createUser() {
      if (login !== '' && password !== '' && email !== '') {
        try {
          await api.post('auth/signup', {
            login,
            password,
            email,
          });
          router.push('/signin');
        } catch (err) {
          console.log('error', err);
        }
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

SignupPage.getInitialProps = async (ctx) => {
  const { req, res } = ctx;
  const apiObj = createApiRequester(req);
  const ret = await IsSessionAuthOnPage('public_only', apiObj);
  if (ret === false) {
    res.writeHead(302, {
      Location: '/homepage',
    });
    res.end();
  }
  return (ret.data);
};

export default SignupPage;
