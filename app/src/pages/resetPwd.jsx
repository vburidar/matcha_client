import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Paper,
} from '@material-ui/core';
import Layout from '../components/Layout';
import api from '../api';
import ResetPwdForm from '../components/ResetPwdForm';

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
  const [login, setLogin] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const classes = useStyles();
  const router = useRouter();

  const callbackResetData = async ([childPassword, childPasswordConf]) => {
    setPassword(childPassword);
    setPasswordConf(childPasswordConf);
    console.log(password);
  };

  useEffect(() => {
    setLogin(router.query.login);
    setCode(router.query.code);
    async function readUser() {
      if (login !== '' && password !== '') {
        const user = await api.post('auth/resetPwd', {
          login,
          password,
          code,
        });
        console.log(user);
      }
    }
    readUser();
  });


  return (
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <div>
            <h1>Reset your password</h1>
            <ResetPwdForm submitResetData={callbackResetData} />
          </div>
        </Paper>
      </Container>
    </Layout>
  );
}

export default HomePage;
