import React, { useState, useEffect } from 'react';
import api from '../api';
import ResetPwdForm from '../components/ResetPwdForm';

function HomePage({ url }) {
  const [login, setLogin] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');

  const callbackResetData = async ([childPassword, childPasswordConf]) => {
    setPassword(childPassword);
    setPasswordConf(childPasswordConf);
    console.log(password);
  };

  useEffect(() => {
    setLogin(url.query.login);
    setCode(url.query.code);
    async function readUser() {
      if (login !== '' && password !== '') {
        const user = await api.post('auth/resetPwd', {
          login,
          password,
          code,
        });
        console.log(user);
      }
    }
    readUser();
  });


  return (
    <div>
      <h1>Reset your password</h1>
      <ResetPwdForm parentCallback={callbackResetData} />
      <p>{passwordConf}</p>
      <p>{password}</p>
    </div>
  );
}

export default HomePage;
