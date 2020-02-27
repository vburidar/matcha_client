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
      validation_code_invalid: 'This account can\'t be validated',
      invalid_nb_of_interests: 'Number of interests should be more than 2 and less than 7',
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
    console.log(err.response, err, err.status, err.message)
    const message = getErrorDict(err.response.data);
    console.log(err.response);
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
      resetPassword: 'Your password wa successfully updated. You can now log in with your new credentials',
      validateAccount: 'Your account was successfully validated. You can now log in',
      patchProfile: 'Your profile is now complete, you can now find the true love',
    };
    if (dict[key]) {
      return (dict[key]);
    }
    return ('Success!');
  }

  const showNotification = (data, requestName) => {
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
    getUsers: () => (api.get('users').catch(handleError)),
    forgotPwd: async (data) => (showNotification(await api.post('auth/forgotPwd', data).catch(handleError), 'forgotPwd')),
    resetPassword: async (data) => (showNotification(await api.post('auth/resetPwd', data).catch(handleError), 'resetPassword')),
    signin: async (data) => (showNotification(await api.post('auth/signin', data).catch(handleError), 'signin')),
    signup: async (data) => (showNotification(await api.post('auth/signup', data).catch(handleError), 'signup')),
    validateAccount: async (data) => (showNotification(await api.post('auth/accountValidation', data).catch(handleError), 'validateAccount')),
    patchProfile: async (data) => (showNotification(await api.patch('profile', data).catch(handleError), 'patchProfile')),
    sessionDelete: () => (api.delete('auth/deleteSession').catch(handleError)),
    createBlock: async (data) => (showNotification(await api.post('event/block', data).catch(handleError), 'blockUser')),
    deleteBlock: async (data) => (showNotification(await api.delete('event/block', data).catch(handleError), 'deleteBlock')),
    createReport: async (data) => (showNotification(await api.post('event/report', data).catch(handleError), 'reportUser')),
    searchUsers: async (data) => (showNotification(await api.get('users/custom', data).catch(handleError), 'searchUsers')),
    createMessage: async (data) => (api.post('users/message', data).catch(handleError)),
  };

  return (
    <ApiContext.Provider value={routes}>
      {children}
    </ApiContext.Provider>
  );
}
