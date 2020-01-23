import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Paper,
} from '@material-ui/core';
import { route } from 'next/dist/next-server/server/router';
import Layout from '../../../components/Layout';
import api from '../../../api';
import SigninPage from '../../signin';
import ResetPwdForm from '../../../components/ResetPwdForm';

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
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [submit, setSubmit] = useState(false);
  const [failureUrl, setFailureUrl] = useState(true);
  const classes = useStyles();

  const callbackResetData = async ([childPassword]) => {
    setPassword(childPassword);
    setSubmit(!submit);
  };

  useEffect(() => {
    async function testLink() {
      try {
        await api.post('auth/testLinkResetPwd', {
          login: router.query.login,
          code: router.query.code,
        });
        setFailureUrl(false);
      } catch (err) {
        Router.replace('/resetPwd', '/signin', { shallow: true });
      }
    }
    if (router.query.login) {
      console.log(router.query.login);
      testLink();
    }
  }, [router.query.login]);

  useEffect(() => {
    async function readUser() {
      if (router.query.login) {
        try {
          await api.post('auth/resetPwd', {
            login: router.query.login,
            password,
            code: router.query.code,
          });
          Router.replace('/resetPwd', '/signin', { shallow: true});
        } catch (err) {
          console.log(err);
        }
      }
    }
    readUser();
  }, [submit]);


  if (failureUrl) {
    return (
      <div>
        <p>Forbidden Access to /resetPwd</p>
        <SigninPage />
      </div>
    );
  }
  return (
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
            <h1>Reset your password</h1>
            <ResetPwdForm submitResetData={callbackResetData} />
          </div>
        </Paper>
      </Container>
    </Layout>
  );
}

export default HomePage;
