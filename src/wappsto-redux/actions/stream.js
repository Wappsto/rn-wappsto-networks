import querystring from 'querystring';

import {_request} from './request';

import config from '../config';
import {getUrlInfo, getServiceVersion} from '../util/helpers';
import {addEntities, removeEntities} from './entities';
import schemaTree from '../util/schemaTree';

export const UPDATE_STREAM = 'UPDATE_STREAM';
export const REMOVE_STREAM = 'REMOVE_STREAM';

const lostTimer = 1000 * 60;
const retryTimer = 1000 * 5;

let timeouts = {};
let websockets = {};

//add also connection lost and timer of 5 minutes of waiting in general
export const status = {
  CONNECTING: 1,
  OPEN: 2,
  CLOSED: 3,
  RECONNECTING: 4,
  ERROR: 5,
  LOST: 6,
};

export const steps = {
  CONNECTING: {
    GET_STREAM: 1,
    CREATE_STREAM: 2,
    UPDATE_STREAM: 3,
    OPENING_SOCKET: 4,
    WAITING: 5,
  },
};

export function updateStream(name, status, step, ws, json, increment) {
  return {
    type: UPDATE_STREAM,
    name,
    status,
    step,
    ws,
    json,
    increment,
  };
}

export function openStream(streamJSON = {}, session, options) {
  return (dispatch, getState) => {
    if (!streamJSON.name) {
      console.log('open stream requires a name to work');
      return;
    }
    if (!session) {
      session = getState().session && getState().session.meta.id;
    }
    _startStream(streamJSON, session, getState, dispatch, options);
  };
}

export function closeStream(name) {
  return (dispatch, getState) => {
    _clearStreamTimeouts({name});
    if (websockets[name]) {
      websockets[name].stop = true;
      websockets[name].close();
    }
    dispatch(removeStream(name));
  };
}

function removeStream(name) {
  return {
    type: REMOVE_STREAM,
    name,
  };
}

function _mergeStreams(oldJSON, newJSON) {
  let update = false;
  if (newJSON.subscription) {
    newJSON.subscription.forEach(sub => {
      if (oldJSON.subscription.indexOf(sub) === -1) {
        update = true;
        oldJSON.subscription.push(sub);
      }
    });
  }
  if (newJSON.ignore) {
    newJSON.ignore.forEach(sub => {
      if (oldJSON.ignore.indexOf(sub) === -1) {
        update = true;
        oldJSON.ignore.push(sub);
      }
    });
  }
  if (oldJSON.full !== newJSON.full) {
    update = true;
    oldJSON = newJSON.full;
  }
  return update ? oldJSON : undefined;
}

function getUrl(options = {}, isEndPoint) {
  const service = (isEndPoint ? options.endPoint : options.service) || 'stream';
  const version = options.hasOwnProperty('version')
    ? options.version
    : getServiceVersion(service);
  return config.baseUrl + (version ? '/' + version : '') + '/' + service;
}

async function _createStream(streamJSON, session, dispatch, options) {
  dispatch(
    updateStream(
      streamJSON.name,
      status.CONNECTING,
      steps.CONNECTING.UPDATE_STREAM,
      null,
      streamJSON,
    ),
  );
  let response = await _request({
    url: getUrl(options),
    method: 'POST',
    body: JSON.stringify(streamJSON),
    headers: {'x-session': session},
  });
  if (!response.ok) {
    throw response;
  }
  return response.json;
}

function _addChildren(message, state) {
  let dataType = message.meta_object.type;
  let data = message[dataType] || message.data;
  if (schemaTree[dataType] && schemaTree[dataType].dependencies) {
    let cachedData =
      state.entities[schemaTree[dataType].name] &&
      state.entities[schemaTree[dataType].name][data.meta.id];
    schemaTree[dataType].dependencies.forEach(({key, type}) => {
      data[key] = cachedData
        ? cachedData[key]
        : type === 'many'
        ? []
        : undefined;
    });
  }
}

function _clearStreamTimeouts(stream) {
  if (stream && stream.name && timeouts[stream.name]) {
    clearTimeout(timeouts[stream.name].retryTimeout);
    clearTimeout(timeouts[stream.name].lostTimeout);
    delete timeouts[stream.name];
  }
}

