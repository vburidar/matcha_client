import React, { useState, useEffect, useContext } from 'react';
import { FormControl, FormHelperText } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FlatButton from '@material-ui/core/Button';
import api from '../api';
import { StoreContext } from '../store/Store';

function SignedInChecker() {
  const [signedIn, setSignedIn] = useState(false);
  const [response, setResponse] = useState('');
  const myStore = useContext(StoreContext);

  useEffect(() => {
    try {
      api.post('auth/ping').then((test) => {
        setResponse(test.data);
        console.log(test.data.message);
        if (test.data.message === 'in_session') {
          console.log('in_session');
          myStore.dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true });
          myStore.dispatch({ type: 'UPDATE_CONNECTION_STATUS', login: test.data.login });
        } else {
          myStore.dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: false });
        }
      });
    } catch (err) {
      setSignedIn(false);
    }
  }, []);

  return (
    <div>
      <h1>{response.message}</h1>
    </div>
  );
}

export default SignedInChecker;
