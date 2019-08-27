import React, { PureComponent, Fragment } from 'react';
import {
  View,
  Text
} from 'react-native';

import PopupButton from './PopupButton';
import Popup from './Popup';
import theme from "../theme/themeExport";

export default class ValueSettings extends PureComponent {
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

  content = (visible, hide) => {
    const { item } = this.props;
    const valueDataType = this.getValueType(item);
    return(
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <Text>Name:         {item.name}</Text>
        <Text>Id:           {item.meta.id}</Text>
        <Text>Type:         {item.type}</Text>
        <Text>Permission:   {item.permission}</Text>
        <Text>Status:       {item.status}</Text>
        <Text>Data type: {valueDataType.text}</Text>
        {valueDataType.view}
      </Popup>
    );
  }

  render() {
    return (
      <PopupButton icon="more-vertical" buttonStyle={theme.common.barItem}>
        {this.content}
      </PopupButton>
    );
  }
}
