import React, { useState, useEffect, useContext } from 'react';
import {
  Container, Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import api from '../api';
import SignupForm from '../components/SignupForm';
import { contextTest } from '../contextTest';

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

function HomePage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const classes = useStyles();
  const MyContext = useContext(contextTest);
  console.log(MyContext);


  const callbackSignupData = async ([childLogin, childPassword, childEmail]) => {
    setLogin(childLogin);
    setPassword(childPassword);
    setEmail(childEmail);
    console.log(childLogin);
  };

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
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
            <h1>Sign up</h1>
            <SignupForm signupData={callbackSignupData} />
          </div>
        </Paper>
      </Container>
    </Layout>
  );
}

export default HomePage;
