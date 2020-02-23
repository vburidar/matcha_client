import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Paper,
} from '@material-ui/core';
import { createApiRequester} from '../../../api/Api';
import api from '../../../api';
import SigninPage from '../../signin';
import ResetPwdForm from '../../../components/ResetPwdForm';
import redirectTo from '../../../initialServices/initialServices';

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

function resetPwdPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [failureUrl, setFailureUrl] = useState(true);
  const classes = useStyles();

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

resetPwdPage.getInitialProps = async (ctx) => {
  const { req, res } = ctx;
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  let testLink = true;
  const { url } = req;
  const login = url.split(/\//)[2];
  const code = url.split(/\//)[3];
  try {
    await api.post('auth/testLinkResetPwd', {
      login,
      code,
    });
  } catch (err) {
    testLink = false;
  }
  if (data.connected === true) {
    redirectTo('/', req, res);
  } else if (testLink === false) {
    redirectTo('signin', req, res);
  }
  return (data);
};

export default resetPwdPage;
