export function isPrototype(item){
  return item.meta && !item.meta.iot && !item.meta.application;
}

export function cannotAccessState(state){
  return state.status_payment === 'not_shared' || state.status_payment === 'not_paid' || state.status_payment === 'open';
}
