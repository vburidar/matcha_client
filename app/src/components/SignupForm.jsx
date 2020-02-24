import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

import { FormHelperText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1, 0),
  },
  button: {
    color: theme.palette.primary,
  },
}));
export default function SignupForm(
  { signupData },
) {
  const [login, setLogin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [email, setEmail] = useState('');
  const [messageEmail, setMessageEmail] = useState('');
  const [emailConf, setEmailConf] = useState('');
  const [messagePwd, setMessagePwd] = useState('');
  const [pwdIsValid, setPwdIsValid] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [firstNameIsValid, setFirstNameIsValid] = useState(false);
  const [lastNameIsValid, setLastNameIsValid] = useState(false);
  const [loginIsValid, setLoginIsValid] = useState(false);
  const [messageLogin, setMessageLogin] = useState('');
  const [messageFirstName, setMessageFirstName] = useState('');
  const [messageLastName, setMessageLastName] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(true);
  const classes = useStyles();

  const allFieldsAreSet = () => {
    let test = 0;
    const tabParams = [firstName, lastName, login, password, passwordConf, email, emailConf];
    tabParams.forEach((item) => {
      if (item.length === 0) {
        test = true;
      }
    });
    if (test) {
      return (false);
    }
    return (true);
  };

  const handleChangeLogin = (event) => {
    setLoginIsValid(false);
    setDisableSubmit(true);
    setLogin(event.target.value);
    if (event.target.value.length > 3) {
      setLoginIsValid(true);
      setDisableSubmit(!(allFieldsAreSet() && pwdIsValid && emailIsValid));
      setMessageLogin('');
    } else {
      setMessageLogin('Login should be at least 4 characters long');
    }
  };

  const handleChangeFirstName = (event) => {
    setFirstNameIsValid(false);
    setDisableSubmit(true);
    setFirstName(event.target.value);
    if (event.target.value.length > 1) {
      setFirstNameIsValid(true);
      setDisableSubmit(!(allFieldsAreSet() && pwdIsValid && emailIsValid && loginIsValid && lastNameIsValid));
      setMessageFirstName('');
    } else {
      setMessageFirstName('First Name should be at least 2 characters long');
    }
  };

  const handleChangeLastName = (event) => {
    setLastNameIsValid(false);
    setDisableSubmit(true);
    setLastName(event.target.value);
    if (event.target.value.length > 1) {
      setLastNameIsValid(true);
      setDisableSubmit(!(allFieldsAreSet() && pwdIsValid && emailIsValid && loginIsValid && firstNameIsValid));
      setMessageLastName('');
    } else {
      setMessageLastName('Last Name should be at least 2 characters long');
    }
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    setPwdIsValid(false);
    setDisableSubmit(true);
    if (event.target.value.toUpperCase() === event.target.value && event.target.value.length > 0) {
      setMessagePwd('Password must contain one lowercase character');
    } else if (event.target.value.toLowerCase() === event.target.value && event.target.value.length > 0) {
      setMessagePwd('Password must contain one uppercase character');
    } else if (!event.target.value.match(/\d+/) && event.target.value.length > 0) {
      setMessagePwd('Password must contain one digit');
    } else if (event.target.value.length < 9 && event.target.value.length > 0) {
      setMessagePwd('Password should be at least 9 characters long');
    } else if (passwordConf !== event.target.value && passwordConf !== '') {
      setMessagePwd('Password is different from password confirmation');
    } else {
      setMessagePwd('');
      if (event.target.value.length > 0 && passwordConf.length > 0) {
        setPwdIsValid(true);
        setDisableSubmit(!(allFieldsAreSet() && emailIsValid && loginIsValid));
      }
    }
  };

  const handleChangePasswordConf = (event) => {
    setPwdIsValid(false);
    setDisableSubmit(true);
    setPasswordConf(event.target.value);
    if (password !== event.target.value && messagePwd === '') {
      setMessagePwd('Password is different from password confirmation');
    } else if (password === event.target.value && messagePwd === 'Password is different from password confirmation') {
      setMessagePwd('');
      setPwdIsValid(true);
      setDisableSubmit(!(allFieldsAreSet() && emailIsValid && loginIsValid));
    }
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
    setEmailIsValid(false);
    setDisableSubmit(true);
    if (!event.target.value.match(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/) && event.target.value.length > 0) {
      setMessageEmail('This Email address is invalid');
    } else if (emailConf !== event.target.value && emailConf !== '') {
      setMessageEmail('Email is different from email confirmation');
    } else {
      setMessageEmail('');
      if (emailConf.length > 0) {
        setEmailIsValid(true);
        setDisableSubmit(!(allFieldsAreSet() && pwdIsValid && loginIsValid));
      }
    }
  };

  const handleChangeEmailConf = (event) => {
    setEmailIsValid(false);
    setDisableSubmit(true);
    setEmailConf(event.target.value);
    if (email !== event.target.value && messageEmail === '') {
      setMessageEmail('Email is different from email confirmation');
    } else if (email === event.target.value && messageEmail === 'Email is different from email confirmation') {
      setMessageEmail('');
      setEmailIsValid(true);
      setDisableSubmit(!(allFieldsAreSet() && pwdIsValid && loginIsValid));
    }
  };

  const handleSubmit = (event) => {
    signupData([login, firstName, lastName, password, email]);
    event.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            type="text"
            name="login"
            label="login"
            value={login}
            onChange={handleChangeLogin}
            required
          />
        </FormControl>
        <FormHelperText error>{messageLogin}</FormHelperText>
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            type="text"
            name="last name"
            label="last name"
            value={lastName}
            onChange={handleChangeLastName}
            required
          />
        </FormControl>
        <FormHelperText error>{messageLastName}</FormHelperText>
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            type="text"
            name="first name"
            label="first name"
            value={firstName}
            onChange={handleChangeFirstName}
            required
          />
        </FormControl>
        <FormHelperText error>{messageFirstName}</FormHelperText>
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            type="password"
            name="pwd"
            label="password"
            value={password}
            onChange={handleChangePassword}
            required
          />
        </FormControl>
        <FormHelperText error>{messagePwd}</FormHelperText>
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            type="password"
            name="pwd"
            label="confirm password"
            value={passwordConf}
            onChange={handleChangePasswordConf}
            required
          />
        </FormControl>
        <br />
        <br />
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            fullWidth
            type="email"
            name="email"
            label="email"
            value={email}
            onChange={handleChangeEmail}
            required
          />
        </FormControl>
        <FormHelperText error>{messageEmail}</FormHelperText>
        <FormControl fullWidth className={classes.formControl}>
          <TextField
            type="email"
            name="email"
            label="confirm email"
            value={emailConf}
            onChange={handleChangeEmailConf}
            required
          />
        </FormControl>
        <FormControl fullWidth className={classes.formControl}>
          <Button
            className={classes.button}
            type="submit"
            id="submit"
            name="submit"
            disabled={disableSubmit}
          >
            SUBMIT
          </Button>
        </FormControl>
      </form>
    </div>
  );
}