function _startStream(
  stream,
  session,
  getState,
  dispatch,
  options,
  reconnecting,
) {
  let url = getUrl(options, true);
  if (stream.meta.id) {
    url += '/' + stream.meta.id + '?x-session=' + session;
  } else {
    url += '/open?x-session=' + session + '&' + querystring.stringify(stream);
  }
  if (
    window &&
    window.location &&
    window.location.origin &&
    !url.startsWith('http')
  ) {
    url = window.location.origin + url;
  }
  url = url.replace('http', 'ws');
  let ws = new WebSocket(url);

  websockets[stream.name] = ws;

  dispatch(
    updateStream(
      stream.name,
      reconnecting ? status.RECONNECTING : status.CONNECTING,
      steps.CONNECTING.OPENING_SOCKET,
      ws,
      stream,
    ),
  );

  ws.onopen = () => {
    _clearStreamTimeouts(stream);
    dispatch(updateStream(stream.name, status.OPEN, null, ws, stream));
    console.log('Stream open: ' + url);
  };

  ws.onmessage = e => {
    // a message was received
    try {
      let data = JSON.parse(e.data);
      if (data.constructor !== Array) {
        data = [data];
      }
      data.forEach(message => {
        let state = getState();
        switch (message.event) {
          case 'create':
            // since stream does not have child list, I'm going to add it from cached store state
            _addChildren(message, state);
            if (message.meta_object.type === 'state') {
              if (
                schemaTree.state &&
                schemaTree.state.name &&
                state.entities[schemaTree.state.name] &&
                state.entities[schemaTree.state.name].hasOwnProperty(
                  message.meta_object.id,
                )
              ) {
                dispatch(
                  addEntities(
                    message.meta_object.type,
                    message[message.meta_object.type] || message.data,
                    {reset: false},
                  ),
                );
              } else {
                let {parent} = getUrlInfo(message.path, 1);
                dispatch(
                  addEntities(
                    message.meta_object.type,
                    [message[message.meta_object.type] || message.data],
                    {reset: false, parent},
                  ),
                );
              }
            } else {
              let {parent} = getUrlInfo(message.path, 1);
              dispatch(
                addEntities(
                  message.meta_object.type,
                  message[message.meta_object.type] || message.data,
                  {reset: false, parent},
                ),
              );
            }
            break;
          case 'update':
            // since stream does not have child list, I'm going to add it from cached store state
            _addChildren(message, state);
            dispatch(
              addEntities(
                message.meta_object.type,
                message[message.meta_object.type] || message.data,
                {reset: false},
              ),
            );
            break;
          case 'delete':
            let {parent} = getUrlInfo(message.path, 1);
            dispatch(
              removeEntities(message.meta_object.type, [
                message.meta_object.id,
              ]),
              {parent},
            );
            break;
          default:
            break;
        }
      });
    } catch (error) {
      console.log('stream catch', error);
    }
  };

  ws.onerror = e => {
    console.log('Stream error: ' + url, e.message);
  };

  ws.onclose = e => {
    console.log('Stream close: ' + url, e.message);
    if (!ws.stop && e.code !== 4001) {
      timeouts[stream.name] = {};
      let retryTimeout = setTimeout(() => {
        _startStream(stream, session, getState, dispatch, options, true);
      }, retryTimer);
      timeouts[stream.name].retryTimeout = retryTimeout;
      if (!reconnecting) {
        let lostTimeout = setTimeout(() => {
          _clearStreamTimeouts(stream);
          dispatch(updateStream(stream.name, status.LOST, null, null, stream));
          if (websockets[stream.name]) {
            websockets[stream.name].stop = true;
            websockets[stream.name].close();
          }
        }, lostTimer);
        timeouts[stream.name].lostTimeout = lostTimeout;
      }
      dispatch(
        updateStream(
          stream.name,
          status.RECONNECTING,
          steps.CONNECTING.WAITING,
          ws,
          stream,
          true,
        ),
      );
    } else {
      dispatch(updateStream(stream.name, status.CLOSED, e.code, ws, stream));
    }
  };
}

export function initializeStream(streamJSON = {}, session, options) {
  return async (dispatch, getState) => {
    if (!_request) {
      console.log('request function is not set');
      return;
    }
    if (!session) {
      session = getState().session && getState().session.meta.id;
    }
    if (!session) {
      // dispatch no session maybe ?
      console.log('no session specified');
      return;
    }
    try {
      const streamBaseUrl = getUrl(options);
      dispatch(
        updateStream(
          streamJSON.name,
          status.CONNECTING,
          steps.CONNECTING.GET_STREAM,
          null,
          streamJSON,
        ),
      );
      let headers = {'x-session': session};
      let url = streamBaseUrl + '?expand=0';
      if (streamJSON.name) {
        url += '&this_name=' + streamJSON.name;
      }
      let response = await _request({url, headers});
      if (!response.ok) {
        response.url = url;
        throw response;
      }
      let json = response.json;
      if (json.length > 0) {
        if (!streamJSON.hasOwnProperty('full')) {
          streamJSON.full = true;
        }
        let stream = json[0];

        // merging with json
        let newJSON = _mergeStreams(stream, streamJSON);

        if (newJSON) {
          dispatch(
            updateStream(
              streamJSON.name,
              status.CONNECTING,
              steps.CONNECTING.UPDATE_STREAM,
              null,
              newJSON,
            ),
          );
          let updateResponse = await _request({
            url: streamBaseUrl + '/' + stream.meta.id,
            method: 'PATCH',
            body: JSON.stringify(newJSON),
            headers,
          });
          if (!updateResponse.ok) {
            throw updateResponse;
          }
        }
        return _startStream(
          newJSON || stream,
          session,
          getState,
          dispatch,
          options,
        );
      } else {
        let stream = await _createStream(
          streamJSON,
          session,
          dispatch,
          options,
        );
        return _startStream(stream, session, getState, dispatch, options);
      }
    } catch (e) {
      console.log('initializeStream error', e);
      dispatch(
        updateStream(streamJSON.name, status.ERROR, null, null, streamJSON),
      );
    }
  };
}
