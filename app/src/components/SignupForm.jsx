import React from 'react';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      password_conf: '',
      email: '',
      email_conf: '',
      message_pwd: '',
      message_email:'',
    };

    this.handleChangeLogin = this.handleChangeLogin.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangePasswordConf = this.handleChangePasswordConf.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeEmailConf = this.handleChangeEmailConf.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeLogin(event) {
    this.setState({ login: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
    if (this.state.password_conf != event.target.value && this.state.password_conf != ''){
      this.state.message_pwd = "Password confirmation is different from password";
    }
    else{
      this.state.message_pwd = "";
    }
  }

  handleChangePasswordConf(event) {
    this.setState({ password_conf: event.target.value });
    if (this.state.password != event.target.value){
      this.state.message_pwd = "Password confirmation is different from password";
    }
    else{
      this.state.message_pwd = "";
    }
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
    if (this.state.email_conf !== event.target.value && this.state.email_conf != ''){
      this.state.message_email = "Email confirmation is different from email";
    }
    else {
      this.state.message_email = "";
    }
  }
  
  handleChangeEmailConf(event) {
    this.setState({ email_conf: event.target.value });
    if (this.state.email != event.target.value){
      this.state.message_email = "Email confirmation is different from email";
    }
    else {
      this.state.message_email = "";
    }
  }

  handleSubmit(event) {
    const { login, password, email } = this.state;
    const { parentCallback } = this.props;
    parentCallback([login, password, email]);
    event.preventDefault();
  }

  render() {
    const { login, password, password_conf, email, email_conf, message_pwd, message_email } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="login" placeholder="login" value={login} onChange={this.handleChangeLogin} required /><br/>
          <p>{message_pwd}</p>
          <input type="password" name="pwd" placeholder="password" value={password} onChange={this.handleChangePassword} required />
          <input type="password" name="pwd" placeholder="confirm password" value={password_conf} onChange={this.handleChangePasswordConf} required />
          <p>{message_email}</p>
          <input type="email" name="email" placeholder="email" value={email} onChange={this.handleChangeEmail} required />
          <input type="email" name="email" placeholder="confirm email" value={email_conf} onChange={this.handleChangeEmailConf} required /><br/>
          <input type="submit" name="submit" value="submit" />
        </form>
      </div>
    );
  }
}

export default SignupForm;
