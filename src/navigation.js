import React from 'react';
import './getImages';
import {Provider} from 'react-redux';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from './theme/themeExport';
import store from './configureWappstoRedux';
import { useTranslation } from './translations';

let dependencies = ['ComponentStackShowcase','LoginStackScreen', 'MainStackScreen', 'AccountStackScreen', 'MainScreen', 'SwitchNavigator', 'AppContainer', 'App'];

let components = {
  SplashScreen: require('./views/SplashScreen').default,
  DevicesListScreen: require('./views/main/DevicesListScreen').default,
  DeviceScreen: require('./views/main/DeviceScreen').default,
  AccountScreen: require('./views/main/AccountScreen').default,
  ChangeUserDetailsScreen: require('./views/main/AccountScreen/ChangeUserDetailsScreen').default,
  ChangeUsernameScreen: require('./views/main/AccountScreen/ChangeUsernameScreen').default,
  ChangePasswordScreen: require('./views/main/AccountScreen/ChangePasswordScreen').default,
  DrawerMenu: require('./components/DrawerMenu').default,
  RecoverPasswordScreen: require('./views/login/RecoverPasswordScreen').default,
  LoginScreen: require('./views/login/LoginScreen').default,
  RegisterScreen: require('./views/login/RegisterScreen').default,
  TermsAndConditionsScreen: require('./views/login/TermsAndConditionsScreen').default,
  LoginStackScreen: function(){
    return createStackNavigator({
      LoginScreen: {screen: this.LoginScreen},
      RegisterScreen: {screen: this.RegisterScreen},
      RecoverPasswordScreen: {screen: this.RecoverPasswordScreen},
      TermsAndConditionsScreen: {screen: this.TermsAndConditionsScreen}
    });
  },
  ComponentStackShowcase: function(){
    return createStackNavigator({
      ComponentShowcase: require('./views/ComponentShowcase').default,
      ButtonShowcase: require('./views/ComponentShowcase/Button').default,
      TextInputShowcase: require('./views/ComponentShowcase/TextInput').default
    });
  },
  MainStackScreen: function() {
    return createStackNavigator({
      DevicesListScreen: {screen: this.DevicesListScreen},
      DeviceScreen: {screen: this.DeviceScreen},
    });
  },
  AccountStackScreen: function() {
    return createStackNavigator({
      AccountScreen: {screen: this.AccountScreen},
      ChangeUserDetailsScreen: {screen: this.ChangeUserDetailsScreen},
      ChangeUsernameScreen: {screen: this.ChangeUsernameScreen},
      ChangePasswordScreen: {screen: this.ChangePasswordScreen},
      RecoverPasswordScreen: {screen: this.RecoverPasswordScreen}
    });
  },
  MainScreen: function() {
    return createDrawerNavigator(
      {
        main: {screen: this.MainStackScreen},
        account: {screen: this.AccountStackScreen},
      },
      {
        contentComponent: this.DrawerMenu,
        contentOptions: {
          activeTintColor: theme.variables.drawerActiveTextColour,
          labelStyle: {
            fontFamily: theme.variables.fontFamily
          },
        }
      },
    );
  },
  SwitchNavigator: function() {
    return createSwitchNavigator({
    //  ComponentStackShowcase: {screen: this.ComponentStackShowcase},
      SplashScreen: {screen: this.SplashScreen},
      LoginStackScreen: {screen: this.LoginStackScreen},
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
    const index = dependencies.indexOf(key);
    if(index !== -1){
      dependencies.splice(index, 1);
    }
    return this;
  },
};

export function replaceComponent(func) {
  components = func(components);
}

let rendered = false;
const App = React.memo(() => {
  const { t } = useTranslation();
  if(!rendered){
    rendered = true;
    dependencies.forEach(d => {
      if(components[d] && components[d].constructor === Function){
        components[d] = components[d]();
      }
    });
  }
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <components.App
          screenProps={{ t }}
          useSuspense={false}
        />
      </SafeAreaProvider>
    </Provider>
  );
});

export default App;
