import { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import FlatButton from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import router from 'next/router';
import { ApiContext } from '../api/Api';
import api from '../api';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1, 0),
  },
}));


export default function SigninForm() {
  const { signin } = useContext(ApiContext);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [submitDisable, setSubmitDisable] = useState(true);

  const classes = useStyles();

  const updateSubmitAbility = () => {
    if (login.length > 1 && password.length > 1) {
      setSubmitDisable(false);
    } else {
      setSubmitDisable(true);
    }
  };

  const handleChangeLogin = (event) => {
    setLogin(event.target.value);
    updateSubmitAbility();
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    updateSubmitAbility();
  };

  const submitSigninForm = (event) => {
    event.preventDefault();
    async function readUser() {
      try {
        await signin({
          login,
          password,
        });
        router.push('/homepage');
      } catch (err) {
        console.log(err);
      }
    }
    readUser();
  };

  return (
    <div>
      <form onSubmit={submitSigninForm}>
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            id="login"
            name="login"
            label="login"
            value={login}
            onChange={handleChangeLogin}
          />
        </FormControl>
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            id="password"
            name="password"
            label="password"
            type="password"
            value={password}
            onChange={handleChangePassword}
          />
        </FormControl>
        <FormControl fullWidth className={classes.formControl}>
          <FlatButton
            type="submit"
            label="submit"
            value="submit"
            disabled={submitDisable}
          >
            SUBMIT
          </FlatButton>
        </FormControl>
      </form>
    </div>
  );
}
