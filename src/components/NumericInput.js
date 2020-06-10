import React, { useCallback, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Platform } from 'react-native';
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
  button:{
    width: 50,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: theme.variables.buttonBg
  },
  icon:{
    color: theme.variables.buttonColor
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
            style={styles.button}
            onPress={onRightButtonClick}
          >
            <Icon
              style={styles.icon}
              name={'plus'}
            />
          </TouchableOpacity>
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
