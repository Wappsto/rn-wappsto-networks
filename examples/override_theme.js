import { useTheme } from '../src/override/theme';
import theme from '../src/theme/themeExport';

// overriding theme
import color from 'color';
import { Platform, Dimensions, PixelRatio } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const isIphoneX = platform === 'ios' && deviceHeight === 812 && deviceWidth === 375;

useTheme({
  variables: {
    // Color
    primary: 'cyan',
    secondary: 'black',
    get dark() {
      return color(this.primary).darken(0.5);
    },
    white: '#ffffff',
    black: '#000',
    disabled: '#bbbbbb',
    inactive: '#fafafa',
    success: '#5cb85c',
    alert: '#c51165',
    warning: '#f0ad4e',

    get appBgColor() {
      return '#fff'; //color(this.primary).lighten(2);
    },
    get modalBgColor() {
      return this.primary;
    },
    // Font
    defaultFontSize: 14,
    fontFamily: 'System',
    fontSizeBase: 12,

    // Title
    get titleFontfamily() {
      return this.fontFamily;
    },
    titleFontSize: platform === 'ios' ? 17 : 19,
    subTitleFontSize: platform === 'ios' ? 11 : 14,

    // Text
    get textColor() {
      return this.black;
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
    get textImportant() {
      return this.alert;
    },
    get textSecondary() {
      return '#777';
    },

    // Border
    borderRadiusBase: 5,
    get borderRadiusLarge() {
      return this.borderRadiusBase * 7;
    },
    borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(0.3),

    // Button
    get buttonBg() {
      return this.primary;
    },
    buttonColor: 'white',
    get buttonTextSize() {
      return platform === 'ios' ? this.fontSizeBase * 1.2 : this.fontSizeBase * 1.2;
    },
    get buttonDisabledBg() {
      return this.disabled;
    },

    // Icon
    iconSmall: 18,
    iconMedium: 28,
    iconLarge: 44,

    // Input
    get inputTextSize() {
      return platform === 'ios' ? this.fontSizeBase * 1.2 : this.fontSizeBase * 1.2;
    },
    get inputBorderColor() {
      return color(this.primary).darken(0.3);
    },
    get inputSuccessBorderColor() {
      return this.secondary;
    },
    get inputErrorBorderColor() {
      return this.alert;
    },
    inputHeight: 42,
    inputBg: 'rgba(255, 255, 255, 1)',

    // Progress Bar
    get defaultProgressColor() {
      return this.primary;
    },
    get inverseProgressColor() {
      return this.secondary;
    },

    // Spinner
    get spinnerColor() {
      return this.dark;
    },
    get inverseSpinnerColor() {
      return this.light;
    },

    // Header
    get headerBgColor() {
      return this.primary;
    },

    // Container
    get containerBgColor() {
      return color(this.primary).lighten(4);
    },
  },
  /*
  common: {
    container: {
      // this will completely override the class. If you want to keep the old style and change only 1 varibale, remember to add the old style
      ...theme.common.container, // this is how to add the old style
      backgroundColor: 'green',
    },
  },
  */
});
