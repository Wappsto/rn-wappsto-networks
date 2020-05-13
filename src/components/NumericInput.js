import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../translations';

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

const NumericInput = React.memo(({
  inputRef,
  label,
  style,
  validationError,
  defaultValue,
  value,
  max,
  min,
  step,
  onFocus,
  onBlur,
  onSubmitEditing,
  onChange,
  onButtonClick,
  disabled,
}) => {
  const { t } = useTranslation();
  const [ warning, setWarning ] = useState(false);

  const updateWarning = useCallback((value) => {
    if(min !== null && min !== undefined && !isNaN(min)){
      if(parseFloat(value) < parseFloat(min)){
        setWarning('min');
        return;
      }
    }
    if(max !== null && max !== undefined && !isNaN(max)){
      if(value > parseFloat(max)){
        setWarning('max');
        return;
      }
    }
    if(warning) {
      setWarning(false);
    }
  }, [min, max, warning]);

  const onChangeText = useCallback((text) => {
    onChange(text);
    updateWarning(text);
  }, [onChange, updateWarning]);

  const onLeftButtonClick = useCallback(() => {
    const newValue = parseFloat(value) - (parseFloat(step) || 1);
    onButtonClick(newValue);
    updateWarning(newValue);
  }, [value, step, updateWarning, onButtonClick]);

  const onRightButtonClick = useCallback(() => {
    const newValue = parseFloat(value) + (parseFloat(step) || 1);
    onButtonClick(newValue);
    updateWarning(newValue);
  }, [value, step, updateWarning, onButtonClick]);

  return (
    <>
      {label &&
        <Text style={styles.label}>{label}</Text>
      }
      <View style={[styles.numericInput, validationError && styles.inputError]}>
        <TouchableOpacity
          disabled={disabled}
          style={styles.button}
          onPress={onLeftButtonClick}
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
            defaultValue={defaultValue}
            value={value}
            onFocus={onFocus}
            onBlur={onBlur}
            onSubmitEditing={onSubmitEditing}
            onChangeText={onChangeText}
            editable={!disabled}
            autoCorrect={false}
            keyboardType='number-pad'
            returnKeyType='done'
            validationError={validationError}
          />
          <TouchableOpacity
            disabled={disabled}
            style={styles.button}
            onPress={onRightButtonClick}
          >
            <Icon
              style={styles.icon}
              name={'plus'}
            />
          </TouchableOpacity>
        </View>
        {!!validationError &&
          <Text style={styles.inputValidationError}>{validationError}</Text>
        }
        {!!warning &&
          <Text style={styles.inputValidationError}>{CapitalizeFirst(t('warning.' + warning))}</Text>
        }
    </>
  );
});

export default NumericInput;
