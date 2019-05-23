import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView
} from 'react-native';
import Screen from "../../components/Screen";
import List from '../../components/List';
import ListRow from '../../components/ListRow';

import * as items from 'wappsto-redux/actions/items';
import { getEntity } from 'wappsto-redux/selectors/entities';

import theme from "../../theme/themeExport";

function mapStateToProps(state){
  return {
    selectedDevice: getEntity(state, "device", state.items.selectedDevice)
  }
}

function mapDispatchToProps(dispatch){
  return {
    ...bindActionCreators(items, dispatch)
  }
}

class DeviceScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', '')
    };
  }

  componentWillUnmout(){
    this.props.removeItem("device");
  }

  render() {
    let device = this.props.selectedDevice;
    return (
      <Screen>
        <ScrollView>
          <View style={theme.common.infoPanel}>
            <Text>{device.name}</Text>
            <Text>UUID: {device.meta.id}</Text>
            <Text>Communication: {device.communication}</Text>
            <Text>Product: {device.product}</Text>
            <Text>Protocol: {device.protocol}</Text>
            <Text>Serial: {device.serial}</Text>
            <Text>Version: {device.version}</Text>
            <Text>Description: {device.description}</Text>
            <Text>Device values</Text>
          </View>
        <List
          id={device.meta.id}
          type="device"
          childType="value"
          renderItem={({item}) =>
            <ListRow
              selectedName="selectedValue"
              navigateTo="ValueScreen"
              item={item}
              navigation={this.props.navigation}
            />
          }
        />
        </ScrollView>
      </Screen>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceScreen);
