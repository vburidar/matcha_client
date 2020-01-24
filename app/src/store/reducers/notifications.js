import {
  NEW_NOTIFICATION,
  CLOSE_NOTIFICATION,
} from '../actionTypes';

const newNotificationReducer = {
  actionType: NEW_NOTIFICATION,
  reduce: (state, action) => (
    {
      ...state,
      message: action.payload.message,
      severity: action.payload.severity,
      open: true,
    }
  ),
};

const closeNotificationReducer = {
  actionType: CLOSE_NOTIFICATION,
  reduce: (state) => (
    {
      ...state,
      open: false,
    }
  ),
};

export default [
  newNotificationReducer,
  closeNotificationReducer,
];
