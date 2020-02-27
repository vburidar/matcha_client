import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  TextField,
  FormControl,
  Button,
} from '@material-ui/core';

import { ApiContext } from '../../stores/Api';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '70%',
    margin: 'auto',
  },
  formControl: {
    margin: theme.spacing(1, 0),
  },
}));

export default function CredentialsSettings({
  props: {
    credentials, setCredentials, email,
  },
}) {
  const classes = useStyles();
  const { forgotPassword } = useContext(ApiContext);

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
          required
        />
      </FormControl>
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          type="email"
          name="emailConfirmation"
          label="Confirm email"
          value={credentials.emailConfirmation}
          onChange={handleCredendialsChange}
          required
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
