import {StyleSheet} from 'react-native';

let variables = require('./variables/generic').default;

let styles = {};

export function generateHeaderStyles(c = {}) {
  Object.assign(
    styles,
    {
      headerTintColor: variables.headerColor,
      headerStyle: {
        backgroundColor: variables.headerBgColor
      },
      headerTitleStyle: {
        marginLeft: 0,
        fontFamily: variables.fontFamily
      },
      ...c
    }
  );
  return styles;
}

generateHeaderStyles();

export default styles;
