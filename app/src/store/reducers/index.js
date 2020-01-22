import notificationsReducer from './notifications';

const combinedReducers = []
  .concat(notificationsReducer);

export default function rootReducer(state, action) {
  const reducer = combinedReducers.find((el) => el.actionType === action.type);
  if (typeof reducer === 'undefined') {
    return state;
  }
  return reducer.reduce(state, action);
}
