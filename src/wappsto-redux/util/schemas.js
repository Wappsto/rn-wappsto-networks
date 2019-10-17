import { schema } from "normalizr";
import schemaTree from "./schemaTree";

const options = {
  idAttribute: (value, parent, key) => {
    return value.meta.id;
  }
};

let schemas = {};

for(let entity in schemaTree){
  let definition = {};
  schemaTree[entity].dependencies.forEach(dep => {
    definition[dep.key] = dep.type === "many" ? [schemas[dep.key]] : schemas[dep.key];
  });
  schemas[entity] = new schema.Entity(schemaTree[entity].name, definition, options);
}

schemas.generateGenericSchema = (name) => {
  let schemaName = name + "s";
  schemaTree[name] = {
    name: schemaName,
    dependencies: []
  }
  schemas[name] = new schema.Entity(schemaName, {}, options);
}

export default schemas;
