import {use as reduxUse, configureStore} from 'wappsto-redux';

let config;
try {
  config = require.call(null, './config.json');
} catch (e) {
  config = {};
}

reduxUse(config);

export function use(conf) {
  config = conf;
  reduxUse(config);
}

export {config};

const store = configureStore();

export default store;
