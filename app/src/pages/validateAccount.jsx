import React, { useState, useEffect } from 'react';
import api from '../api';

function HomePage({ url }) {
  const ValidateAccount = () => {
    const [login, setLogin] = useState(url.query.login);
    const [code, setCode] = useState(url.query.code);

    useEffect(() => {
      async function validateAccount() {
        if (url.query.login !== undefined && url.query.code !== undefined) {
          setLogin(url.query.login);
          setCode(url.query.code);
          try {
            await api.post('auth/accountValidation', {
              login,
              code,
            });
            console.log('validation is successfull');
          } catch (err) {
            console.log('validation failed');
          }
        }
      }
      validateAccount();
    }, []);

    return (
      <div><p /></div>
    );
  };

  return (
    <div>
      <h1>Subscription validation</h1>
      <ValidateAccount />
      <div><p /></div>
    </div>
  );
}

export default HomePage;
