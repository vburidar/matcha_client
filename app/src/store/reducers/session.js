import {
  UPDATE_CONNECTION_STATUS,
} from '../actionTypes';

const updateConnectionStatusReducer = {
  actionType: UPDATE_CONNECTION_STATUS,
  reduce: (state, action) => (
    { ...state, se: action.payload }
  ),
};

export default updateConnectionStatusReducer;
