import {config} from './configureWappstoRedux';

export function startStream(session, initializeStream) {
  if (config.stream) {
    config.stream.forEach(stream => {
      let options = {};
      if (stream.name.endsWith('2.0')) {
        options.version = '2.0';
        options.endPoint = 'websocket';
      }
      initializeStream(stream, session.meta.id, options);
    });
  } else {
    console.log(
      'stream object not defined in login page, stream was not initialized',
    );
  }
}
