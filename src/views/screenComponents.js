export let screenComponents = {
  LoginScreen: require('./login/LoginScreen').default,
  RecoverPasswordScreen: require('./login/RecoverPasswordScreen').default,
  RegisterScreen: require('./login/RegisterScreen').default,
  TermsAndConditionsScreen: require('./login/TermsAndConditionsScreen').default,

  AccountScreen: require('./account/AccountScreen').default,
  ChangePasswordScreen: require('./account/ChangePasswordScreen').default,
  ChangeUserDetailsScreen: require('./account/ChangeUserDetailsScreen').default,
  ChangeUsernameScreen: require('./account/ChangeUsernameScreen').default,

  DeviceScreen: require('./main/DeviceScreen').default,
  DevicesListScreen: require('./main/DevicesListScreen').default,
  LogScreen: require('./main/LogScreen').default,
  NetworkScreen: require('./main/NetworkScreen').default,
};

export function replaceComponent(func) {
  screenComponents = func(screenComponents);
}
