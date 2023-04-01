const NAV = {
  NOSESSION: {
    WELCOME: 'Welcome',
    LOGIN: 'Login',
    LOST_PASSWD: 'ForgotPassword',
    LOGIN_EMAIL: 'LoginWithEmail',
    LOGIN_OTHER: 'LoginWithOther',
    REGISTER: 'Register',
    PRIVACY: 'Privacy',
    TERMS: 'Terms',
  },
  MAIN: {
    INDEX: 'DevicesListScreen',
    NETWORK: 'NetworkScreen',
    DEVICE: 'DeviceScreen',
    LOGS: 'LogScreen',
  },
  ACCOUNT: {
    INDEX: 'AccountScreen',
    CHANGE_DETAILS: 'ChangeUserDetailsScreen',
    CHANGE_USERNAME: 'ChangeUsernameScreen',
    CHANGE_PASSWORD: 'ChangePasswordScreen',
    RECOVER_PASSWORD: 'RecoverPasswordScreen',
  },
} as const;

export default NAV;
