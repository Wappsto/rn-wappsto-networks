# React native wappsto networks

React native wappsto networks is an application that allows the user to interact and control his Wappsto networks.

# How it works:

You can either use this project and continue on top of it, or simply install it as a dependency and override the things you want to change.

In order for this project to work as a dependency, you should install all these react-native dependencies link them:

```
@react-native-community/async-storage
@react-native-community/netinfo
react-native-gesture-handler
react-native-vector-icons
react-native-localize
react-navigation
react-redux
```

**Note that some of these libs require manual installation.**

For override examples, check [examples](https://github.com/Wappsto/RN_Wappsto_networks/tree/master/examples) folder.

When you are overriding components or theme, make sure that your file is loaded before **App** component. **App** component is under **rn_wappsto_networks/index.js** or **rn_wappsto_networks/src/navigation**

All pages that are under **components** variable in **rn_wappsto_networks/src/navigation** can be replaced.

```
SlpashScreen
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

When replacing a component, use **{ replaceComponent }** function of **rn_wappsto_networks/src/override**. This function will give you in the argument **components** variable of **rn_wappsto_networks/src/navigation**, where you can replace stuff and return the new **components** object. Note that all new components/pages should be a function that returns the actual component.

## example of index.js file

```
import {AppRegistry} from 'react-native';
import  * as oc from './src/override_components';
import  * as ot from './src/override_theme';
import App from 'rn_wappsto_networks';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```
