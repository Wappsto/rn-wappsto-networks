import { generateStyles } from './common/main';
import { generateHeaderStyles } from './headerStyle';

let theme = {
  variables: require('./variables/generic').default,
  common: require('./common/main').default,
  headerStyle: require('./headerStyle').default,
};

export default theme;

export function use(config) {
  theme.variables = config.variables;
  generateStyles(config.common);
  generateHeaderStyles(config.headerStyle);
}
