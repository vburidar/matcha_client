import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Paper,
} from '@material-ui/core';
import { route } from 'next/dist/next-server/server/router';
import Layout from '../../../components/Layout';
import { createApiRequester, IsSessionAuthOnPage } from '../../../api/Api';
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [failureUrl, setFailureUrl] = useState(true);
  const classes = useStyles();

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
      testLink();
    }
  }, [router.query.login]);

  if (failureUrl) {
    return (
      <div>
        <p>Forbidden Access to /resetPwd</p>
        <SigninPage />
      </div>
    );
  }
  return (
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
            <h1>Reset your password</h1>
            <ResetPwdForm
              code={router.query.code}
              login={router.query.login}
              isSubmitted={isSubmitted}
            />
          </div>
        </Paper>
      </Container>
  );
}

SigninPage.getInitialProps = async (ctx) => {
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

export default HomePage;
