import React from 'react';

class SigninForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      submitDisable: 1,
    };
    this.updateSubmitAbility = this.updateSubmitAbility.bind(this);
    this.handleChangeLogin = this.handleChangeLogin.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateSubmitAbility() {
    const { login, password } = this.state;
    if (login.length > 0 && password.length > 0) {
      this.state.submitDisable = 0;
    }
  }

  handleChangeLogin(event) {
    this.setState({ login: event.target.value });
    this.updateSubmitAbility();
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
    this.updateSubmitAbility();
  }

  handleSubmit(event) {
    const { login, password } = this.state;
    const { parentCallback } = this.props;
    parentCallback([login, password]);
    event.preventDefault();
  }

  render() {
    const { login, password, submitDisable } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="login" value={login} onChange={this.handleChangeLogin} />
          <input type="password" placeholder="password" value={password} onChange={this.handleChangePassword} />
          <input type="submit" disabled={submitDisable} />
        </form>
      </div>
    );
  }
}

export default SigninForm;
