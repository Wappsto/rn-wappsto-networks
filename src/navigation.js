import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createSwitchNavigator, createDrawerNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import i18n from "./translations/i18n";
import { withTranslation } from 'react-i18next';

import store from './configureWappstoRedux';
import theme from "./theme/themeExport";

let components = {
  SlpashScreen: require('./views/SplashScreen').default,
  LoginScreen: require('./views/LoginScreen').default,
  NetworksListScreen: require('./views/main/NetworksListScreen').default,
  NetworkScreen: require('./views/main/NetworkScreen').default,
  DeviceScreen: require('./views/main/DeviceScreen').default,
  ValueScreen: require('./views/main/ValueScreen').default,
  AccountScreen: require('./views/main/AccountScreen').default,
  DrawerMenu: require('./components/DrawerMenu').default,
  MainStackScreen: function(){
    return createStackNavigator({
      NetworksListScreen: { screen: this.NetworksListScreen },
      NetworkScreen: { screen: this.NetworkScreen },
      DeviceScreen: { screen: this.DeviceScreen },
      ValueScreen: { screen: this.ValueScreen }
    }, {
      defaultNavigationOptions: {
        headerTintColor: theme.variables.white,
        headerStyle: {
          backgroundColor: theme.variables.primary
        },
        headerTitleStyle: {
          marginLeft: 0
        }
      }
    });
  },
  AccountStackScreen: function(){
    return createStackNavigator({
      AccountScreen: this.AccountScreen
    });
  },
  MainScreen: function(){
    return createDrawerNavigator({
      Networks: { screen: this.MainStackScreen },
      Account: { screen: this.AccountStackScreen }
    }, {
      contentComponent: this.DrawerMenu
    });
  },
  SwitchNavigator: function(){
    return createSwitchNavigator({
      SplashScreen: { screen: this.SlpashScreen },
      LoginScreen: { screen: this.LoginScreen },
      MainScreen: { screen: this.MainScreen }
    });
  },
  AppContainer: function(){
    return createAppContainer(this.SwitchNavigator);
  },
  App: function(){
    return withTranslation(['translation'], {
      bindI18n: 'languageChanged'
    })(this.AppContainer);
  },
  replace: function(key, val){
    this[key] = val;
    return this;
  },
}

export function replaceComponent(func){
  components = func(components);
}

export default class App extends Component {
  render() {
    for(let key in components){
      if(!(components[key].prototype instanceof Component) && components[key].constructor === Function){
        components[key] = components[key]();
      }
    }
    return (
      <Provider store={store}>
        <components.App/>
      </Provider>
    );
  }
}
