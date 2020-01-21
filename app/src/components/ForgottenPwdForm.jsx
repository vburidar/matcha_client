import React from 'react';

class ForgottenPwdForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      submitDisable: 1,
    };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(event) {
    const { email } = this.state;
    const { parentCallback } = this.props;
    parentCallback([email]);
    event.preventDefault();
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
    this.state.submitDisable = 1;
    if (event.target.value.match(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/) && event.target.value.length > 0) {
      this.state.submitDisable = 0;
    }
  }

  render() {
    const { email, submitDisable } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="email" name="email" placeholder="email" value={email} onChange={this.handleChangeEmail} />
        <input type="submit" name="submit" disabled={submitDisable} onChange={this.handleSubmit} />
      </form>

    );
  }
}

export default ForgottenPwdForm;
