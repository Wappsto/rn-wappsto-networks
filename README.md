# React native wappsto networks

React native wappsto networks is an application that allows the user to interact and control his Wappsto networks.

# How it works:

You can either use this project and continue on top of it, or simply install it as a dependency and override the things you want to change.

In order for this project to work as a dependency, you should install all these react-native dependencies link them:

```
@react-native-community/async-storage   ^1.2.1
@react-native-community/netinfo          3.2.1
react-native-gesture-handler             1.2.1
react-native-vector-icons               ^6.4.2
react-native-localize                   ^1.1.0
react-navigation                        ^3.5.1
react-redux                             ^7.0.3
```

**Note that some of these libs require manual installation.**

For override examples, check [examples](https://github.com/Wappsto/rn-wappsto-networks/tree/master/examples) folder.

When you are overriding components or theme, make sure that your file is loaded before **App** component. **App** component is under **rn-wappsto-networks/index.js** or **rn-wappsto-networks/src/navigation**

All pages that are under **components** variable in **rn-wappsto-networks/src/navigation** can be replaced.

```
SplashScreen
LoginScreen
NetworksListScreen
NetworkScreen
DeviceScreen
ValueScreen
AccountScreen
DrawerMenu
MainStackScreen
AccountStackScreen
MainScreen
SwitchNavigator
AppContainer
App
```

When replacing a component, use **{ replaceComponent }** function of **rn-wappsto-networks/src/override**. This function will give you in the argument **components** variable of **rn-wappsto-networks/src/navigation**, where you can replace stuff and return the new **components** object. Note that all new components/pages should be a function that returns the actual component.

## example of index.js file

```
import {AppRegistry} from 'react-native';
import  * as oc from './src/override_components';
import  * as ot from './src/override_theme';
import App from 'rn-wappsto-networks';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```
