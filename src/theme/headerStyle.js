let variables = require('./variables/generic').default;

let styles = {};

// '@react-navigation/native' theme config
export function generateHeaderStyles(c = {}) {
  Object.assign(styles, {
    dark: true,
    colors: {
      primary: variables.headerColor,
      background: variables.headerBgColor,
      card: variables.headerBgColor,
      text: variables.headerColor,
    },
    ...c,
  });
  return styles;
}

generateHeaderStyles();

export default styles;
