import color from 'color';
import { Platform, PixelRatio } from 'react-native';

const platform = Platform.OS;
let variables = {};

export function generateVariables(v = {}) {
  Object.assign(variables, {
    platform,
    // Color
    primary: 'hsla(169, 90%, 35%, 1)',
    primaryDark: 'hsla(169, 90%, 21%, 1)',
    secondary: 'hsla(17, 100%, 80%, 1)',
    darkGray: '#666',
    lightGray: '#eee',
    white: '#ffffff',
    black: '#222',
    disabled: '#bbbbbb',
    inactive: '#fafafa',
    success: '#5cb85c',
    alert: '#c51165',
    warning: '#f0ad4e',

    signInButtonTheme: 'light', // 'light' or 'dark'

    // Typography
    defaultFontSize: 14,
    fontFamily: 'System',
    //  fontFamilyBold: 'System',

    fontSizeBase: 12,

    h1: {
      get() {
        return this.fontSizeBase + 20;
      },
    },
    h2: {
      get() {
        return this.fontSizeBase + 16;
      },
    },
    h3: {
      get() {
        return this.fontSizeBase + 12;
      },
    },
    h4: {
      get() {
        return this.fontSizeBase + 8;
      },
    },

    // Title
    titleFontFamily: {
      get() {
        return this.fontFamilyBold;
      },
    },
    titleColor: {
      get() {
        return this.primary;
      },
    },
    get titleFontSize() {
      return this.h1;
    },

    // Text
    textColor: {
      get() {
        return this.black;
      },
    },
    textSecondary: {
      get() {
        return this.darkGray;
      },
    },
    textSuccess: {
      get() {
        return this.success;
      },
    },
    textWarning: {
      get() {
        return this.warning;
      },
    },
    textError: {
      get() {
        return this.alert;
      },
    },
    textInverse: {
      get() {
        return this.white;
      },
    },

    // Border
    borderRadiusBase: 5,
    borderColor: {
      get() {
        return color(this.appBgColor).darken(0.1).string();
      },
    },
    borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(0.3),

    // Button
    buttonBg: {
      get() {
        return this.darkGray;
      },
    },
    buttonColor: 'white',
    buttonTextSize: {
      get() {
        return Math.round(this.fontSizeBase * 1.25);
      },
    },

    // Icon
    iconSmall: 18,
    iconMedium: 28,
    iconLarge: 44,

    // Input
    inputBg: 'rgba(255, 255, 255, 1)',
    inputTextSize: {
      get() {
        return Math.round(this.fontSizeBase * 1.4);
      },
    },
    inputTextColor: {
      get() {
        return this.textColor;
      },
    },
    inputSelectionColor: {
      get() {
        if (color(this.inputTextColor).isDark()) {
          return color(this.inputTextColor).lighten(0.9).string();
        } else {
          return color(this.inputTextColor).darken(0.7).string();
        }
      },
    },
    inputBorderColor: {
      get() {
        return this.textColor;
      },
    },

    // Progress Bar
    defaultProgressColor: {
      get() {
        return this.primary;
      },
    },
    inverseProgressColor: {
      get() {
        return this.secondary;
      },
    },

    // Spinner
    spinnerColor: {
      get() {
        return this.primaryDark;
      },
    },
    spinnerInverseColor: {
      get() {
        return this.white;
      },
    },

    //Containers
    appBgColor: '#f4f4f3',

    modalBgColor: {
      get() {
        return this.white;
      },
    },
    panelBgColor: {
      get() {
        return this.white;
      },
    },
    cardBgColor: {
      get() {
        return this.white;
      },
    },
    cardBorderColor: {
      get() {
        return this.white;
      },
    },

    // Drawer
    drawerMenuBgColor: {
      get() {
        return this.appBgColor;
      },
    },
    drawerMenuText: {
      get() {
        return this.textColor;
      },
    },
    drawerActiveTextColour: {
      get() {
        return this.primary;
      },
    },

    // Header
    headerBgColor: {
      get() {
        return this.primary;
      },
    },
    headerColor: {
      get() {
        return this.textInverse;
      },
    },

    // StatusBar
    statusBarColorLight: 'light-content',
    statusBarColorDark: 'dark-content',
    statusBarBgLight: {
      get() {
        return this.appBgColor;
      },
    },
    statusBarBgDark: {
      statusBarBgDark: {
        get() {
          return this.primary;
        },
      },
    },

    // Popup
    popupOverlayColor: 'rgba(0, 0, 0, 0.4)',
    popupBorderColor: {
      get() {
        return this.appBgColor;
      },
    },
    popupBorderWidth: {
      get() {
        return this.borderWidth;
      },
    },
    popupBackground: {
      get() {
        return this.appBgColor;
      },
    },

    // NumericInput
    NumericInputTextColor: {
      get() {
        return this.textColor;
      },
    },
    NumericInputButtonTextColor: {
      get() {
        return this.textColor;
      },
    },
    NumericInputBorder: {
      get() {
        return this.borderColor;
      },
    },
    NumericInputBackground: {
      get() {
        return this.white;
      },
    },
    NumericInputButtonBackground: {
      get() {
        return this.lightGray;
      },
    },
    NumericInputRounded: true,

    // Slider:
    sliderThumbTintColor: {
      get() {
        return this.primary;
      },
    },
    sliderMinimumTrackTintColor: {
      get() {
        return this.darkGray;
      },
    },
    sliderMaximumTrackTintColor: {
      get() {
        return this.mediumGray;
      },
    },

    // Switch
    switchThumbColor: {
      get() {
        return this.white;
      },
    },
    switchTrackColor: {
      get() {
        return this.mediumGray;
      },
    },
    switchTrackColorEnabled: {
      get() {
        return this.primaryDark;
      },
    },

    // other

    ...v,
  });
  return variables;
}

generateVariables();

export default variables;
