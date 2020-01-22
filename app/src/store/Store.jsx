import React, { useReducer } from 'react';

import reducer from './reducers';

export const Store = React.createContext();

const initialState = {
  message: '',
  severity: '',
};

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}
