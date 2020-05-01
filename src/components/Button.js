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
    fontFamily: theme.variables.buttonFontFamily,
    fontSize: theme.variables.buttonTextSize,
    color: theme.variables.buttonColor
  }
});

const Button = React.memo(({
  text,
  icon,
  style,
  color,
  onPress,
  align,
  type,
  request,
  disabled,
  display
}) => {
  const textColor = () =>{
    if(color){
      if(type === 'link' || type === 'outlined'){
        switch(color) {
          case 'primary':
            return {color: theme.variables.primary};
            break;
          case 'secondary':
            return {color: theme.variables.secondary};
            break;
          case 'success':
            return {color: theme.variables.success};
            break;
          case 'alert':
            return {color: theme.variables.alert};
            break;
          case 'disabled':
            return {color: theme.variables.disabled};
            break;
          default:
            return {color: color};
        }
      }
    } else return {color: theme.variables.textColor};
  };

  const colorStyle = () => {
    if(type === 'outlined'){
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
          return {borderColor: theme.variables.textColor};
      }
    } else if (!type){
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
          return {};
      }
    };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          'link': styles.link,
          'outlined': styles.outlined,
        }[type] || styles.full,
        {
          'left': {alignSelf: 'flex-start'},
          'right': {alignSelf: 'flex-end'},
        }[align] || {alignSelf: 'center'},
        {
          'block': {width: '100%'}
        }[display],
        color && colorStyle(),
        style
      ]}
      onPress={onPress}
    >
      {icon && !request &&
        <Icon
          style={[
            text ? styles.iconWithText : styles.icon,
            type && textColor()
          ]}
          name={icon}
        />
      }
      {request && request.status === 'pending' &&
        <ActivityIndicator
          style={[
            text ? styles.iconWithText : styles.icon,
            type && textColor()
          ]}
          size='small'
          color={type && textColor()}
        />
      }
      {text &&
        <Text style={[
          styles.text,
          type && textColor()
        ]}>{text}</Text>
      }
    </TouchableOpacity>
  );
});

export default Button;
