import React, { useState, useEffect } from 'react';
import api from '../api';
import SignupForm from '../components/SignupForm';


function HomePage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const callbackLogin = async ([childLogin, childPassword, childEmail]) => {
    setLogin(childLogin);
    setPassword(childPassword);
    setEmail(childEmail);
  };

  useEffect(() => {
    async function createUser() {
      if (login !== '' && password !== '' && email !== '') {
        const user = await api.post('users', {
          login,
          password,
          email,
        });
        console.log('User created!', user);
      }
    }
    createUser();
  });

  return (
    <div>
      <h1>Sign up today</h1>
      <SignupForm parentCallback={callbackLogin} />
      <p>{login}</p>
      <p>{password}</p>
      <p>{email}</p>
    </div>
  );
}

export default HomePage;
