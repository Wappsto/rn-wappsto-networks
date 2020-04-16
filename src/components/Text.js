import React from 'react';
import { StyleSheet, Text as RNtext } from 'react-native';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  text: {
    color: theme.variables.textColor,
    fontFamily: theme.variables.fontFamily,
    fontSize: theme.variables.defaultFontSize
  },
  title:{
    color: theme.variables.titleColor,
    fontFamily: theme.variables.titleFontFamily,
    fontSize: theme.variables.titleFontSize
  }
});

const Title = React.memo(({
  style,
  size,
  align,
  title,
  color,
  content
}) => {
  const fontSize = () => {
    switch(size) {
      case 'p':
        return theme.variables.defaultFontSize;
        break;
      case 'h1':
        return theme.variables.h1;
        break;
      case 'h2':
        return theme.variables.h2;
        break;
      case 'h3':
        return theme.variables.h3;
        break;
      case 'h4':
        return theme.variables.h4;
        break;
      default:
        return !isNaN(size) ? size : theme.variables.defaultFontSize;
    }
  }
  const fontStyle = (size) => {
    const s = fontSize();

    return {
      fontSize: s,
      lineHeight: s * 1.5,
      marginBottom: s * .8
    }
  };

  const textColor = (color)=>{
      switch(color) {
        case 'primary':
          return {color: theme.variables.primary};
          break;
        case 'secondary':
          return {color: theme.variables.textSecondary};
          break;
        case 'success':
          return {color: theme.variables.textSuccess};
          break;
        case 'warning':
          return {color: theme.variables.textWarning};
          break;
        case 'error':
          return {color: theme.variables.textError};
          break;
        case 'inverse':
          return {color: theme.variables.textInverse};
          break;
        case 'disabled':
          return {color: theme.variables.disabled};
          break;
        default:
          return {color: color};
      }
  };
  return (
    <RNtext
      style={[
        styles.text,
        title && styles.title,
        align && {textAlign: align},
        size && fontStyle(size),
        color && textColor(color),
        style
      ]}
    >
      {content}
    </RNtext>
  );
});

export default Title;
