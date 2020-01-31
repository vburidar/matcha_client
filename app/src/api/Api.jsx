import router from 'next/router';
import { createContext, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../store/Store';
import { newNotification } from '../store/actions';

export const ApiContext = createContext(null);

export function createApiRequester(req) {
  if (req === undefined) {
    return (axios.create({
      baseURL: 'http://localhost:8080/api',
      timeout: 10000,
      withCredentials: true,
      headers: { 'Access-Control-Allow-Origin': 'http://localhost:3000/' },
    }));
  }
  return (axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    withCredentials: true,
    headers: req.headers,
  }));
}

export async function IsSessionAuthOnPage(pageStatus, apiRequester) {
  try {
    let inSession = null;
    const apiResponse = await apiRequester.post('auth/ping');
    if (apiResponse.data.message === 'in_session') {
      inSession = true;
    } else if (apiResponse.data.message === 'not_in_session') {
      inSession = false;
    }
    if ((pageStatus === 'public_only' && inSession === true) || (pageStatus === 'private' && inSession === false)) {
      return (false);
    }
    return (apiResponse);
  } catch (err) {
    return ({ error: 'Failed to reach api server' });
  }
}

export function ApiProvider({ children }) {
  const { dispatch } = useContext(StoreContext);

  const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    withCredentials: true,
    headers: { 'Access-Control-Allow-Origin': 'http://localhost:3000/' },
  });

  const handleError = (err) => {
    console.log(err.response);
    const message = err.response.data || 'Unknown error';
    const severity = 'error';
    newNotification(
      dispatch,
      { message, severity },
    );
    return ({ type: 'error' });
  };

  const showNotification = (data, requestName) => {
    console.log('notification', data);
    if (data.type !== 'error') {
      let message = '';
      if (requestName === 'signup') {
        message = 'Your account was successfully created! Wait for our email with our validation link';
      }
      if (requestName === 'forgotPwd') {
        message = 'An Email with a reset link has been sent to your email address';
      }
      const severity = 'success';
      newNotification(
        dispatch,
        { message, severity },
      );
    }
    return (data);
  };

  const routes = {
    getToto: () => (api.get('auth/toto').catch(handleError)),
    getUsers: () => (api.get('users').catch(handleError)),
    forgotPwd: async (data) => (showNotification(await api.post('auth/forgotPwd', data).catch(handleError), 'forgotPwd')),
    resetPwd: (data) => (api.post('auth/resetPwd', data).catch(handleError)),
    signin: async (data) => (api.post('auth/signin', data).catch(handleError)),
    signup: async (data) => (showNotification(await api.post('auth/signup', data).catch(handleError), 'signup')),
    validateAccount: (data) => (api.post('auth/accountValidation', data).catch(handleError)),
    sessionDelete: () => (api.delete('auth/deleteSession').catch(handleError)),
  };

  return (
    <ApiContext.Provider value={routes}>
      {children}
    </ApiContext.Provider>
  );
}
