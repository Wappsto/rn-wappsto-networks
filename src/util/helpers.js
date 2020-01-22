export function isPrototype(item){
  return item.meta && !item.meta.iot && !item.meta.application;
}
