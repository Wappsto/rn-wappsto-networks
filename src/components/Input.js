import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Text from './Text';
import Icon from 'react-native-vector-icons/FontAwesome5';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  inputWrapper: {
    width:'100%',
    marginBottom: theme.variables.defaultFontSize
  },
  input: {
    width: '100%',
    fontSize: theme.variables.inputTextSize,
    fontFamily: theme.variables.fontFamily,
    color: theme.variables.inputTextColor,
    marginVertical: 2,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: theme.variables.inputBg,
    borderColor: theme.variables.inputBorderColor,
    borderWidth: theme.variables.borderWidth,
    borderRadius: theme.variables.borderRadiusBase,
  },
  inputError: {
    borderColor: theme.variables.alert,
    color: theme.variables.alert
  },
  inputDisabled: {
    borderColor: theme.variables.disabled,
    color: theme.variables.disabled
  },
  validationError:{
    fontSize:theme.variables.fontSizeBase
  },
  passwordVisibilityButton: {
    position: 'absolute',
    right: 0,
    justifyContent:'center',
    height:'100%'
  },
  passwordVisibilityIcon: {
    paddingHorizontal: 14,
    paddingVertical: 14
  }
});

const Input = React.memo(({
  inputRef,
  label,
  style,
  value,
  disabled,
  showPassword,
  toggleShowPassword,
  validationError,
  ...props
}) => {

  return (
    <>
      {!!label &&
        <Text
          content={label}
          color={validationError ? 'error' : disabled ? 'disabled' : ''}
        />
      }
      <View style={styles.inputWrapper}>
        <TextInput
          {...props}
          ref={inputRef}
          style={[styles.input, validationError && styles.inputError, disabled && styles.inputDisabled, style]}
          selectionColor={theme.variables.inputSelectionColor}
          value={value}
          editable={!disabled}
          autoCorrect={false}
          showPassword={showPassword}
          toggleShowPassword={toggleShowPassword}
        />
        {toggleShowPassword &&
          <View style={styles.passwordVisibilityButton}>
            <Icon
              color={validationError ? theme.variables.alert : disabled ? theme.variables.disabled : theme.variables.inputTextColor}
              name={showPassword ? 'eye-slash' : 'eye'}
              onPress={toggleShowPassword}
              style={styles.passwordVisibilityIcon}
              size={14}
            />
          </View>
        }
        {!!validationError &&
          <Text
            color='error'
            content={validationError}
            style={styles.validationError}
          />
        }
      </View>
    </>
  );
});

export default Input;
