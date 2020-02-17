import React, { useState } from 'react';
import { FormControl, FormHelperText } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FlatButton from '@material-ui/core/Button';

function ForgottenPwdForm(
  { submitEmail },
) {
  const [email, setEmail] = useState('');
  const [submitDisable, setSubmitDisable] = useState(true);
  const [messageEmail, setMessageEmail] = useState('');

  const handleSubmit = (event) => {
    submitEmail([email]);
    event.preventDefault();
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
    setSubmitDisable(true);
    if (event.target.value.length > 0) {
      setMessageEmail('This email is invalid');
    } else {
      setMessageEmail('');
    }
    if (event.target.value.match(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/) && event.target.value.length > 0) {
      setMessageEmail('');
      setSubmitDisable(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormControl fullWidth>
        <TextField
          type="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={handleChangeEmail}
        />
      </FormControl>
      <FormHelperText error>{messageEmail}</FormHelperText>
      <FormControl fullWidth>
        <FlatButton
          type="submit"
          name="submit"
          disabled={submitDisable}
          onChange={handleSubmit}
        >
          SUBMIT
        </FlatButton>
      </FormControl>
    </form>

  );
}

export default ForgottenPwdForm;
