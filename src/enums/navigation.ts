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
  SESSION: {
    DISPATCH: 'Dispatch',
    WELCOME: 'Welcome',
    ELOVERBLIK_SETUP: 'EloverblikSetup',
    METER_SETUP_STACK: 'MeterSetup Stack Screen',
    METER_SETUP: 'MeterSetup',
    BLUFI: 'Blufi',
    ELOVERBLIK_WEB: 'EloverblikWeb',
    IMPORT_SUCCESS: 'ImportSuccess',
    REPORTS: 'Reports',
    MAIN: 'Main',
  },
} as const;

export default NAV;
