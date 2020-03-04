import { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  TextField,
  FormControl,
  FormHelperText,
  Button,
} from '@material-ui/core';

import { ApiContext } from '../../stores/Api';
import { SettingsContext } from '../../stores/Settings';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '70%',
    margin: 'auto',
  },
  formControl: {
    margin: theme.spacing(1, 0),
  },
}));

export default function CredentialsSettings({ email }) {
  const classes = useStyles();
  const { forgotPassword } = useContext(ApiContext);
  const {
    credentials,
    setCredentials,
    errors,
  } = useContext(SettingsContext);

  function handleCredendialsChange(event) {
    setCredentials({
      ...credentials,
      ...{ [event.target.name]: event.target.value },
    });
  }

  return (
    <form className={classes.form} noValidate autoComplete="on">
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          id="login"
          name="login"
          label="Login"
          value={credentials.login}
          onChange={handleCredendialsChange}
          helperText={
            errors.login
              ? 'Login should be between 2 and 20 caracters and should consist of letters, digits, or _'
              : ''
          }
          error={errors.login}
        />
      </FormControl>

      <FormControl fullWidth className={classes.formControl}>
        <TextField
          fullWidth
          type="email"
          name="email"
          label="Email"
          value={credentials.email}
          onChange={handleCredendialsChange}
          helperText={
            errors.email
              ? 'Invalid email'
              : ''
          }
          error={errors.email}
        />
      </FormControl>
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          type="email"
          name="emailConfirmation"
          label="Confirm email"
          value={credentials.emailConfirmation}
          onChange={handleCredendialsChange}
          helperText={
            errors.emailConfirmation
              ? 'Email confirmation does not match'
              : ''
          }
          error={errors.emailConfirmation}
        />
      </FormControl>

      <Button
        color="primary"
        variant="contained"
        onClick={() => forgotPassword({ email })}
      >
        Send reset password email
      </Button>
    </form>
  );
}
