import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Paper,
} from '@material-ui/core';
import Layout from '../components/Layout';
import api from '../api';
import ForgottenPwdForm from '../components/ForgottenPwdForm';

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
  const [email, setEmail] = useState('');
  const classes = useStyles();

  const callbackEmail = async ([childEmail]) => {
    setEmail(childEmail);
  };

  useEffect(() => {
    async function readUser() {
      if (email !== '') {
        const reset = await api.post('/auth/forgotPwd',
          { email });
        console.log(reset);
      }
    }
    readUser();
  });

  return (
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
            <h1>Forgot your password?</h1>
            <ForgottenPwdForm submitEmail={callbackEmail} />
            <p>{email}</p>
          </div>
        </Paper>
      </Container>
    </Layout>
  );
}

export default HomePage;
