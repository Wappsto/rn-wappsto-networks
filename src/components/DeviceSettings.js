import React, { PureComponent, Fragment } from 'react';
import {
  View,
  Text
} from 'react-native';

import PopupButton from './PopupButton';
import Popup from './Popup';
import theme from "../theme/themeExport";

export default class ValueSettings extends PureComponent {
  content = (visible, hide) => {
    const { item } = this.props;
    return(
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <Text>Name:         {item.name}</Text>
        <Text>Id:           {item.meta.id}</Text>
        <Text>Manufacturer: {item.manufacturer}</Text>
        <Text>Product:      {item.product}</Text>
        <Text>Version:      {item.version}</Text>
        <Text>Serial:       {item.serial}</Text>
        <Text>Description:  {item.description}</Text>
        <Text>Included:     {item.included}</Text>
      </Popup>
    );
  }
  render() {
    return (
      <PopupButton icon="settings" buttonStyle={theme.common.listItemArrow}>
        {this.content}
      </PopupButton>
    );
  }
}
