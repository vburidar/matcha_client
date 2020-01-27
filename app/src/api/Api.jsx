import { createContext, useContext } from 'react';
import axios from 'axios';

import { StoreContext } from '../store/Store';
import { newNotification } from '../store/actions';

export const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const { dispatch } = useContext(StoreContext);

  const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    withCredentials: true,
    headers: { 'Access-Control-Allow-Origin': 'http://localhost:3000/' },
  });

  const handleError = (err) => {
    const message = err.response.data.message || 'Unknown error';
    const severity = 'error';
    newNotification(
      dispatch,
      { message, severity },
    );
  };

  const routes = {
    getToto: () => (api.get('auth/toto').catch(handleError)),
    getUsers: () => (api.get('users').catch(handleError)),
    forgotPwd: (data) => (api.post('auth/forgotPwd', data).catch(handleError)),
    resetPwd: (data) => (api.post('auth/resetPwd', data).catch(handleError)),
    signin: (data) => (api.post('auth/signin', data).catch(handleError)),
    signup: (data) => (api.post('auth/signup', data).catch(handleError)),
    accountValidation: (data) => (api.post('auth/accountValidation', data).catch(handleError)),
  };

  return (
    <ApiContext.Provider value={routes}>
      {children}
    </ApiContext.Provider>
  );
}
