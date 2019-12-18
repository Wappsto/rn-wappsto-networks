import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import i18n, { CapitalizeFirst } from '../../../translations';
import useRequest from 'wappsto-blanket/hooks/useRequest';

const toNumber = (x) => {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split('e-')[1], 10);
    if (e) {
        x *= Math.pow(10, e - 1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split('+')[1], 10);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += (new Array(e + 1)).join('0');
    }
  }
  return x;
}

const countDecimals = (value) => {
  value = toNumber(value);
  if(Math.floor(value) === value) {
    return 0;
  }
  return value.toString().split('.')[1].length || 0;
}

const getData = (data, step) => {
	const d = countDecimals(step);
	if(d > 0){
    const divider = 10 ** d;
		const newData = Math.round(data * divider);
		return newData / divider;
	}
  return Math.round(data);
}

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
    if (data === state.data) {
      return;
    }
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
    } else if (param.max - param.min <= 300) {
      const onSlidingComplete = (data) => {
        setIsFocused(false);
        updateState(getData(data, param.step));
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
          value={input}
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
      <View style={{alignItems: 'center', marginBottom: 15}}>
        {stateDataField}
      </View>
      <RequestError request={request} />
    </View>
  );
});

export default ControlState;
