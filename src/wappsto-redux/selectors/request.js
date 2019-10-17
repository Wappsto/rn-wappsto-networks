export const getRequestError = (state, url, method) => {
  return state.request.errors[method + "_" + url];
}

export const getRequestAndError = (state, url, method) => {
  let request;
  let error = state.request.errors[method + "_" + url];
  if(state.request[url] && state.request[url].method === method){
    request = state.request[url];
  }
  return {
    request,
    error
  };
}

export const getRequest = (state, url, method) => {
  if(method){
    let result = getRequestAndError(state, url, method);
    return result.error || result.request;
  } else {
    return state.request[url];
  }
}
