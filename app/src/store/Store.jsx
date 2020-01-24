import { useReducer, createContext } from 'react';

import reducer from './reducers';

export const StoreContext = createContext();

const initialState = {
  message: '',
  severity: '',
  open: false,
};

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}
