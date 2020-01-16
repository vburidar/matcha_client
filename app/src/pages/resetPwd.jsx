import React, { useState, useEffect } from 'react';
import api from '../api';
import ForgottenPwdForm from '../components/ForgottenPwdForm';

function HomePage() {
  const [email, setEmail] = useState('');

  const callbackEmail = async ([childEmail]) => {
    setEmail(childEmail);
  };

  useEffect(() => {
    async function readUser() {
      if (email !== '') {
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
      <h1>Forgot your password?</h1>
      <ForgottenPwdForm parentCallback={callbackEmail} />
      <p>{email}</p>
    </div>
  );
}

export default HomePage;
