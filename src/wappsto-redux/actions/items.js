export const ADD_ITEM = "ADD_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";

export function setItem(name, data){
  return {
    type: ADD_ITEM,
    name,
    data
  }
}

export function removeItem(name){
  return {
    type: REMOVE_ITEM,
    name
  }
}
