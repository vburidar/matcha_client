import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_PAGE_STATUS,
} from '../actionTypes';

const updateConnectionStatusReducer = {
  actionType: UPDATE_CONNECTION_STATUS,
  reduce: (state, action) => (
    { ...state, inSession: action.payload.inSession, login: action.payload.login }
  ),
};

const updatePageStatusReducer = {
  actionType: UPDATE_PAGE_STATUS,
  reduce: (state, action) => (
    { ...state, inSession: action.payload.pageStatus }
  ),
};

export default [
  updateConnectionStatusReducer,
  updatePageStatusReducer,
];
