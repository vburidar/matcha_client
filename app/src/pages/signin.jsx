/* eslint jsx-a11y/anchor-is-valid: 0 */
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { Container, Paper } from '@material-ui/core';
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
