import { config } from '../configureWappstoRedux';
import { openStream, closeStream } from 'wappsto-redux/actions/stream';

export function isEmail(str) {
  return str.match(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);
}

export function startStream(dispatch) {
  if (config.stream) {
    const streamJSON = { ...config.stream };
    delete streamJSON.version;
    delete streamJSON.endPoint;
    dispatch(
      openStream(streamJSON, null, {
        endPoint: config.stream.endPoint || 'websocket',
        version: config.stream.version || '2.0',
      }),
    );
  }
}

export function endStream(dispatch, silent) {
  if (config.stream) {
    dispatch(closeStream(config.stream.name, silent));
  }
}

const toNumber = (x) => {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split('e-')[1], 10);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = '0.' + new Array(e).join('0') + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split('+')[1], 10);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += new Array(e + 1).join('0');
    }
  }
  return x;
};

const countDecimals = (value) => {
  value = toNumber(value);
  if (Math.floor(value) === value) {
    return 0;
  }
  return value.toString().split('.')[1].length || 0;
};

export const getStateData = (data, step) => {
  const d = countDecimals(step);
  if (d > 0) {
    const divider = 10 ** d;
    const newData = Math.round(data * divider);
    return newData / divider;
  }
  return Math.round(data);
};

export function getRequestErrorMessage(request, t) {
  let message;
  if (request.json && request.json.code) {
    message = t('error:' + request.json.code, request.json.data);
    if (message === request.json.code.toString()) {
      message = request.json.code + ': ' + request.json.message;
    }
  } else if (request.responseStatus) {
    message = t('error:status.' + request.responseStatus);
  } else {
    message = t('error:noResponse');
  }
  return message;
}
