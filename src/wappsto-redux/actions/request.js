import querystring from 'querystring';
import config from '../config';
import {getUrlInfo, getServiceVersion} from '../util/helpers';
import {addEntities, removeEntities} from './entities';
import {addSession, invalidSession, removeSession} from './session';

export const REQUEST_PENDING = 'REQUEST_PENDING';
export const REQUEST_ERROR = 'REQUEST_ERROR';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
export const REMOVE_REQUEST = 'REMOVE_REQUEST';
export const REMOVE_REQUEST_ERROR = 'REMOVE_REQUEST_ERROR';

function getQueryObj(query) {
  var urlParams = {};
  var match,
    pl = /\+/g,
    search = /([^&=]+)=?([^&]*)/g,
    decode = function(s) {
      return decodeURIComponent(s.replace(pl, ' '));
    };

  while ((match = search.exec(query))) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  return urlParams;
}

function splitUrlAndOptions(url, options) {
  let newOptions = {...options};
  let split = url.split('?');
  if (split[1]) {
    let query = split.slice(1).join('?');
    if (!newOptions.query) {
      newOptions.query = getQueryObj(query);
    } else {
      newOptions.query = {
        ...newOptions.query,
        ...getQueryObj(query),
      };
    }
  }
  return {
    url: split[0],
    options: newOptions,
  };
}

function getUrlWithQuery(url, query = {}) {
  const {service} = getUrlInfo(url);
  const version = getServiceVersion(service);
  let result = config.baseUrl + (version ? '/' + version : '') + url;
  if (Object.keys(query).length > 0) {
    result += result.indexOf('?') === -1 ? '?' : '&';
    result += querystring.stringify(query);
  }
  return result;
}

function getOptions(method, url, data, options, sessionJSON) {
  let requestOptions = {method, headers: options.headers || {}};
  if (sessionJSON && sessionJSON.meta && !requestOptions.headers['x-session']) {
    requestOptions.headers['x-session'] = sessionJSON.meta.id;
  }
  if (['PUT', 'PATCH', 'POST'].indexOf(method) !== -1) {
    requestOptions.body = JSON.stringify(data);
  }
  requestOptions.url = getUrlWithQuery(url, options.query);
  return requestOptions;
}

function requestPending(method, url, body, options) {
  return {
    type: REQUEST_PENDING,
    method,
    url,
    body,
    options,
  };
}

function requestSuccess(method, url, responseStatus, json, options) {
  return {
    type: REQUEST_SUCCESS,
    method,
    url,
    responseStatus,
    json,
    options,
  };
}

function requestError(method, url, responseStatus, json, options) {
  return {
    type: REQUEST_ERROR,
    method,
    url,
    responseStatus,
    json,
    options,
  };
}

function dispatchEntitiesAction(dispatch, method, url, json, options) {
  let {service, parent} = getUrlInfo(url);
  switch (method) {
    case 'GET':
      dispatch(addEntities(service, json, {reset: false, ...options, parent}));
      break;
    case 'POST':
    case 'PATCH':
    case 'PUT':
      dispatch(addEntities(service, json, {...options, parent, reset: false}));
      break;
    case 'DELETE':
      dispatch(
        removeEntities(service, json.deleted, {
          ...options,
          parent,
          reset: false,
        }),
      );
      break;
  }
}

function dispatchSessionAction(dispatch, method, url, json, options) {
  if (method === 'DELETE') {
    dispatch(removeSession());
  } else {
    dispatch(addSession(json, true));
  }
}

function dispatchMethodAction(dispatch, method, url, json, options) {
  if (url.startsWith('/session')) {
    dispatchSessionAction(dispatch, method, url, json, options);
  } else {
    dispatchEntitiesAction(dispatch, method, url, json, options);
  }
}

export let _request = async options => {
  try {
    let response = await fetch(options.url, options);
    try {
      let json = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        json,
      };
    } catch (e) {
      return {ok: response.ok, status: response.status};
    }
  } catch (e) {
    return {ok: false, status: e.status};
  }
};

export function makeRequest(method, url, data, options = {}) {
  return async (dispatch, getState) => {
    if (method.constructor === Object) {
      data = method.data || method.body;
      url = method.url;
      options = method;
      method = method.method;
    }
    if (!_request) {
      console.log('request function is not set');
      return;
    }
    method = method.toUpperCase();
    let result = splitUrlAndOptions(url, options);
    url = result.url;
    options = result.options;
    let state = getState();
    if (state.request[url] && state.request[url].status === 'pending') {
      console.log('a request with the same url is already pending');
      return;
    }
    dispatch(requestPending(method, url, data, options));
    let requestOptions = getOptions(method, url, data, options, state.session);
    // console.log(requestOptions);
    let response;
    try {
      response = await _request(requestOptions);
    } catch (e) {
      response = e;
    }
    if (response.ok) {
      dispatchMethodAction(dispatch, method, url, response.json, options);
      dispatch(
        requestSuccess(method, url, response.status, response.json, options),
      );
    } else {
      if (response.json && response.json.code === 9900025) {
        dispatch(invalidSession());
      }
      dispatch(
        requestError(method, url, response.status, response.json, options),
      );
    }
  };
}

export function removeRequest(url, method) {
  return {
    type: REMOVE_REQUEST,
    url,
    method,
  };
}

export function removeRequestError(url, method) {
  return {
    type: REMOVE_REQUEST_ERROR,
    url,
    method,
  };
}

export function overrideRequest(func) {
  _request = func;
}
