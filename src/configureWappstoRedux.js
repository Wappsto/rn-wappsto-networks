import {use as reduxUse, configureStore} from 'wappsto-redux';

let config = require('./config.json');

reduxUse(config);

export function use(conf) {
  config = conf;
  reduxUse(config);
}

export {config};

const store = configureStore();

export default store;
