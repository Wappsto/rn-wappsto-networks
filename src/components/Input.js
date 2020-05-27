import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import Text from './Text';
import Icon from 'react-native-vector-icons/FontAwesome5';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  input: {
    width: '100%',
    fontSize: theme.variables.inputTextSize,
    fontFamily: theme.variables.fontFamily,
    color: theme.variables.inputTextColor,
    marginBottom: 2,
    paddingHorizontal: 5,
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
  label: {
    lineHeight: Math.round(theme.variables.defaultFontSize * 1.5)
  },
  passwordVisibilityButton: {
    position: 'absolute',
    color: theme.variables.inputTextColor,
    lineHeight: Math.round(theme.variables.inputTextSize * 1.5),
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  inputWrapper: {
    width:'100%',
    marginBottom: theme.variables.defaultFontSize
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
          style={styles.label}
          content={label}
        />
      }
      <View style={styles.inputWrapper}>
        <TextInput
          {...props}
          ref={inputRef}
          style={[styles.input, validationError && styles.inputError, style]}
          selectionColor={theme.variables.inputSelectionColor}
          value={value}
          editable={!disabled}
          autoCorrect={false}
        />
        {toggleShowPassword &&
          <Icon
            style={styles.passwordVisibilityButton}
            name={showPassword ? 'eye-slash' : 'eye'}
            onPress={toggleShowPassword}
            size={14}
          />
        }
        {!!validationError &&
          <Text color='error' content={validationError}/>
        }
      </View>
    </>
  );
});

export default Input;
