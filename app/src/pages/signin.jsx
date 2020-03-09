/* eslint jsx-a11y/anchor-is-valid: 0 */
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { Container, Paper, Typography } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import SigninForm from '../components/SigninForm';
import { createApiRequester } from '../stores/Api';
import { StoreContext } from '../store/Store';
import redirectTo from '../initialServices/initialServices';
import ErrorComponent from '../components/ErrorComponent';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(1),
  },
}));

export default function SigninPage({ type }) {
  const classes = useStyles();
  const { state, dispatch } = useContext(StoreContext);

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: false });
  }, []);

  if (type === 'error') {
    return (<ErrorComponent status={400} message="could not fetch data from server" />);
  }
  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <Typography alignCenter color="textPrimary" variant="bdy1" component="h4">
          <p>Welcome to this demo Website!</p>
          <p>
            You can connect with one of the following users
            <br/>
            login: Abigail_BIRD | password: Qwerty123
            <br />
            login: Aiden_GILES | password: Qwerty123
            {' '}
            <br />
            login: Addison_LYNCH | password: Qwerty123
            <br />
            login: Alexander_YORK | password: Qwerty123
          </p>
          Or create a new account
          <p>Every fake User account on the website can be accessed with Firstname_LASTNAME as login and Qwerty123 as password</p>
        </Typography>
      </Paper>
      <Paper className={classes.paper}>
        <div>
          <h2>
            Sign in
            {' '}
            {state.login}
          </h2>
          <SigninForm />
          <Link href="/forgot-password">
            <a>Forgot your password?</a>
          </Link>
        </div>
      </Paper>
    </Container>
  );
}

SigninPage.getInitialProps = async (ctx) => {
  try {
    const { req, res } = ctx;
    const apiObj = createApiRequester(req);
    const { data } = await apiObj.get('users/status', req, res);
    if (data.connected === true) {
      redirectTo('/', req, res);
    }
    return ({ type: 'success' });
  } catch (err) {
    return ({ type: 'error' });
  }
};
