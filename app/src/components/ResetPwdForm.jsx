import React from 'react';

class ResetPwdForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordConf: '',
      messagePwd: '',
      submitDisabled: 1,
    };
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangePasswordConf = this.handleChangePasswordConf.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const { password, passwordConf } = this.state;
    const { parentCallback } = this.props;
    parentCallback([password, passwordConf]);
    event.preventDefault();
  }

  handleChangePassword(event) {
    let { messagePwd } = this.state;
    this.setState({ password: event.target.value });
    const { passwordConf } = this.state;
    const password = event.target.value;
    this.state.pwdIsValid = 1;
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
        this.submitDisabled = 0;
      }
    }
    this.state.messagePwd = messagePwd;
  }

  handleChangePasswordConf(event) {
    const { password } = this.state;
    let { messagePwd } = this.state;
    this.state.pwdIsValid = 1;
    this.setState({ passwordConf: event.target.value });
    if (password !== event.target.value && messagePwd === '') {
      messagePwd = 'Password confirmation is different from password';
    } else if (password === event.target.value && messagePwd === 'Password confirmation is different from password') {
      messagePwd = '';
      this.state.submitDisabled = 0;
    }
    this.state.messagePwd = messagePwd;
  }

  render() {
    const {
      password, passwordConf, messagePwd, submitDisabled,
    } = this.state;
    return (
      <div>
        <p>{messagePwd}</p>
        <form onSubmit={this.handleSubmit}>
          <input type="password" name="password" placeholder="password" value={password} onChange={this.handleChangePassword} />
          <input type="password" name="passwordConf" placeholder="password confirmation" value={passwordConf} onChange={this.handleChangePasswordConf} />
          <input type="submit" name="submit" disabled={submitDisabled} onChange={this.handleSubmit} />
        </form>
      </div>

    );
  }
}

export default ResetPwdForm;
