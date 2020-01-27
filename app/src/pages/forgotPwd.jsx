import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Paper,
} from '@material-ui/core';
import api from '../api';
import { StoreContext } from '../Store/store'; 
import ForgottenPwdForm from '../components/ForgottenPwdForm';
import { Router } from 'next/router';

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

function forgotPwdPage() {
  const [email, setEmail] = useState('');
  const classes = useStyles();
  const {dispatch, state } = useContext(ContextStore);

  const callbackEmail = async ([childEmail]) => {
    setEmail(childEmail);
  };

  useEffect(() => {
    if (state.inSession) {
      Router.push('/myHomePage');
    }
  });

  useEffect(() => {
    async function readUser() {
      if (email !== '') {
        const reset = await api.post('/auth/forgotPwd',
          { email });
      }
    }
    readUser();
  });

  return (
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
            <h1>Forgot your password?</h1>
            <ForgottenPwdForm submitEmail={callbackEmail} />
            <p>{email}</p>
          </div>
        </Paper>
      </Container>
  );
}

export default forgotPwdPage;
