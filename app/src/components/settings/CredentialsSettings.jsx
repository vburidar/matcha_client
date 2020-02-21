import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  TextField,
  FormControl,
  Button,
} from '@material-ui/core';

import { ApiContext } from '../../api/Api';

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
    credentials, setCredentials,
  },
}) {
  const classes = useStyles();
  const { forgotPwd } = useContext(ApiContext);

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
        // onClick={forgotPwd}
      >
        Send reset password email
      </Button>
    </form>
  );
}