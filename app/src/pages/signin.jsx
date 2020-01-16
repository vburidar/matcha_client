import React, { useState, useEffect } from 'react';
import api from '../api';
import SigninForm from '../components/SigninForm';

function HomePage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const callbackSigninData = async ([childLogin, childPassword]) => {
    setLogin(childLogin);
    setPassword(childPassword);
  };

  useEffect(() => {
    async function readUser() {
      if (login !== '' && password !== '') {
        // requete node
        // const user = await api.post('users', {
        //  login,
        //  password,
        // });
      }
    }
    readUser();
  });

  return (
    <div>
      <h1>Sign in</h1>
      <SigninForm parentCallback={callbackSigninData} />
      <a href="/resetPwd">Forgot your password?</a>
      <p>{login}</p>
      <p>{password}</p>
    </div>
  );
}

export default HomePage;
