/**
 * @format
 */

import './shim';
import {AppRegistry} from 'react-native';
import App from './src/navigation';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

export default App;
