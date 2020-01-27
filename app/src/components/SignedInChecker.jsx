import { useEffect, useContext } from 'react';
import api from '../api';
import { StoreContext } from '../store/Store';
import { updateConnectionStatus } from '../store/actions';



function SignedInChecker() {
  const { dispatch } = useContext(StoreContext);

  useEffect(() => {
    try {
      api.post('auth/ping').then((test) => {
        if (test.data.message === 'in_session') {
          updateConnectionStatus(dispatch, { inSession: true, login: test.data.login });
        } else {
          updateConnectionStatus(dispatch, { inSession: false, login: '' });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (null);
}

export default SignedInChecker;
