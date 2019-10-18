import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

import store from './configureWappstoRedux';

let components = {
  SplashScreen: require('./views/SplashScreen').default,
  LoginScreen: require('./views/LoginScreen').default,
  DevicesListScreen: require('./views/main/DevicesListScreen').default,
  DeviceScreen: require('./views/main/DeviceScreen').default,
  AccountScreen: require('./views/main/AccountScreen').default,
  DrawerMenu: require('./components/DrawerMenu').default,
  MainStackScreen: function() {
    return createStackNavigator({
      DevicesListScreen: {screen: this.DevicesListScreen},
      DeviceScreen: {screen: this.DeviceScreen},
    });
  },
  AccountStackScreen: function() {
    return createStackNavigator({
      AccountScreen: this.AccountScreen,
    });
  },
  MainScreen: function() {
    return createDrawerNavigator(
      {
        Home: {screen: this.MainStackScreen},
        Account: {screen: this.AccountStackScreen},
      },
      {
        contentComponent: this.DrawerMenu,
      },
    );
  },
  SwitchNavigator: function() {
    return createSwitchNavigator({
      SplashScreen: {screen: this.SplashScreen},
      LoginScreen: {screen: this.LoginScreen},
      MainScreen: {screen: this.MainScreen},
    });
  },
  AppContainer: function() {
    return createAppContainer(this.SwitchNavigator);
  },
  App: function() {
    return this.AppContainer;
  },

  // helper function
  replace: function(key, val) {
    this[key] = val;
    return this;
  },
};

export function replaceComponent(func) {
  components = func(components);
}

export default class App extends Component {
  render() {
    for (let key in components) {
      if (
        key !== 'replace' &&
        !(components[key].prototype instanceof Component) &&
        components[key].constructor === Function
      ) {
        components[key] = components[key]();
      }
    }
    return (
      <Provider store={store}>
        <components.App useSuspense={false} />
      </Provider>
    );
  }
}
