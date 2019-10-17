export const ADD_ENTITIES = 'ADD_ENTITIES';
export const REMOVE_ENTITIES = 'REMOVE_ENTITIES';

export function addEntities(service, data, options = {}){
  return {
    type: ADD_ENTITIES,
    service,
    data,
    options
  }
}

export function removeEntities(service, ids, options = {}){
  return {
    type: REMOVE_ENTITIES,
    service,
    options
  }
}
