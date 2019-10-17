import {
  ADD_SESSION,
  REMOVE_SESSION,
  INVALID_SESSION
} from "../actions/session";
import reducerRegistry from "../util/reducerRegistry";

const initialState = {};

export default function reducer(state = initialState, action){
  switch(action.type){
    case ADD_SESSION:
      return Object.assign({}, state, action.data, { valid: true });
    case REMOVE_SESSION:
      return {};
    case INVALID_SESSION:
      return Object.assign({}, state, {
        valid: false
      });
  }
  return state;
}

reducerRegistry.register("session", reducer);
