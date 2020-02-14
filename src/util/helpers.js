import { config } from '../configureWappstoRedux';
import { openStream, closeStream } from 'wappsto-redux/actions/stream';

export function isPrototype(item){
  return item.meta && !item.meta.iot && !item.meta.application;
}

export function cannotAccessState(state){
  return state.status_payment === 'not_shared' || state.status_payment === 'not_paid';
}

export function startStream(dispatch){
  if(config.stream){
    const streamJSON = { ...config.stream };
    delete streamJSON.version;
    delete streamJSON.endPoint;
    dispatch(openStream(streamJSON, null, { endPoint: config.stream.endPoint || 'websocket', version: config.stream.version || '2.0' }));
  }
}

export function endStream(dispatch, silent){
  if(config.stream){
    dispatch(closeStream(config.stream.name, silent));
  }
}
