import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Paper,
} from '@material-ui/core';
import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { createApiRequester, ApiContext } from '../api/Api';
import SignupForm from '../components/SignupForm';
import redirectTo from '../initialServices/initialServices';

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { signup } = useContext(ApiContext);
  const classes = useStyles();

  const callbackSignupData = async ([childLogin, childFirstName, childLastName, childPassword, childEmail]) => {
    setLogin(childLogin);
    setFirstName(childFirstName);
    setLastName(childLastName);
    setPassword(childPassword);
    setEmail(childEmail);
  };

  useEffect(() => {
    async function createUser() {
      if (login !== '' && password !== '' && email !== '') {
        const response = await signup({
          login,
          firstName,
          lastName,
          password,
          email,
        });
        if (response.type !== 'error') {
          router.push('/signin');
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
  const { data } = await apiObj.get('users/status', req, res);
  if (data.connected === true) {
    redirectTo('/', req, res);
  }
  return (data);
};

export default SignupPage;
