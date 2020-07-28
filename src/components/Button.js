import React from 'react';
import { StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: 400,
    borderRadius: theme.variables.borderRadiusBase,
    paddingVertical: 12,
    paddingHorizontal: 25
  },
  full:{
    backgroundColor: theme.variables.buttonBg
  },
  outlined: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderWidth: theme.variables.borderWidth * 2
  },
  link: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingHorizontal: 12,
    marginBottom: 0,
    marginTop:0
  },
  icon: {
    color: theme.variables.buttonColor,
    paddingVertical:0,
    fontSize: 20,
  },
  iconWithText: {
    fontSize: theme.variables.buttonTextSize,
    color: theme.variables.buttonColor,
    marginLeft: -12,
    marginRight: 12
  },
  text: {
    fontFamily: theme.variables.fontFamily,
    fontSize: theme.variables.buttonTextSize,
    color: theme.variables.buttonColor
  },
  textBold:{
    fontWeight: 'bold'
  }
});

const Button = React.memo(({
  text,
  icon,
  style,
  color,
  bold,
  onPress,
  align,
  type,
  request,
  display,
  ...props
}) => {
  const textColor = () =>{
    if(props.disabled){
      return theme.variables.disabled;
    } else if(color){
      if(type === 'link' || type === 'outlined'){
        switch(color) {
          case 'primary':
            return theme.variables.primary;
          case 'secondary':
            return theme.variables.secondary;
          case 'success':
            return theme.variables.success;
          case 'alert':
            return theme.variables.alert;
          case 'disabled':
            return theme.variables.disabled;
          default:
            return color;
        }
      }
    } else {
      return theme.variables.textColor;
    }
  };

  const colorStyle = () => {
    if(type === 'outlined'){
      if(props.disabled){
        return {borderColor: theme.variables.disabled};
      } else if (color){
        switch(color) {
          case 'primary':
            return {borderColor: theme.variables.primary};
          case 'secondary':
            return {borderColor: theme.variables.secondary};
          case 'success':
            return {borderColor: theme.variables.success};
          case 'alert':
            return {borderColor: theme.variables.alert};
          case 'disabled':
            return {borderColor: theme.variables.disabled};
          default:
            return {borderColor: color};
        }
      } else {
        return {borderColor: theme.variables.textColor};
      }
    } else if (!type){
      if(props.disabled){
        return {backgroundColor: theme.variables.disabled};
      } else if (color) {
        switch(color) {
          case 'primary':
            return {backgroundColor: theme.variables.primary};
          case 'secondary':
            return {backgroundColor: theme.variables.secondary};
          case 'success':
            return {backgroundColor: theme.variables.success};
          case 'alert':
            return {backgroundColor: theme.variables.alert};
          case 'disabled':
            return {backgroundColor: theme.variables.disabled};
          default:
            return {backgroundColor: color};
        }
      }
    }
  };

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.button,
        {
          'link': styles.link,
          'outlined': styles.outlined,
        }[type] || styles.full,
        {
          'left': {alignSelf: 'flex-start'},
          'right': {alignSelf: 'flex-end'},
        }[align],
        {
          'block': {width: '100%'}
        }[display],
        colorStyle(),
        style
      ]}
      onPress={onPress}
    >
      {icon && !request &&
        <Icon
          style={[
            text ? styles.iconWithText : styles.icon,
            type && {color: textColor()}
          ]}
          name={icon}
        />
      }
      {request && request.status === 'pending' &&
        <ActivityIndicator
          style={[
            text ? styles.iconWithText : styles.icon,
            {color: textColor()}
          ]}
          size='small'
          color={type ? textColor() : theme.variables.buttonColor}
        />
      }
      {text &&
        <Text style={[
          styles.text,
          bold && (theme.variables.fontFamilyBold ? {fontFamily:theme.variables.fontFamilyBold } : styles.textBold),
          type && {color: textColor()}
        ]}>{text}</Text>
      }
    </TouchableOpacity>
  );
});

export default Button;
