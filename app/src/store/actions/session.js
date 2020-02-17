import {
  UPDATE_CONNECTION_STATUS,
} from '../actionTypes';

export const updateConnectionStatus = async (dispatch, payload) => dispatch({
  type: UPDATE_CONNECTION_STATUS,
  payload,
});
