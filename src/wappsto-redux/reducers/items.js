import {
  ADD_ITEM,
  REMOVE_ITEM
} from "../actions/items";
import reducerRegistry from "../util/reducerRegistry";

const initialState = {};

export default function reducer(state = initialState, action){
  switch(action.type){
    case ADD_ITEM:
      let data;
      if(action.data && action.data.constructor === Function){
        data = action.data(state[action.name]);
      } else {
        data = action.data;
      }
      return Object.assign({}, state, {
        [action.name]: data
      });
    case REMOVE_ITEM:
      state = Object.assign({}, state);
      delete state[action.name];
      return state;
    default:
      break;
  }
  return state;
}

reducerRegistry.register("items", reducer);
