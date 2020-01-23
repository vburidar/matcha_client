import React, { useState } from 'react';
import { FormControl, FormHelperText } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FlatButton from '@material-ui/core/Button';

function ResetPwdForm(
  { submitResetData },
) {
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [messagePwd, setMessagePwd] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleSubmit = (event) => {
    submitResetData([password]);
    event.preventDefault();
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    setSubmitDisabled(true);
    if (event.target.value.toUpperCase() === event.target.value && event.target.value.length > 0) {
      setMessagePwd('Password must contain one lower case');
    } else if (event.target.value.toLowerCase() === event.target.value && event.target.value.length > 0) {
      setMessagePwd('Password must contain one upper case');
    } else if (!event.target.value.match(/\d+/) && event.target.value.length > 0) {
      setMessagePwd('Password must contain one digit');
    } else if (event.target.value.length < 9 && event.target.value.length > 0) {
      setMessagePwd('Password should be at least 9 characters long');
    } else if (passwordConf !== event.target.value && passwordConf !== '') {
      setMessagePwd('Password confirmation is different from password');
    } else {
      setMessagePwd('');
      if (event.target.value.length > 0 && passwordConf.length > 0) {
        setSubmitDisabled(false);
      }
    }
  };

  const handleChangePasswordConf = (event) => {
    setSubmitDisabled(true);
    setPasswordConf(event.target.value);
    if (password !== event.target.value && messagePwd === '') {
      setMessagePwd('Password confirmation is different from password');
    } else if (password === event.target.value && messagePwd === 'Password confirmation is different from password') {
      setMessagePwd('');
      setSubmitDisabled(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <FormControl fullWidth>
          <TextField
            type="password"
            name="password"
            label="password"
            value={password}
            onChange={handleChangePassword}
          />
        </FormControl>
        <FormHelperText error>{messagePwd}</FormHelperText>
        <FormControl fullWidth>
          <TextField
            type="password"
            name="passwordConf"
            label="password confirmation"
            value={passwordConf}
            onChange={handleChangePasswordConf}
          />
        </FormControl>
        <FormControl fullWidth>
          <FlatButton
            type="submit"
            name="submit"
            disabled={submitDisabled}
            onChange={handleSubmit}
          >
            SUBMIT
          </FlatButton>
        </FormControl>
      </form>
    </div>

  );
}
export default ResetPwdForm;
