import {normalize} from 'normalizr';

import {ADD_ENTITIES, REMOVE_ENTITIES} from '../actions/entities';
import schemas from '../util/schemas';
import schemaTree from '../util/schemaTree';
import {parse} from '../util/parser';
import reducerRegistry from '../util/reducerRegistry';

const initialState = {};

function mergeUnique(arr1, arr2) {
  let arr = [...arr1];
  arr2.forEach(e => {
    if (!arr1.includes(e)) {
      arr.push(e);
    }
  });
  return arr;
}

function addEntities(state, type, data) {
  if (!schemas.hasOwnProperty(type)) {
    schemas.generateGenericSchema(type);
  }
  data = normalize(data, [schemas[type]]);
  for (let key in data.entities) {
    state[key] = Object.assign({}, state[key], data.entities[key]);
  }
  return {state, result: data.result};
}

function removeEntities(state, type, ids) {
  ids.forEach(id => {
    let newData = removeEntity(state, type, id);
    state = newData.state;
  });
  return {state, result: []};
}

function removeAllEntities(state, type) {
  if (!schemas.hasOwnProperty(type)) {
    schemas.generateGenericSchema(type);
  }
  let def = schemaTree[type];
  let entities = state[def.name];
  if (entities) {
    let newData = removeEntities(state, type, Object.keys(entities));
    state = newData.state;
  }
  return {state, result: []};
}

function addChildEntities(state, type, id, child, data, reset = true) {
  let newData, result;
  let def = schemaTree[type];
  let element = state[def.name] && state[def.name][id];
  if (element) {
    let childDef = def.dependencies.find(d => d.key === child);
    if (childDef) {
      if (childDef.type === 'many') {
        newData = addEntities(state, child, data);
        result = newData.result;
        element[child] = reset ? result : mergeUnique(element[child], result);
      } else {
        newData = addEntity(state, child, data);
        result = newData.result;
        element[child] = result;
      }
      state = newData.state;
    }
  }
  return {state, result};
}

function removeChildEntities(state, type, id, child, ids) {
  let result, newData;
  let def = schemaTree[type];
  let element = state[def.name] && state[def.name][id];
  if (element) {
    let childDef = def.dependencies.find(d => d.key === child);
    if (childDef) {
      newData = removeEntities(state, child, ids || element[child]);
      state = newData.state;
      if (childDef.type === 'many') {
        if (ids) {
          result = element[child].filter(c => !ids.includes(c));
        } else {
          result = [];
        }
      } else {
        result = undefined;
      }
      element[child] = result;
    }
  }
  return {state, result};
}

function addEntity(state, type, data) {
  if (!schemas.hasOwnProperty(type)) {
    schemas.generateGenericSchema(type);
  }
  data = normalize(data, schemas[type]);
  for (let key in data.entities) {
    state[key] = Object.assign({}, state[key], data.entities[key]);
  }
  return {state, result: data.result};
}

function removeEntity(state, type, id) {
  let def = schemaTree[type];
  let element = state[def.name] && state[def.name][id];
  if (element) {
    def.dependencies.forEach(dep => {
      let newData = removeChildEntities(state, type, id, dep.key);
      state = newData.state;
    });
    delete state[def.name][id];
  }
  return {state};
}

export default function reducer(state = initialState, action) {
  let newData;
  switch (action.type) {
    case ADD_ENTITIES:
      let data = parse(action.data);
      state = Object.assign({}, state);
      if (data.constructor === Object) {
        data = [data];
      }
      if (action.options.parent) {
        if (action.options.reset !== false) {
          newData = removeChildEntities(
            state,
            action.options.parent.type,
            action.options.parent.id,
            action.service,
          );
          state = newData.state;
        }
        newData = addChildEntities(
          state,
          action.options.parent.type,
          action.options.parent.id,
          action.service,
          data,
          action.options.reset,
        );
        state = newData.state;
      } else {
        if (action.options.reset !== false) {
          newData = removeAllEntities(state, action.service);
          state = newData.state;
        }
        newData = addEntities(state, action.service, data);
        state = newData.state;
      }
      return state;
    case REMOVE_ENTITIES:
      state = Object.assign({}, state);
      if (action.options.parent) {
        newData = removeChildEntities(
          state,
          action.options.parent.type,
          action.options.parent.id,
          action.service,
          action.ids,
        );
        state = newData.state;
      } else {
        if (!action.ids) {
          let def = schemaTree[action.service];
          action.ids = Object.keys(state[def.name] || {});
        }
        newData = removeEntities(state, action.service, action.ids);
        state = newData.state;
      }
      return state;
  }
  return state;
}

reducerRegistry.register('entities', reducer);
