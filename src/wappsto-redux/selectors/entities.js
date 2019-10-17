import schemaTree from '../util/schemaTree';

function getTreeName(key) {
  return (schemaTree[key] && schemaTree[key].name) || key;
}

function matchObject(obj1, obj2) {
  for (const key in obj2) {
    if (obj1.hasOwnProperty(key)) {
      let left = obj1[key];
      let right = obj2[key];
      if (left && right && left.constructor !== right.constructor) {
        return false;
      } else if (typeof left === 'object') {
        if (!matchObject(left, right)) {
          return false;
        }
      } else if (left !== right) {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
}

export const getEntity = (state, type, options) => {
  let name = getTreeName(type);
  if (options) {
    if (options.constructor === String) {
      // options is an id
      return (state.entities[name] && state.entities[name][options]) || {};
    } else if (options.constructor === Object) {
      if (options.parent) {
        let parent = getEntity(state, options.parent.type, options.parent.id);
        if (parent && parent.hasOwnProperty(type)) {
          if (parent[type].constructor === Array) {
            for (let i = 0; i < parent[type].length; i++) {
              let id = parent[type][i];
              let found = state.entities[name] && state.entities[name][id];
              if (found && matchObject(found, options.filter || {})) {
                return found;
              }
            }
          } else {
            if (options.filter && matchObject(parent[type], options.filter)) {
              return parent[type];
            } else {
              return parent[type];
            }
          }
        }
      } else {
        if (state.entities[name]) {
          for (let key in state.entities[name]) {
            let val = state.entities[name][key];
            if (matchObject(val, options.filter)) {
              return val;
            }
          }
        }
      }
    }
  }
  return undefined;
};

export const getEntities = (state, type, options = {}) => {
  let result;
  let name = getTreeName(type);
  if (state.entities[name]) {
    if (options.parent) {
      result = [];
      let parent = getEntity(state, options.parent.type, options.parent.id);
      if (parent && parent[type]) {
        parent[type].forEach(id => {
          let found = state.entities[name][id];
          if (found) {
            if (options.filter && matchObject(found, filter)) {
              result.push(found);
            } else {
              result.push(found);
            }
          }
        });
      }
    } else {
      if (options.filter) {
        result = [];
        for (let key in state.entities[name]) {
          let val = state.entities[name][key];
          if (matchObject(val, options.filter)) {
            result.push(val);
          }
        }
      } else {
        result = Object.values(state.entities[name]);
      }
    }
  } else {
    result = [];
  }
  return result;
};

export const getUserData = state => {
  return (
    state.entities.users &&
    state.entities.users[Object.keys(state.entities[schemaTree.user.name])[0]]
  );
};

export const find = (state, obj, type, filter) => {
  let name = getTreeName(type);
  if (obj.hasOwnProperty(type) && obj[type].constructor === Array) {
    for (let i = 0; i < obj[type].length; i++) {
      let id = obj[type][i];
      let entity = state.entities[name] && state.entities[name][id];
      if (entity && matchObject(entity, filter)) {
        return entity;
      }
    }
  }
  return undefined;
};

export const filter = (state, obj, type, filter) => {
  let result = [];
  let name = getTreeName(type);
  if (obj.hasOwnProperty(type) && obj[type].constructor === Array) {
    obj[type].forEach(id => {
      let entity = state.entities[name] && state.entities[name][id];
      if (entity && matchObject(entity, filter)) {
        result.push(entity);
      }
    });
  }
  return result;
};
