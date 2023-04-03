import React from 'react';
import { Text as RNtext, StyleSheet } from 'react-native';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  text: {
    color: theme.variables.textColor,
    fontFamily: theme.variables.fontFamily,
    fontSize: theme.variables.defaultFontSize,
  },
  bold: {
    fontWeight: 'bold',
  },
  fontBold: {
    fontFamily: theme.variables.fontFamilyBold,
  },
  title: {
    color: theme.variables.titleColor,
    fontFamily: theme.variables.titleFontFamily,
    fontSize: theme.variables.titleFontSize,
  },
});

const Text = React.memo(({ style, bold, size, align, title, color, content, ...props }) => {
  const fontSize = () => {
    switch (size) {
      case 'p':
        return theme.variables.defaultFontSize;
      case 'h1':
        return theme.variables.h1;
      case 'h2':
        return theme.variables.h2;
      case 'h3':
        return theme.variables.h3;
      case 'h4':
        return theme.variables.h4;
      default:
        return !isNaN(size) ? size : theme.variables.defaultFontSize;
    }
  };
  const fontStyle = size => {
    const s = fontSize();

    return {
      fontSize: s,
      lineHeight: s * 1.5,
      marginBottom: s * 0.8,
    };
  };

  const textColor = color => {
    switch (color) {
      case 'primary':
        return { color: theme.variables.primary };
      case 'secondary':
        return { color: theme.variables.textSecondary };
      case 'success':
        return { color: theme.variables.textSuccess };
      case 'warning':
        return { color: theme.variables.textWarning };
      case 'error':
        return { color: theme.variables.textError };
      case 'inverse':
        return { color: theme.variables.textInverse };
      case 'disabled':
        return { color: theme.variables.disabled };
      default:
        return { color: color };
    }
  };
  return (
    <RNtext
      {...props}
      style={[
        styles.text,
        title && styles.title,
        bold && (theme.variables.fontFamilyBold ? styles.fontBold : styles.bold),
        align && { textAlign: align },
        size && fontStyle(size),
        color && textColor(color),
        style,
      ]}>
      {content}
    </RNtext>
  );
});

Text.displayName = 'Text';
export default Text;
