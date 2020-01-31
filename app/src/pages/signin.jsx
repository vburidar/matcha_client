import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import SigninForm from '../components/SigninForm';
import { createApiRequester, IsSessionAuthOnPage } from '../api/Api';
import { StoreContext } from '../store/Store';

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

const SigninPage = (props) => {
  const classes = useStyles();
  const { state, dispatch } = useContext(StoreContext);

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: false });
  }, []);

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
          <a href="/forgotPwd">Forgot your password?</a>
        </div>
      </Paper>
    </Container>
  );
};

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

export default SigninPage;
