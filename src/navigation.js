/*
 * to fix in the future
 * since we updated react-navigation libs, all react-navigation libs used in here are not valid
 * not going to fix this unless needed, after all you can still create your own navigation. let's be honest, it's not that difficult
 */
import React, { useMemo, useState } from 'react';
import './getImages';
import {Provider} from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from './theme/themeExport';
import store from './configureWappstoRedux';
import i18next, { useTranslation } from './translations';
import useStorageSession from 'rn-wappsto-networks/src/hooks/useStorageSession';
import { useSelector } from 'react-redux';
import { getSession } from 'wappsto-redux/selectors/session';

let dependencies = ['ComponentStackShowcase','LoginStackScreen', 'MainStackScreen', 'AccountStackScreen', 'MainScreen', 'SwitchNavigator', 'AppContainer', 'App'];

const createScreen = (Nav, name, comp) => {
  let options;
  if(comp.navigationOptions){
    const t = i18next.t.bind(i18next);
    options = (props) => comp.navigationOptions({ ...props, t });
  }
  return <Nav.Screen name={name} component={comp} options={options}/>
}

let components = {
  SessionVerifier: require('./views/SessionVerifier').default,
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
    const LoginStack = createStackNavigator();
    const LoginStackScreen = () => (
      <LoginStack.Navigator>
        {createScreen(LoginStack, 'LoginScreen', this.LoginScreen)}
        {createScreen(LoginStack, 'RegisterScreen', this.RegisterScreen)}
        {createScreen(LoginStack, 'TermsAndConditionsScreen', this.TermsAndConditionsScreen)}
        {createScreen(LoginStack, 'RecoverPasswordScreen', this.RecoverPasswordScreen)}
      </LoginStack.Navigator>
    )
    return LoginStackScreen;
  },
  ComponentStackShowcase: function(){
    const ShowcaseStack = createStackNavigator();
    const ShowcaseStackScreen = () => (
      <ShowcaseStack.Navigator>
        {createScreen(ShowcaseStack, 'ComponentShowcase', require('./views/ComponentShowcase').default)}
        {createScreen(ShowcaseStack, 'ButtonShowcase', require('./views/ComponentShowcase/Button').default)}
        {createScreen(ShowcaseStack, 'TextInputShowcase', require('./views/ComponentShowcase/TextInput').default)}
      </ShowcaseStack.Navigator>
    )
    return ShowcaseStackScreen;
  },
  MainStackScreen: function() {
    const MainStack = createStackNavigator();
    const MainStackScreen = () => (
      <MainStack.Navigator>
        {createScreen(MainStack, 'DevicesListScreen', this.DevicesListScreen)}
        {createScreen(MainStack, 'DeviceScreen', this.DeviceScreen)}
      </MainStack.Navigator>
    )
    return MainStackScreen;
  },
  AccountStackScreen: function() {
    const AccountStack = createStackNavigator();
    const AccountStackScreen = () => (
      <AccountStack.Navigator>
        {createScreen(AccountStack, 'AccountScreen', this.AccountScreen)}
        {createScreen(AccountStack, 'ChangeUserDetailsScreen', this.ChangeUserDetailsScreen)}
        {createScreen(AccountStack, 'ChangeUsernameScreen', this.ChangeUsernameScreen)}
        {createScreen(AccountStack, 'ChangePasswordScreen', this.ChangePasswordScreen)}
        {createScreen(AccountStack, 'RecoverPasswordScreen', this.RecoverPasswordScreen)}
      </AccountStack.Navigator>
    )
    return AccountStackScreen;
  },
  MainScreen: function() {
    const MainDrawer = createDrawerNavigator();
    const MainDrawerScreen = () => (
      <MainDrawer.Navigator
        drawerContentOptions={{
          activeTintColor: theme.variables.drawerActiveTextColour,
          labelStyle: {
            fontFamily: theme.variables.fontFamily
          },
        }}
        drawerContent={this.DrawerMenu}>
        <MainDrawer.Screen name='main' component={this.MainStackScreen}/>
        <MainDrawer.Screen name='account' component={this.AccountStackScreen}/>
      </MainDrawer.Navigator>
    )
    return MainDrawerScreen;
  },
  RootRouter: function() {
    const RootRouter = () => {
      const { session: storageSession, status } = useStorageSession();
      const [ isValidSession, setIsValidSession ] = useState('pending');
      const session = useSelector(getSession);

      const handleCachedSession = (isValid) => {
        if(!isValid){
          setIsValidSession('error');
        }
      }

      useMemo(() => {
        if(session && session.valid !== false){
          setIsValidSession('success');
        } else if(isValidSession !== 'pending'){
          setIsValidSession('error');
        }
      }, [session, isValidSession]);

      switch(isValidSession){
        case 'success':
          return <this.MainDrawerScreen />
        case 'error':
          return <this.LoginStackScreen />
        case 'pending':
          return (
            <>
              <this.SplashScreen/>
              <this.SessionVerifier
                status={status}
                session={storageSession}
                onResult={handleCachedSession}
              />
            </>
          )
        default:
          return null;
      }
    }
    return RootRouter;
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
        <components.RootRouter
          screenProps={{ t }}
          useSuspense={false}
        />
      </SafeAreaProvider>
    </Provider>
  );
});

export default App;
