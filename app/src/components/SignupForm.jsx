import React from 'react';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      passwordConf: '',
      email: '',
      emailConf: '',
      messagePwd: '',
      messageEmail: '',
      pwdIsValid: 0,
      emailIsValid: 0,
      disableSubmit: 1,
    };

    this.updateSubmitAbility = this.updateSubmitAbility.bind(this);
    this.allFieldsAreSet = this.allFieldsAreSet.bind(this);
    this.handleChangeLogin = this.handleChangeLogin.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangePasswordConf = this.handleChangePasswordConf.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeEmailConf = this.handleChangeEmailConf.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  allFieldsAreSet() {
    const {
      login, password, passwordConf, email, emailConf,
    } = this.state;
    let test = 0;
    const tabParams = [login, password, passwordConf, email, emailConf];
    tabParams.forEach((item) => {
      if (item.length === 0) {
        test = 1;
      }
    });
    if (test > 0) {
      return (0);
    }
    return (1);
  }

  updateSubmitAbility() {
    const { pwdIsValid, emailIsValid } = this.state;
    this.state.disableSubmit = 1;
    if (pwdIsValid && emailIsValid && this.allFieldsAreSet()) {
      this.state.disableSubmit = 0;
    }
  }

  handleChangeLogin(event) {
    this.setState({ login: event.target.value });
  }

  handleChangePassword(event) {
    let { messagePwd } = this.state;
    this.setState({ password: event.target.value });
    const { passwordConf } = this.state;
    const password = event.target.value;
    this.state.pwdIsValid = 0;
    if (password.toUpperCase() === password && password.length > 0) {
      messagePwd = 'Password must contain one lower case';
    } else if (password.toLowerCase() === password && password.length > 0) {
      messagePwd = 'Password must contain one upper case';
    } else if (!password.match(/\d+/) && password.length > 0) {
      messagePwd = 'Password must contain one digit';
    } else if (password.length < 9 && password.length > 0) {
      messagePwd = 'Password should be at least 9 characters long';
    } else if (passwordConf !== event.target.value && passwordConf !== '') {
      messagePwd = 'Password confirmation is different from password';
    } else {
      messagePwd = '';
      if (password.length > 0 && passwordConf.length > 0) {
        this.state.pwdIsValid = 1;
      }
    }
    this.updateSubmitAbility();
    this.state.messagePwd = messagePwd;
  }

  handleChangePasswordConf(event) {
    const { password } = this.state;
    let { messagePwd } = this.state;
    this.state.pwdIsValid = 0;
    this.setState({ passwordConf: event.target.value });
    if (password !== event.target.value && messagePwd === '') {
      messagePwd = 'Password confirmation is different from password';
    } else if (password === event.target.value && messagePwd === 'Password confirmation is different from password') {
      messagePwd = '';
      this.state.pwdIsValid = 1;
    }
    this.state.messagePwd = messagePwd;
    this.updateSubmitAbility();
  }

  handleChangeEmail(event) {
    const { emailConf } = this.state;
    this.setState({ email: event.target.value });
    this.state.emailIsValid = 0;
    if (!event.target.value.match(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/) && event.target.value.length > 0) {
      this.state.messageEmail = 'This Email address is invalid';
    } else if (emailConf !== event.target.value && emailConf !== '') {
      this.state.messageEmail = 'Email confirmation is different from email';
    } else {
      this.state.messageEmail = '';
      if (emailConf.length > 0) {
        this.state.emailIsValid = 1;
      }
    }
    this.updateSubmitAbility();
  }

  handleChangeEmailConf(event) {
    const { email } = this.state;
    let { messageEmail } = this.state;
    this.state.emailIsValid = 0;
    this.setState({ emailConf: event.target.value });
    if (email !== event.target.value) {
      messageEmail = 'Email confirmation is different from email';
    } else if (email === event.target.value && messageEmail === 'Email confirmation is different from email') {
      messageEmail = '';
      this.state.emailIsValid = 1;
    }
    this.state.messageEmail = messageEmail;
    this.updateSubmitAbility();
  }

  handleSubmit(event) {
    const { login, password, email } = this.state;
    const { parentCallback } = this.props;
    parentCallback([login, password, email]);
    event.preventDefault();
  }

  render() {
    const {
      login, password, passwordConf, email, emailConf, messagePwd, messageEmail, disableSubmit,
    } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="login" placeholder="login" value={login} onChange={this.handleChangeLogin} required />
          <br />
          <p>{messagePwd}</p>
          <input type="password" name="pwd" placeholder="password" value={password} onChange={this.handleChangePassword} required />
          <input type="password" name="pwd" placeholder="confirm password" value={passwordConf} onChange={this.handleChangePasswordConf} required />
          <p>{messageEmail}</p>
          <input type="email" name="email" placeholder="email" value={email} onChange={this.handleChangeEmail} required />
          <input type="email" name="email" placeholder="confirm email" value={emailConf} onChange={this.handleChangeEmailConf} required />
          <br />
          <input type="submit" name="submit" value="submit" disabled={disableSubmit} />
        </form>
      </div>
    );
  }
}

export default SignupForm;
