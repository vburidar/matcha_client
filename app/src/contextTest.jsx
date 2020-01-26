import React, { createContext, useReducer } from 'react';

const initialState = {};
const contextTest = createContext(initialState);
const { Provider } = contextTest;

const StateProvider = ({ children }) => {
  let newState = null;
  const [state, dispatch] = useReducer((state, action) => {
    console.log(action.type);
    switch (action.type) {
      case 'UPDATE_CONNECTION_STATUS':
        newState = state;
        newState.connected = action.connected;
        return newState;
      case 'UPDATE_USER_INFO':
        newState = state;
        newState.login = action.login;
        return newState;
      default:
        throw new Error('Store error');
    }
  }, initialState);

  return <contextTest.Provider value={{ state, dispatch }}>{children}</contextTest.Provider>;
};

export { contextTest, StateProvider };
