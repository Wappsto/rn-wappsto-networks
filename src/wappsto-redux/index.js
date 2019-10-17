import config from './config';
import configureStore from './configureStore';
import { overrideRequest } from './actions/request';

export { configureStore };

export { overrideRequest };

export function use(newConfig){
  Object.assign(config, newConfig);
}
