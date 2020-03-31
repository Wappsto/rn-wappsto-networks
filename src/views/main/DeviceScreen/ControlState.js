import React from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import Timestamp from './Timestamp';
import { cannotAccessState } from 'wappsto-blanket/util';
import { getStateData } from '../../../util/helpers';
import useControlState from '../../../hooks/useControlState';

export const StateDataField = ({
  value,
  input,
  setInput,
  setIsFocused,
  updateStateFromInput,
  updateSwitchState,
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
          thumbTintColor={theme.variables.primary}
          minimumTrackTintColor={theme.variables.dark}
        />
      );
    } else {
      stateDataField = (
        <TextInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType='number-pad'
          style={theme.common.input}
          value={input + ''}
          onSubmitEditing={updateStateFromInput}
          onChangeText={text => setInput(text)}
          editable={!isUpdating}
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
      <Text style={theme.common.H6}>
        {CapitalizeFirst(t('desiredState'))}
      </Text>
      {
        cannotAccessState(state) ?
        (
          <Text>
            {CapitalizeFirst(t('cannotAccess.' + state.status_payment))}
          </Text>
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
