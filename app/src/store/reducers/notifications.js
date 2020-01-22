import {
  UPDATE_MESSAGE,
  UPDATE_MESSAGE_WITH_SEVERITY,
} from '../actionTypes';

const updateMessageReducer = {
  actionType: UPDATE_MESSAGE,
  reduce: (state, action) => (
    { ...state, message: action.payload }
  ),
};

const updateMessageWithSeverityReducer = {
  actionType: UPDATE_MESSAGE_WITH_SEVERITY,
  reduce: (state, action) => (
    { ...state, message: action.payload.message, severity: action.payload.severity }
  ),
};

export default [
  updateMessageReducer,
  updateMessageWithSeverityReducer,
];
