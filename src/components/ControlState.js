import React from 'react';
import {View, Text, Slider, TextInput, Switch} from 'react-native';
import RequestError from './RequestError';

import theme from '../theme/themeExport';
import i18n, {CapitalizeFirst} from '../translations/i18n';
import {State, connect} from 'wappsto-components/State';

class ControlState extends State {
  updateStateFromInput = ({nativeEvent: {text}}) => {
    this.updateState(text);
  };

  updateSwitchState = boolValue => {
    const {value} = this.props;
    if (value.hasOwnProperty('number')) {
      this.updateState(boolValue ? '1' : '0');
    } else {
      this.updateState(boolValue);
    }
  };

  getStateDataField(state, value) {
    let disabled = this.isUpdating();
    if (value.hasOwnProperty('string')) {
      return (
        <TextInput
          style={theme.common.input}
          value={this.state.input}
          onSubmitEditing={this.updateStateFromInput}
          onChangeText={input => this.setState({input})}
          editable={!disabled}
        />
      );
    } else if (value.hasOwnProperty('number')) {
      let param = value.number;
      if (
        (param.max - param.min) % param.step === 0 &&
        param.min + param.step === param.max
      ) {
        return (
          <Switch
            value={!!parseFloat(this.state.input)}
            onValueChange={this.updateSwitchState}
            disabled={disabled}
          />
        );
      } else if (param.max - param.min <= 300) {
        return (
          <Slider
            maximumValue={param.max}
            minimumValue={param.min}
            step={param.step}
            style={{width: '100%'}}
            value={parseFloat(this.state.input)}
            onSlidingComplete={this.updateState}
            disabled={disabled}
            thumbTintColor={theme.variables.primary}
            minimumTrackTintColor={theme.variables.dark}
          />
        );
      } else {
        return (
          <TextInput
            style={theme.common.input}
            value={this.state.input}
            onSubmitEditing={this.updateStateFromInput}
            onChangeText={input => this.setState({input})}
            editable={!disabled}
          />
        );
      }
    } else if (value.hasOwnProperty('blob')) {
      return (
        <TextInput
          multiline={true}
          numberOfLines={10}
          style={theme.common.input}
          value={this.state.input}
          onSubmitEditing={this.updateStateFromInput}
          onChangeText={input => this.setState({input})}
          editable={!disabled}
        />
      );
    } else if (value.hasOwnProperty('xml')) {
      return (
        <TextInput
          multiline={true}
          numberOfLines={10}
          style={theme.common.input}
          value={this.state.input}
          onSubmitEditing={this.updateStateFromInput}
          editable={state.type === 'Control' ? !disabled : false}
          onChangeText={input => this.setState({input})}
        />
      );
    }
  }

  render() {
    const {state, value, request} = this.props;
    return (
      <View>
        <Text style={theme.common.H6}>
          {CapitalizeFirst(i18n.t('desiredState'))}
        </Text>
        <View style={{alignItems: 'center', marginBottom: 15}}>
          {this.getStateDataField(state, value)}
        </View>
        <RequestError error={request} />
      </View>
    );
  }
}

export default connect(ControlState);
