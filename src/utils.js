import {config} from './configureWappstoRedux';
import {getStream} from './wappsto-redux/selectors/stream';

export function startStream(currentStreams, session, initializeStreamm, closeStream) {
  if (config.stream) {
    config.stream.forEach(stream => {
      if (!currentStreams.find(exStream => exStream.name === stream.name)) {
        closeStream(stream.name);
        let options = {};
        if (stream.name.endsWith('2.0')) {
          options.version = '2.0';
          options.endPoint = 'websocket';
        }
        initializeStream(stream, session.meta.id, options);
      }
    });
  } else {
    console.log(
      'stream object not defined in config file, stream was not initialized',
    );
  }
}

export function getStreams(state) {
  const streams = [];
  if (config.stream) {
    config.stream.forEach(streamJSON => {
      const stream = getStream(state, streamJSON.name);
      if (stream && stream.ws && stream.ws.readyState === stream.ws.OPEN) {
        streams.push(stream);
      }
    });
  }
  return streams;
}
