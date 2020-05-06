import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: Math.round(theme.variables.inputTextSize * 1.5) + 20,
    fontSize: theme.variables.inputTextSize,
    fontFamily: theme.variables.fontFamily,
    color: theme.variables.inputTextColor,
    marginBottom: theme.variables.defaultFontSize,
    paddingHorizontal: 10,
    backgroundColor: theme.variables.inputBg,
    borderColor: theme.variables.inputBorderColor,
    borderWidth: theme.variables.borderWidth,
    borderRadius: theme.variables.borderRadiusBase,
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
  },
  passwordVisibilityButton: {
    position: 'absolute',
    color: theme.variables.inputTextColor,
    lineHeight: Math.round(theme.variables.inputTextSize * 1.5),
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
});

const Input = React.memo(({
  inputRef,
  label,
  value,
  style,
  disabled,
  placeholder,
  textContentType,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  returnKeyType,
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
      <View>
        <TextInput
          ref={inputRef}
          style={[styles.input, validationError && styles.inputError, style]}
          selectionColor={theme.variables.inputSelectionColor}
          value={value}
          disabled={disabled}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          autoCorrect={false}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          onBlur={onBlur}
          validationError={validationError}
        />
        {toggleShowPassword &&
          <Icon
            style={styles.passwordVisibilityButton}
            name={showPassword ? 'eye-slash' : 'eye'}
            onPress={toggleShowPassword}
            size={14}
          />
        }
        {validationError &&
          <Text style={styles.inputValidationError}>{validationError}</Text>
        }
      </View>
    </>
  );
});

export default Input;
