import {
  UPDATE_MESSAGE,
  UPDATE_MESSAGE_WITH_SEVERITY,
} from '../actionTypes';

/** payload.message */
export const updateMessageAction = async (dispatch, payload) => dispatch({
  type: UPDATE_MESSAGE,
  payload,
});

/** payload.message, payload.severity */
export const updateMessageWithSeverityAction = async (dispatch, payload) => dispatch({
  type: UPDATE_MESSAGE_WITH_SEVERITY,
  payload,
});
