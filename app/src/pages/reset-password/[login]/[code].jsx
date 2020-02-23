import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Container, Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { createApiRequester } from '../../../stores/Api';
import ResetPasswordForm from '../../../components/ResetPasswordForm';
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

function ResetPasswordPage() {
  const router = useRouter();
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <div>
          <h1>Reset your password</h1>
          <ResetPasswordForm
            code={router.query.code}
            login={router.query.login}
          />
        </div>
      </Paper>
    </Container>
  );
}

ResetPasswordPage.getInitialProps = async ({ req, res, query }) => {
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  let testLink = true;
  const { login, code } = query;

  try {
    await apiObj.post('auth/testLinkResetPwd', {
      login,
      code,
    });
  } catch (err) {
    testLink = false;
  }

  if (data.connected === true) {
    redirectTo('/', req, res);
  } else if (testLink === false) {
    redirectTo('/signin', req, res);
  }

  return (data);
};

export default ResetPasswordPage;
