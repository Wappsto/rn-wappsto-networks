import './reducers';
import { REMOVE_SESSION } from './actions/session';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import thunk from 'redux-thunk';
import reducerRegistry from './util/reducerRegistry';

export default function configureStore(initialState = {}) {
  // Preserve initial state for not-yet-loaded reducers
  const combine = (reducers) => {
    const reducerNames = Object.keys(reducers);
    Object.keys(initialState).forEach(item => {
      if (reducerNames.indexOf(item) === -1) {
        reducers[item] = (state = null) => state;
      }
    });
    const appReducer = combineReducers(reducers);
    return function rootReducer(state, action){
      if (action.type === REMOVE_SESSION) {
        state = undefined;
      }
      return appReducer(state, action);
    };
  };

  const store = createStore(
    combine(reducerRegistry.getReducers()),
    initialState,
    applyMiddleware(thunk)
  );

  // Replace the store's reducer whenever a new reducer is registered.
  reducerRegistry.setChangeListener(reducers => {
    store.replaceReducer(combine(reducers));
  });

  return store;
}
