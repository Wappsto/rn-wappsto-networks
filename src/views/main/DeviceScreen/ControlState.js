import React from 'react';
import { View, TextInput, Switch } from 'react-native';
import Text from '../../../components/Text';
import Slider from '@react-native-community/slider';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import Timestamp from './Timestamp';
import { cannotAccessState } from 'wappsto-blanket/util';
import { getStateData } from '../../../util/helpers';
import useControlState from '../../../hooks/useControlState';
import NumericInput from 'react-native-numeric-input';

export const StateDataField = ({
  value,
  input,
  setInput,
  isFocused,
  setIsFocused,
  updateStateFromInput,
  updateSwitchState,
  throttledUpdateState,
  updateState,
  request,
  isUpdating
}) => {
  let stateDataField = null;
  if (value.hasOwnProperty('string')) {
    stateDataField = (
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={theme.common.input}
        value={input}
        maxLength={value.string.max}
        onSubmitEditing={updateStateFromInput}
        onChangeText={text => setInput(text)}
        editable={!isUpdating}
      />
    );
  } else if (value.hasOwnProperty('number')) {
    let param = value.number;
    if (
      (param.max - param.min) % param.step === 0 &&
      param.min + param.step === param.max
    ) {
      stateDataField = (
        <Switch
          value={!!parseFloat(input)}
          onValueChange={updateSwitchState}
          disabled={isUpdating}
          switchThumbColor={theme.variables.switchThumbColor}
          switchThumbColor={theme.variables.switchTrackColor}
        />
      );
    } else if ((param.max - param.min) / param.step <= 150) {
      const onSlidingComplete = (data) => {
        setIsFocused(false);
        updateState(getStateData(data, param.step));
      }
      stateDataField = (
        <Slider
          onSlidingStart={() => setIsFocused(true)}
          onSlidingComplete={onSlidingComplete}
          maximumValue={param.max}
          minimumValue={param.min}
          step={param.step}
          style={{width: '100%'}}
          value={parseFloat(input) || 0}
          disabled={isUpdating}
          thumbTintColor={theme.variables.sliderThumbTintColor}
          minimumTrackTintColor={theme.variables.sliderMinimumTrackTintColor}
          maximumTrackTintColor={theme.variables.sliderMaximumTrackTintColor}
        />
      );
    } else {
      stateDataField = (
        <NumericInput
          initValue={parseFloat(input)}
          value={parseFloat(input)}
          valueType='real'
          maxValue={param.max}
          minValue={param.min}
          step={param.step}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          extraTextInputProps={{
            onSubmitEditing: updateStateFromInput
          }}
          onChange={(data) => !isFocused && throttledUpdateState(data)}
          editable={!isUpdating}
          rounded={theme.variables.NumericInputRounded}
          inputStyle={{
            backgroundColor:theme.variables.NumericInputBackground,
            maxHeight:'100%',
            borderLeftWidth:0,
            borderRightWidth:0
          }}
          textColor={theme.variables.NumericInputTextColor}
          iconStyle={{color:theme.variables.NumericInputButtonTextColor}}
          rightButtonBackgroundColor={theme.variables.NumericInputButtonBackground}
          leftButtonBackgroundColor={theme.variables.NumericInputButtonBackground}
          upDownButtonsBackgroundColor={theme.variables.NumericInputButtonBackground}
          borderColor={theme.variables.NumericInputBorder}
        />
      );
    }
  } else if (value.hasOwnProperty('blob')) {
    stateDataField = (
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={true}
        numberOfLines={10}
        style={theme.common.input}
        value={input}
        maxLength={value.blob.max}
        onSubmitEditing={updateStateFromInput}
        onChangeText={text => setInput(text)}
        editable={!isUpdating}
      />
    );
  } else if (value.hasOwnProperty('xml')) {
    stateDataField = (
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={true}
        numberOfLines={10}
        style={theme.common.input}
        value={input}
        maxLength={value.xml.max}
        onSubmitEditing={updateStateFromInput}
        editable={!isUpdating}
        onChangeText={text => setInput(text)}
      />
    );
  }
  return stateDataField;
}

const ControlState = React.memo(({ state, value }) => {
  const { t } = useTranslation();
  const controlStateController = useControlState(state, value);

  return (
    <View>
      <Text color='secondary' content={CapitalizeFirst(t('desiredState'))}/>
      {
        cannotAccessState(state) ?
        (
          <Text content={CapitalizeFirst(t('cannotAccess.' + state.status_payment))}/>
        ) : (
          <>
            <View style={{alignItems: 'center', marginBottom: 15}}>
              <StateDataField {...controlStateController} value={value}/>
            </View>
            <RequestError request={controlStateController.request} />
            <Timestamp timestamp={state.timestamp}/>
          </>
        )
      }
    </View>
  );
});

export default ControlState;
