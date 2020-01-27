import {
  UPDATE_CONNECTION_STATUS,
  UPDATE_PAGE_STATUS,
} from '../actionTypes';

const updateConnectionStatus = async (dispatch, payload) => dispatch({
  type: UPDATE_CONNECTION_STATUS,
  payload,
});

const updatePageStatus = async (dispatch, payload) => dispatch({
  type: UPDATE_PAGE_STATUS,
  payload,
});


export default {
  updateConnectionStatus,
  updatePageStatus,
};
