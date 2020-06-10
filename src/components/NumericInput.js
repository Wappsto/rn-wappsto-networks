import React, { useCallback, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import Text from './Text';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../translations';

const styles = StyleSheet.create({
  numericInput:{
    flexDirection:'row',
    borderWidth: theme.variables.borderWidth,
    borderRadius: theme.variables.borderRadiusBase,
    borderColor: theme.variables.buttonBg,
    marginVertical: 2,
    maxWidth:'95%',
    alignSelf:'center',
    height: Math.round(theme.variables.inputTextSize * 1.5) + 20,
    overflow:'hidden'
  },
  numericInputDisabled: {
    borderColor: theme.variables.disabled,
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
  inputError: {
    borderColor: theme.variables.alert,
    color: theme.variables.alert
  },
  inputDisabled: {
    color: theme.variables.disabled
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
  spinner: {
    top:0,
    bottom:0,
    left:0,
    right:0,
    position: 'absolute'
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
  isUpdating
}) => {
  const { t } = useTranslation();
  const [ warning, setWarning ] = useState(false);

  const updateWarning = useCallback((value) => {
    if(min !== null && min !== undefined && !isNaN(min)){
      if(parseFloat(value) < parseFloat(min)){
        setWarning(['validation.wrongMinNumber', { number: min }]);
        return;
      }
    }
    if(max !== null && max !== undefined && !isNaN(max)){
      if(value > parseFloat(max)){
        setWarning(['validation.wrongMaxNumber', { number: max }]);
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
    const newValue = (parseFloat(value) || 0) - (parseFloat(step) || 0);
    onButtonClick(newValue);
    updateWarning(newValue);
  }, [value, step, updateWarning, onButtonClick]);

  const onRightButtonClick = useCallback(() => {
    const newValue = (parseFloat(value) || 0) + (parseFloat(step) || 0);
    onButtonClick(newValue);
    updateWarning(newValue);
  }, [value, step, updateWarning, onButtonClick]);

  return (
    <>
      {label &&
        <Text
          content={label}
        />
      }
      <View style={[styles.numericInput, validationError && styles.inputError, disabled && styles.numericInputDisabled]}>
        <TouchableOpacity
          disabled={disabled}
          style={[styles.button, disabled ? theme.common.disabled : {}]}
          onPress={onLeftButtonClick}
        >
          <Icon
            style={styles.icon}
            name={'minus'}
          />
        </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={[styles.input, disabled && styles.inputDisabled, style]}
            selectionColor={theme.variables.inputSelectionColor}
            defaultValue={defaultValue + ''}
            value={value + ''}
            onSubmitEditing={onSubmitEditing}
            onChangeText={onChangeText}
            editable={!disabled}
            textAlign={'center'}
            autoCorrect={false}
            keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'number-pad'}
            returnKeyType='done'
          />
          <TouchableOpacity
            disabled={disabled}
            style={[styles.button, disabled && theme.common.disabled]}
            onPress={onRightButtonClick}
          >
            <Icon
              style={styles.icon}
              name={'plus'}
            />
          </TouchableOpacity>
          {isUpdating && <ActivityIndicator style={styles.spinner} color={theme.variables.spinnerColor}/>}
        </View>
        {!!warning &&
          <Text
            color='warning'
            content={CapitalizeFirst(t(...warning))}
          />
        }
    </>
  );
});

export default NumericInput;
