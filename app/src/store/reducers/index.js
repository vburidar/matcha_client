import notificationsReducer from './notifications';
import sessionReducer from './session';

const combinedReducers = []
  .concat(notificationsReducer)
  .concat(sessionReducer);

export default function rootReducer(state, action) {
  const reducer = combinedReducers.find((el) => el.actionType === action.type);
  if (typeof reducer === 'undefined') {
    return state;
  }
  return reducer.reduce(state, action);
}
