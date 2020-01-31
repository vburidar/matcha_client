import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Paper,
} from '@material-ui/core';
import { createApiRequester, IsSessionAuthOnPage, ApiContext } from '../api/Api';
import ForgottenPwdForm from '../components/ForgottenPwdForm';

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

function forgotPwdPage() {
  const { forgotPwd } = useContext(ApiContext);
  const [email, setEmail] = useState('');
  const classes = useStyles();

  const callbackEmail = async ([childEmail]) => {
    setEmail(childEmail);
  };

  useEffect(() => {
    async function readUser() {
      if (email !== '') {
        await forgotPwd({ email });
      }
    }
    readUser();
  });

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <div>
          <h1>Forgot your password?</h1>
          <ForgottenPwdForm submitEmail={callbackEmail} />
          <p>{email}</p>
        </div>
      </Paper>
    </Container>
  );
}

forgotPwdPage.getInitialProps = async (ctx) => {
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

export default forgotPwdPage;
