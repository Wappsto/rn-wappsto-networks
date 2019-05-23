let theme = {
  variables: require("./variables/generic").default,
  common: require("./common/main").default
}

export default theme;

export function use(config){
  if(config.variables){
    theme.variables = config.variables;
  }
  if(config.common){
    theme.common = config.common;
  }
}
