import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import i18n, { CapitalizeFirst } from '../../../translations';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import Timestamp from './Timestamp';
import { cannotAccessState } from 'wappsto-blanket/util';
import { getStateData } from '../../../util/helpers';

const ControlState = React.memo(({ state, value }) => {
  const { request, send } = useRequest();
  const [ input, setInput ] = useState();
  const [ isFocused, setIsFocused ] = useState(false);
  const isUpdating = request && request.status === 'pending';

  useEffect(() => {
    if(!isFocused){
      setInput(value.hasOwnProperty('number') ? parseFloat(state.data) || 0 : state.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const updateState = (data) => {
    data = data + '';
    if (!isUpdating) {
      let timestamp = new Date().toISOString();
      send({
        method: 'PATCH',
        url: '/state/' + state.meta.id,
        body: {
          data,
          timestamp,
        }
      });
    }
  }

  const updateStateFromInput = ({nativeEvent: {text}}) => {
    updateState(text);
  };

  const updateSwitchState = boolValue => {
    let data;
    if (value.hasOwnProperty('number')) {
      data = boolValue ? '1' : '0';
    } else {
      data = boolValue;
    }
    updateState(data);
    setInput(data);
  };

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

  return (
    <View>
      <Text style={theme.common.H6}>
        {CapitalizeFirst(i18n.t('desiredState'))}
      </Text>
      {
        cannotAccessState(state) ?
        (
          <Text>
            {CapitalizeFirst(i18n.t('cannotAccess.' + state.status_payment))}
          </Text>
        ) : (
          <>
            <View style={{alignItems: 'center', marginBottom: 15}}>
              {stateDataField}
            </View>
            <RequestError request={request} />
            <Timestamp timestamp={state.timestamp}/>
          </>
        )
      }
    </View>
  );
});

export default ControlState;
