import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Paper,
} from '@material-ui/core';
import { createApiRequester, ApiContext } from '../stores/Api';
import ForgottenPwdForm from '../components/ForgottenPwdForm';
import redirectTo from '../initialServices/initialServices';

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

export default function ForgotPasswordPage() {
  const { forgotPassword } = useContext(ApiContext);
  const [email, setEmail] = useState('');
  const classes = useStyles();

  const callbackEmail = async ([childEmail]) => {
    setEmail(childEmail);
  };

  useEffect(() => {
    async function readUser() {
      if (email !== '') {
        await forgotPassword({ email });
      }
    }
    readUser();
  }, [email]);

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <div>
          <h1>Forgot your password?</h1>
          <ForgottenPwdForm submitEmail={callbackEmail} />
        </div>
      </Paper>
    </Container>
  );
}

ForgotPasswordPage.getInitialProps = async (ctx) => {
  const { req, res } = ctx;
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === true) {
    redirectTo('/', req, res);
  }
  return (data);
};
