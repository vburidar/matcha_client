import React, { useState, useEffect } from 'react';
import api from '../api';
import SigninForm from '../components/SigninForm';

function HomePage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const callbackLogin = async ([childLogin, childPassword]) => {
    setLogin(childLogin);
    setPassword(childPassword);
  };

  useEffect(() => {
    async function readUser() {
      if (login !== '' && password !== '') {
        //requete node
        //const user = await api.post('users', {
        //  login,
        //  password,
        //});
        console.log('logged in ' + login + ' ' + password);
      }
    }
    readUser();
  });

  return (
    <div>
      <h1>Sign in</h1>
      <SigninForm parentCallback={callbackLogin} />
      <p>{login}</p>
      <p>{password}</p>
    </div>
  );
}

export default HomePage;