import React from 'react';
import {
  View,
  TextInput,
  Switch
} from 'react-native';
import Slider from '@react-native-community/slider';
import Timestamp from './Timestamp';
import RequestError from './RequestError';

import theme from '../theme/themeExport';

import { State, connect } from 'wappsto-components/State';

class ControlState extends State {
  updateStateFromInput = ({ nativeEvent: { text } }) => {
    this.updateState(text);
  }

  getStateDataField(state, value){
    let disabled = this.isUpdating();
    if (value.hasOwnProperty('string')) {
      return (
        <TextInput
          style={theme.common.input}
          value={this.state.input}
          onSubmitEditing={this.updateStateFromInput}
          onChangeText={(input) => this.setState({ input })}
          editable={!disabled}
        />
      );
    } else if (value.hasOwnProperty('number')) {
      let param = value.number;
      if ((((param.max - param.min) % param.step) === 0) && (param.min + param.step === param.max)) {
        return (
          <Switch
            value={parseFloat(this.state.input)}
            onValueChange={this.updateState}
            disabled={disabled}
          />
        );
      } else if ((param.max - param.min) <= 300) {
        return (
          <Slider
            maximumValue={param.max}
            minimumValue={param.min}
            step={param.step}
            value={parseFloat(this.state.input)}
            onSlidingComplete={this.updateState}
            disabled={disabled}
            color={theme.variables.primary}
          />
        );
      } else {
        return (
          <TextInput
            style={theme.common.input}
            value={this.state.input}
            onSubmitEditing={this.updateStateFromInput}
            onChangeText={(input) => this.setState({ input })}
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
          onChangeText={(input) => this.setState({ input })}
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
          onChangeText={(input) => this.setState({ input })}
        />
      );
    }
  }

  render() {
    const { state, value, request } = this.props;
    return (
      <View>
        {this.getStateDataField(state, value)}
        <RequestError error={request} />
      </View>
    );
  }
}

export default connect(ControlState);
