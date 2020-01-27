import { useEffect, useContext } from 'react';
import router from 'next/router';
import { StoreContext } from '../store/Store';
import { newNotification } from '../store/actions';
import { updateConnectionStatus } from '../store/actions';

import api from '../api';

function RouterComp() {
  const { state, dispatch } = useContext(StoreContext);

  useEffect(() => {
    console.log('in Router', state);
    if (state.pageStatus === 'public_only' && state.inSession) {
      router.push('/pages/homepage');
    } else if (state.pageStatus === 'private' && state.inSession === false) {
      router.push('/signin');
    }
  }, [state.pageStatus]);

  useEffect(() => {
    console.log('in useEffect');
    try {
      api.post('auth/ping').then((test) => {
        if (test.data.message === 'in_session') {
          console.log('in_session', test.data.login);
          updateConnectionStatus(dispatch, { inSession: true, login: test.data.login });
        } else {
          console.log('not in_session');
          //newNotification(dispatch, { message: 'toto', severity: 'error' });
          updateConnectionStatus(dispatch, { inSession: false, login: '' });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    console.log('state changed')
    console.log(state)
  }, [state])

  return (null);
}

export default RouterComp;
