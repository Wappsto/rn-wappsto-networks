import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Switch,
  Slider
} from 'react-native';

import Timestamp from './Timestamp';
import RequestError from './RequestError';

import theme from '../theme/themeExport';

import { State, connect } from 'wappsto-components/State';

class StateComponent extends State {
  constructor(props){
    super(props);
    this.updateStateFromInput = this.updateStateFromInput.bind(this);
  }
  
  updateStateFromInput({ nativeEvent: { text } }){
    this.updateState(text);
  }

  getStateDataField(state, value){
    let disabled = this.isUpdating();
    if (value.hasOwnProperty('string')) {
      if(state.type === 'Control'){
        return (
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            value={this.state.input}
            onSubmitEditing={this.updateStateFromInput}
            onChangeText={(input) => this.setState({ input })}
            editable={!disabled}
          />
        );
      } else {
        return (
          <Text>{this.state.input}</Text>
        );
      }
    } else if (value.hasOwnProperty('number')) {
      if(state.type === 'Control'){
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
            />
          );
        } else {
          return (
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              value={this.state.input}
              onSubmitEditing={this.updateStateFromInput}
              onChangeText={(input) => this.setState({ input })}
              editable={!disabled}
            />
          );
        }
      } else {
        return (
          <Text>{this.state.input}</Text>
        )
      }
    } else if (value.hasOwnProperty('blob')) {
      if(state.type === 'Control'){
        return (
          <TextInput
            multiline={true}
            numberOfLines={10}
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            value={this.state.input}
            onSubmitEditing={this.updateStateFromInput}
            onChangeText={(input) => this.setState({ input })}
            editable={!disabled}
          />
        );
      } else {
        if(value.type === 'image'){
          if(this.state.input && this.state.input.length > 0){
            return (
              <Image
                style={styles.image}
                source={{ uri: this.state.input }}
              />
            );
          } else {
            return null;
          }
        } else {
          return (
            <Text>{this.state.input}</Text>
          );
        }
      }
    } else if (value.hasOwnProperty('xml')) {
      if(state.type === 'Control'){
        return (
          <TextInput
            multiline={true}
            numberOfLines={10}
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            value={this.state.input}
            onSubmitEditing={this.updateStateFromInput}
            editable={state.type === 'Control' ? !disabled : false}
            onChangeText={(input) => this.setState({ input })}
          />
        );
      } else {
        return (
          <Text>{this.state.input}</Text>
        );
      }
    }
  }

  render() {
    let value = this.props.value;
    let state = this.props.state;
    let request = this.props.request;
    return (
      <View style={theme.common.listItem}>
        <View style={theme.common.listItemTitleArea}>
          <Text>UUID: {state.meta.id}</Text>
          <Text>Type: {state.type}</Text>
          <Text>Status: {state.status}</Text>
          <Text>Last updated: <Timestamp time={state.timestamp} /></Text>
          {this.getStateDataField(state, value)}
          <RequestError error={request} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'cyan',
    borderWidth: 1,
    borderColor: 'black',
    margin: 2
  },
  image: {
    width: 200,
    height: 200
  }
});

export default connect(StateComponent);
