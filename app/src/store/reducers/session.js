import {
  UPDATE_CONNECTION_STATUS,
} from '../actionTypes';

const updateConnectionStatusReducer = {
  actionType: UPDATE_CONNECTION_STATUS,
  reduce: (state, action) => (
    { ...state, user_id: action.user_id, inSession: action.inSession }
  ),
};

export default updateConnectionStatusReducer;
