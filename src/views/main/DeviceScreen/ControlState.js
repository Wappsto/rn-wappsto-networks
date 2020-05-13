import React from 'react';
import { View, TextInput, Switch, StyleSheet } from 'react-native';
import Text from '../../../components/Text';
import Slider from '@react-native-community/slider';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import Timestamp from './Timestamp';
import { cannotAccessState } from 'wappsto-blanket/util';
import { getStateData } from '../../../util/helpers';
import useControlState from '../../../hooks/useControlState';
// import NumericInput from 'react-native-numeric-input';
import NumericInput from '../../../components/NumericInput';

const styles = StyleSheet.create({
  slider:{
    width: '100%'
  },
  dataWrapper:{
    alignItems: 'center',
    marginBottom: 15
  }
});

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
          ios_backgroundColor={theme.variables.switchThumbColor}
          thumbColor={theme.variables.switchThumbColor}
          trackColor={{false: theme.variables.switchTrackColorInverse, true: theme.variables.switchTrackColor}}
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
          style={styles.slider}
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
          defaultValue={input + ''}
          value={input + ''}
          max={param.max}
          min={param.min}
          step={param.step}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={updateStateFromInput}
          onChange={setInput}
          onButtonClick={throttledUpdateState}
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
            <View style={styles.dataWrapper}>
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
