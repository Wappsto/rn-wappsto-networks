import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Screen from "../../components/Screen";
import StatesComponent from '../../components/StatesComponent';

import * as request from 'wappsto-redux/actions/request';
import { getEntity } from 'wappsto-redux/selectors/entities';
import { getRequest } from 'wappsto-redux/selectors/request';

import theme from "../../theme/themeExport";
import Icon from 'react-native-vector-icons/Feather';

function mapStateToProps(state){
  let valueId = state.items.selectedValue;
  return {
    request: getRequest(state, "/value/" + valueId, "PATCH"),
    selectedValue: getEntity(state, "value", valueId)
  }
}

function mapDispatchToProps(dispatch){
  return {
    ...bindActionCreators(request, dispatch)
  }
}

class ValueScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', '')
    };
  }

  componentWillUnmout(){
    this.props.removeItem("value");
  }

  updateValueStatus(){
    this.props.makeRequest("PATCH", "/value/" + this.props.selectedValue.meta.id, { status: "update" });
  }

  getValueType(value){
    if(value){
      if(value.hasOwnProperty('blob')){
        return {
          view: (
            <View>
              <Text>encoding: {value.blob.encoding}</Text>
              <Text>max: {value.blob.max}</Text>
            </View>
          ),
          text: 'blob'
        };
      } else if(value.hasOwnProperty('number')){
        return {
          view: (
            <View>
              <Text>minimum: {value.number.min}</Text>
              <Text>maximum: {value.number.max}</Text>
              <Text>step size: {value.number.step}</Text>
              <Text>unit: {value.number.unit}</Text>
            </View>
          ),
          text: 'number'
        };
      } else if(value.hasOwnProperty('string')){
        return {
          view: (
            <View>
              <Text>encoding: {value.string.encoding}</Text>
              <Text>max: {value.string.max}</Text>
            </View>
          ),
          text: 'string'
        };
      } else if(value.hasOwnProperty('xml')){
        return {
          view: (
            <View>
              <Text>xsd: {value.xml.xsd}</Text>
              <Text>namespace: {value.xml.namespace}</Text>
            </View>
          ),
          text: 'xml'
        };
      }
    }
    return {view: null, text: ''};
  }

  render() {
    let request = this.props.request;
    let value = this.props.selectedValue;
    let valueDataType = this.getValueType(value);
    return (
      <Screen>
        <ScrollView>
          <View style={theme.common.infoPanel}>
            <Text>UUID: {value.meta.id}</Text>
            <Text>Type: {value.type}</Text>
            <Text>Status: {value.status}</Text>
            <Text>Data type: {valueDataType.text}</Text>
            {valueDataType.view}
            <Text>Permission: {value.permission}</Text>
            <TouchableOpacity style={[theme.common.centeredContent, theme.common.roundOutline, theme.common.row, request && request.status === "pending" ? theme.common.disabled : null]} onPress={this.updateValueStatus.bind(this)}>
              {
                request && request.status === "pending" ?
                <ActivityIndicator size="small" color={theme.variables.white} /> :
                <Fragment>
                  <Icon name="rotate-cw" size={20} color={theme.variables.primary} style={{marginRight: 20}}/>
                  <Text>Refresh state data</Text>
                </Fragment>
              }
            </TouchableOpacity>
          </View>
          <StatesComponent value={value} />
          {/*
            or simply use instead
            <List
              id={value.meta.id}
              type="value"
              childType="state"
              sort={(state) => {
                return state.type === "Control" ? 1 : -1;
              }}
              renderItem={({item}) =>
                <StateComponent value={value} state={item} />
              }
            />
          */}
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValueScreen);
