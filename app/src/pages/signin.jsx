import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core';
import { useEffect, useContext } from 'react';
import SigninForm from '../components/SigninForm';
import { StoreContext } from '../store/Store';
import SignedInChecker from '../components/SignedInChecker';

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


function SigninPage() {
  const classes = useStyles();
  const { state, dispatch } = useContext(StoreContext);

  useEffect(() => {
    console.log(state);
    if (state.inSession) {
      router.push('/myHomePage');
    }
  }, [state.inSession]);


  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <div>
          <h2>
Sign in
          </h2>
          <SignedInChecker />
          <SigninForm />
          <a href="/forgotPwd">Forgot your password?</a>
        </div>
      </Paper>
    </Container>
  );
}

export default SigninPage;
