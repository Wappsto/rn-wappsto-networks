import color from 'color';
import {Platform, Dimensions, PixelRatio} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const isIphoneX =
  platform === 'ios' && deviceHeight === 812 && deviceWidth === 375;

let variables = {};

export function generateVariables(v = {}) {
  Object.assign(variables, {
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

    // Typography
    defaultFontSize: 14,
    fontFamily: 'System',
    fontSizeBase: 12,
    get h1() {
      return this.fontSizeBase + 20;
    },
    get h2() {
      return this.fontSizeBase + 16;
    },
    get h3() {
      return this.fontSizeBase + 12;
    },
    get h4() {
      return this.fontSizeBase + 8;
    },

    // Title
    get titleFontFamily() {
      return this.fontFamily;
    },
    get titleColor() {
      return this.primary;
    },
    get titleFontSize() {
      return this.h1;
    },

    // Text
    get textColor() {
      return this.black;
    },
    get textSecondary() {
      return this.darkGray;
    },
    get textSuccess() {
      return this.success;
    },
    get textWarning() {
      return this.warning;
    },
    get textError() {
      return this.alert;
    },
    get textInverse() {
      return this.white;
    },

    // Border
    borderRadiusBase: 5,
    get borderRadiusLarge() {
      return this.borderRadiusBase * 7;
    },
    borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(0.3),

    // Button
    get buttonBg() {
      return this.darkGray;
    },
    buttonColor: 'white',
    get buttonTextSize() {
      return Math.round(this.fontSizeBase * 1.25);
    },
    // Icon
    iconSmall: 18,
    iconMedium: 28,
    iconLarge: 44,

    // Input
    inputBg: 'rgba(255, 255, 255, 1)',
    get inputTextSize() {
      return Math.round(this.fontSizeBase * 1.4);
    },
    get inputTextColor() {
      return this.textColor;
    },
    get inputSelectionColor() {
      if(color(this.inputTextColor).isDark()){
        return color(this.inputTextColor).lighten(.9);
      } else {
       return color(this.inputTextColor).darken(0.7);
     }
    },
    get inputBorderColor() {
      return this.textColor;
    },

    // Progress Bar
    get defaultProgressColor() {
      return this.primary;
    },
    get inverseProgressColor() {
      return this.secondary;
    },

    // Spinner
    get spinnerColor() {
      return this.primaryDark;
    },
    get spinnerInverseColor() {
      return this.white;
    },

    //Containers
    get appBgColor() {
      return '#f4f4f3';
    },
    get modalBgColor() {
      return this.white;
    },
    get panelBgColor() {
      return this.white;
    },
    get cardBgColor() {
      return this.white;
    },
    get cardBorderColor() {
      return this.white;
    },
    // Header
    get headerBgColor() {
      return this.primary;
    },
    get headerColor() {
      return this.textInverse;
    },

    // StatusBar
    get statusBarBgLight(){
      return this.appBgColor;
    },
    get statusBarBgDark(){
      return this.primary;
    },

    // Popup
    popupOverlayColor:'rgba(0, 0, 0, 0.4)',
    get popupBorderColor() {
      return this.appBgColor;
    },
    get popupBorderWidth() {
      return this.borderWidth;
    },
    get popupBackground() {
      return this.appBgColor;
    },

    // NumericInput
    get NumericInputTextColor() {
      return this.textColor;
    },
    get NumericInputButtonTextColor() {
      return this.textColor;
    },
    get NumericInputBorder() {
      return this.borderColor;
    },
    get NumericInputBackground() {
      return this.light;
    },
    get NumericInputButtonBackground() {
      return this.lightGray;
    },
    get NumericInputText() {
      return this.lightGray;
    },
    NumericInputRounded: true,

    // Slider:
    get sliderThumbTintColor() {
      return this.primary;
    },
    get sliderMinimumTrackTintColor() {
      return this.darkGray;
    },
    get sliderMaximumTrackTintColor() {
      return this.mediumGray;
    },

    // Switch
    get switchThumbColor() {
      return this.primaryColor;
    },
    get switchTrackColor() {
      return this.darkGray;
    },

    // other

    ...v,
  });
  return variables;
}

generateVariables();

export default variables;
