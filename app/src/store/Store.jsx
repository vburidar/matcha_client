import React, { useReducer } from 'react';

import reducer from './reducers';

export const Store = React.createContext();

const initialState = {
  message: '',
  severity: '',
  inSession: false,
};

export function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}
