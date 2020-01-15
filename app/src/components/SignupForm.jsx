import React from 'react';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      email: '',
    };

    this.handleChangeLogin = this.handleChangeLogin.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeLogin(event) {
    this.setState({ login: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleSubmit(event) {
    const { login, password, email } = this.state;
    const { parentCallback } = this.props;

    parentCallback([login, password, email]);
    event.preventDefault();
  }

  render() {
    const { login, password, email } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="login" placeholder="login" value={login} onChange={this.handleChangeLogin} required />
        <input type="password" name="pwd" placeholder="password" value={password} onChange={this.handleChangePassword} required />
        <input type="email" name="email" placeholder="email" value={email} onChange={this.handleChangeEmail} required />
        <input type="submit" name="submit" value="submit" />
      </form>
    );
  }
}

export default SignupForm;
