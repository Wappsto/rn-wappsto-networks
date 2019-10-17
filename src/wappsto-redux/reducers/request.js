import {
  REQUEST_PENDING,
  REQUEST_ERROR,
  REQUEST_SUCCESS,
  REMOVE_REQUEST,
  REMOVE_REQUEST_ERROR
} from "../actions/request";
import reducerRegistry from "../util/reducerRegistry";

const initialState = { errors: {}};

function getActionState(action, state, status){
  let { method, url, json, options } = action;
  return Object.assign({}, state, {
    [url]: {
      status,
      method,
      url,
      json,
      options
    }
  });
}

export default function reducer(state = initialState, action){
  switch(action.type){
    case REQUEST_PENDING:
      state = getActionState(action, state, "pending");
      delete state.errors[action.method + "_" + action.url];
      state[action.url].body = action.body;
      return state;
    case REQUEST_SUCCESS:
      return getActionState(action, state, "success");
    case REQUEST_ERROR:
      state = getActionState(action, state, "error");
      state[action.url].responseStatus = action.responseStatus;
      state.errors[action.method + "_" + action.url] = state[action.url];
      return state;
    case REMOVE_REQUEST:
      state = Object.assign({}, state);
      delete state[action.url];
      if(action.method){
        delete state.errors[action.method + "_" + action.url]
      }
      return state;
    case REMOVE_REQUEST_ERROR:
      state = Object.assign({}, state);
      delete state.errors[action.method + "_" + action.url]
      return state;
  }
  return state;
}

reducerRegistry.register("request", reducer);
