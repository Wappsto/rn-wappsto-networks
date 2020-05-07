import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  numericInput:{
    flexDirection:'row',
    borderWidth: theme.variables.borderWidth,
    borderRadius: theme.variables.borderRadiusBase,
    borderColor: theme.variables.buttonBg,
    marginBottom: theme.variables.defaultFontSize,
    maxWidth:'95%',
    alignSelf:'center',
    height: Math.round(theme.variables.inputTextSize * 1.5) + 20,
    overflow:'hidden'
  },
  input: {
    minWidth:100,
    maxWidth: '80%',
    fontSize: theme.variables.inputTextSize,
    fontFamily: theme.variables.fontFamily,
    color: theme.variables.inputTextColor,
    paddingHorizontal: 5,
    backgroundColor: theme.variables.inputBg,
        height: '100%',
  },
  button:{
    width: 50,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: theme.variables.buttonBg
  },
  icon:{
    color: theme.variables.buttonColor
  },
  inputError: {
    borderColor: theme.variables.alert,
    color: theme.variables.alert
  },
  inputValidationError: {
    color: theme.variables.alert,
    fontFamily: theme.variables.fontFamily,
    marginTop: Math.round(theme.variables.defaultFontSize * 0.8) * -1,
    marginBottom: theme.variables.defaultFontSize
  },
  label: {
    color: theme.variables.textColor,
    fontFamily: theme.variables.fontFamily,
    fontSize: theme.variables.defaultFontSize,
    lineHeight: Math.round(theme.variables.defaultFontSize * 1.5)
  }
});

const Input = React.memo(({
  inputRef,
  label,
  value,
  style,
  disabled,
  onBlur,
  onSubmitEditing,
  onChangeText,
  validationError,
  showPassword,
  toggleShowPassword
}) => {

  return (
    <>
      {label &&
        <Text style={styles.label}>{label}</Text>
      }
      <View style={[styles.numericInput, validationError && styles.inputError]}>
        <TouchableOpacity
          style={styles.button}
        >
          <Icon
            style={styles.icon}
            name={'minus'}
          />
        </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={[styles.input, style]}
            selectionColor={theme.variables.inputSelectionColor}
            value={value}
            disabled={disabled}
            autoCorrect={false}
            keyboardType={'numbers-and-punctuation'}
            returnKeyType={'done'}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            onBlur={onBlur}
            validationError={validationError}
          />
          <TouchableOpacity
            style={styles.button}
          >
            <Icon
              style={styles.icon}
              name={'plus'}
            />
          </TouchableOpacity>
        </View>
        {validationError &&
          <Text style={styles.inputValidationError}>{validationError}</Text>
        }
    </>
  );
});

export default Input;
