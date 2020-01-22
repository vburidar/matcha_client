import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/router'
import api from '../api';

function HomePage({ url }) {
  const router = useRouter();
  const ValidateAccount = () => {
    const [login, setLogin] = useState(router.query.login);
    const [code, setCode] = useState(router.query.code);

    useEffect(() => {
      async function validateAccount() {
        if (router.query.login !== undefined && router.query.code !== undefined) {
          setLogin(router.query.login);
          setCode(router.query.code);
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
