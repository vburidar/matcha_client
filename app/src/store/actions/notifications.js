import {
  NEW_NOTIFICATION,
  CLOSE_NOTIFICATION,
} from '../actionTypes';

/** payload.message, payload.severity */
const newNotification = async (dispatch, payload) => dispatch({
  type: NEW_NOTIFICATION,
  payload,
});

/** no payload */
const closeNotification = async (dispatch, payload) => dispatch({
  type: CLOSE_NOTIFICATION,
  payload,
});

export default {
  newNotification,
  closeNotification,
};
