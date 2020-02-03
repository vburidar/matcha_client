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

  function getErrorDict(key) {
    const dict = {
      session_does_not_exist: 'You are already logged out',
      user_logged_already: 'You are already logged in',
      validation_link_invalid: 'You url link is invalid',
      login_invalid: 'Wrong login or password',
      password_invalid: 'Wrong login or password',
      account_not_validated: 'Your account is not validated yet. Please wait for an email with further instructions',
      value_already_exist: 'Those credentials are already in use',
      email_invalid: 'This email didn\'nt show up in our database. Are you sure you registered with this address?',
    };
    if (key.match('invalid-password')) {
      return ('Wrong login or password');
    }
    if (dict[key]) {
      return (dict[key]);
    }
    return ('Unknown error');
  }

  const handleError = (err) => {
    console.log(err.response);
    const message = getErrorDict(err.response.data);
    const severity = 'error';
    newNotification(
      dispatch,
      { message, severity },
    );
    return ({ type: 'error' });
  };

  function getNotificationDict(key) {
    const dict = {
      signup: 'Your account was successfully created! Wait for our email with our validation link',
      signin: 'Welcome back!',
      forgotPwd: 'An Email with a reset link has been sent to your email address',
      resetPwd: 'Your password wa successfully updated. You can now log in with your new credentials',
      validateAccount: 'Your account was successfully validated. You can now log in',
    };
    if (dict[key]) {
      return (dict[key]);
    }
    return ('Success!');
  }

  const showNotification = (data, requestName) => {
    console.log('notification', data);
    if (data.type !== 'error') {
      const message = getNotificationDict(requestName);
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
    resetPwd: async (data) => (showNotification(await api.post('auth/resetPwd', data).catch(handleError), 'resetPwd')),
    signin: async (data) => (showNotification(await api.post('auth/signin', data).catch(handleError), 'signin')),
    signup: async (data) => (showNotification(await api.post('auth/signup', data).catch(handleError), 'signup')),
    validateAccount: async (data) => (showNotification(await api.post('auth/accountValidation', data).catch(handleError), 'validateAccount')),
    sessionDelete: () => (api.delete('auth/deleteSession').catch(handleError)),
  };

  return (
    <ApiContext.Provider value={routes}>
      {children}
    </ApiContext.Provider>
  );
}
