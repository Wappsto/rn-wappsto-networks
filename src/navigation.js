import React, { useMemo, useState, useEffect } from 'react';
import './getImages';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from './theme/themeExport';
import store from './configureWappstoRedux';
import i18next, { useTranslation } from './translations';
import useStorageSession from 'rn-wappsto-networks/src/hooks/useStorageSession';
import { useSelector } from 'react-redux';
import { getSession } from 'wappsto-redux/selectors/session';

let dependencies = ['ComponentStackShowcase','LoginStackScreen', 'MainStackScreen', 'AccountStackScreen', 'MainScreen', 'MainDrawerScreen', 'RootRouter'];

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
  NetworkScreen: require('./views/main/NetworkScreen').default,
  AccountScreen: require('./views/main/AccountScreen').default,
  ChangeUserDetailsScreen: require('./views/main/AccountScreen/ChangeUserDetailsScreen').default,
  ChangeUsernameScreen: require('./views/main/AccountScreen/ChangeUsernameScreen').default,
  ChangePasswordScreen: require('./views/main/AccountScreen/ChangePasswordScreen').default,
  DrawerMenu: require('./components/DrawerMenu').default,
  LoginScreen: require('./views/login/LoginScreen').default,
  RegisterScreen: require('./views/login/RegisterScreen').default,
  TermsAndConditionsScreen: require('./views/login/TermsAndConditionsScreen').default,
  RecoverPasswordScreen: require('./views/login/RecoverPasswordScreen').default,
  LoginStackScreen: function(){
    const LoginStack = createStackNavigator();
    const LoginStackScreen = () => (
      <LoginStack.Navigator>
        {createScreen(LoginStack, 'LoginScreen', components.LoginScreen)}
        {createScreen(LoginStack, 'RegisterScreen', components.RegisterScreen)}
        {createScreen(LoginStack, 'TermsAndConditionsScreen', components.TermsAndConditionsScreen)}
        {createScreen(LoginStack, 'RecoverPasswordScreen', components.RecoverPasswordScreen)}
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
        {createScreen(MainStack, 'DevicesListScreen', components.DevicesListScreen)}
        {createScreen(MainStack, 'DeviceScreen', components.DeviceScreen)}
        {createScreen(MainStack, 'NetworkScreen', components.NetworkScreen)}
      </MainStack.Navigator>
    )
    return MainStackScreen;
  },
  AccountStackScreen: function() {
    const AccountStack = createStackNavigator();
    const AccountStackScreen = () => (
      <AccountStack.Navigator>
        {createScreen(AccountStack, 'AccountScreen', components.AccountScreen)}
        {createScreen(AccountStack, 'ChangeUserDetailsScreen', components.ChangeUserDetailsScreen)}
        {createScreen(AccountStack, 'ChangeUsernameScreen', components.ChangeUsernameScreen)}
        {createScreen(AccountStack, 'ChangePasswordScreen', components.ChangePasswordScreen)}
        {createScreen(AccountStack, 'RecoverPasswordScreen', components.RecoverPasswordScreen)}
      </AccountStack.Navigator>
    )
    return AccountStackScreen;
  },
  MainDrawerScreen: function() {
    const MainDrawer = createDrawerNavigator();
    const MainDrawerScreen = () => (
      <MainDrawer.Navigator
        drawerContentOptions={{
          activeTintColor: theme.variables.drawerActiveTextColour,
          labelStyle: {
            fontFamily: theme.variables.fontFamily
          },
        }}
        drawerContent={(props) => <components.DrawerMenu {...props} />}>
        <MainDrawer.Screen name='main' component={components.MainStackScreen}/>
        <MainDrawer.Screen name='account' component={components.AccountStackScreen}/>
      </MainDrawer.Navigator>
    )
    return MainDrawerScreen;
  },
  RootRouter: function() {
    const RootRouter = () => {
      const { session: storageSession, status } = useStorageSession();
      const [ isValidSession, setIsValidSession ] = useState('pending');
      const session = useSelector(getSession);
      const [ ready, setReady ] = useState(false);

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

      const wait = async () => {
        try {
          if(components.SplashScreen.load){
            await components.SplashScreen.load();
          }
        } catch (e) {
        }
        setReady(true);
      }
      useEffect(() => {
        wait();
      }, []);

      switch(isValidSession){
        case 'success':
          return <components.MainDrawerScreen />
        case 'error':
          return <components.LoginStackScreen />
        case 'pending':
          return (
            <>
              <components.SplashScreen />
              {
                ready && (
                  <components.SessionVerifier
                    status={status}
                    session={storageSession}
                    onResult={handleCachedSession}
                  />
                )
              }
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
      <NavigationContainer>
        <SafeAreaProvider>
          <components.RootRouter
            screenProps={{ t }}
            useSuspense={false}
          />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
});

export default App;
