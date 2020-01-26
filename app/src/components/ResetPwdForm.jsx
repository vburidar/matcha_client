import React, { useState, useEffect } from 'react';
import { FormControl, FormHelperText } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FlatButton from '@material-ui/core/Button';
import api from '../api';

function ResetPwdForm(
  { login, code },
) {
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [messagePwd, setMessagePwd] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);

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
    console.log(code);
    console.log(login);
    setSubmitDisabled(true);
    setPasswordConf(event.target.value);
    if (password !== event.target.value && messagePwd === '') {
      setMessagePwd('Password confirmation is different from password');
    } else if (password === event.target.value && messagePwd === 'Password confirmation is different from password') {
      setMessagePwd('');
      setSubmitDisabled(false);
    }
  };

  const submitResetForm = () => {
    async function readUser() {
      if (login) {
        try {
          await api.post('auth/resetPwd', {
            login,
            password,
            code,
          });
          //Router.replace('/resetPwd', '/signin', { shallow: true });
        } catch (err) {
          console.log(err);
        }
      }
    }
    readUser();
  };

  return (
    <div>
      <form noValidate>
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
            //onChange={handleSubmit}
            onClick={submitResetForm}
          >
            SUBMIT
          </FlatButton>
        </FormControl>
      </form>
    </div>

  );
}
export default ResetPwdForm;
