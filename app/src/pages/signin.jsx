import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core';
import Layout from '../components/Layout';


import SigninForm from '../components/SigninForm';

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

  return (
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
            <h2>Sign in</h2>
            <SigninForm />
            <a href="/forgotPwd">Forgot your password?</a>
          </div>
        </Paper>
      </Container>
    </Layout>
  );
}

export default SigninPage;
