import {StyleSheet} from 'react-native';

let variables = require('./variables/generic').default;

let styles = {};

export function generateHeaderStyles(c = {}) {
  Object.assign(
    styles,
    {
      headerTintColor: variables.white,
      headerStyle: {
        backgroundColor: variables.primary
      },
      headerTitleStyle: {
        marginLeft: 0,
        fontFamily: variables.fontFamily // has to be set for onplus devices
      },
      ...c
    }
  );
  return styles;
}

generateHeaderStyles();

export default styles;
