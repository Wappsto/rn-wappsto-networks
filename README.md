# React native wappsto networks

React native wappsto networks is an application that allows the user to interact and control his Wappsto networks.

# How it works:

This app is using **react-native-firebase**, **react-native-google-signin** and **react-native-fbsdk** for 3rd party signing in.
First, you should provide your firebase webClientId(https://console.developers.google.com/apis/credentials) and your **V2** recaptchaKey(https://www.google.com/recaptcha/admin/site/338760476) in **src/config.json**. If you don't have the file, use **config.example.json** as example.

Create **strings.xml** file under **android/app/src/main/res/values/** folder and put the following:

```
<resources>
    <string name="app_name">rn_wappsto_networks</string>
    <string name="facebook_app_id"></string>
    <string name="fb_login_protocol_scheme"></string>
</resources>
```

Then, you have to set up your facebook app. To do so, got to these links and follow the steps:

- [Android](https://developers.facebook.com/docs/android/getting-started/).
- [iOS](https://developers.facebook.com/docs/ios/getting-started/)

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
.
.
.
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

# Components

## KeyboardAvoidingView

This component adds styling and properties required for it to work on iOS.
It is important that KeyboardAvoidingView is placed **before** ScrollView and **after** SafeAreaView (if applicable).
**offset** is required to be set for the views that use navigation.
