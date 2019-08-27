import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator
} from 'react-native';

import Screen from "../../components/Screen";
import MenuButton from '../../components/MenuButton';
import List from '../../components/List';
import ListRow from '../../components/ListRow';

class DevicesListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Home',
      headerLeft: <MenuButton navigation={navigation} />
    };
  }
  render() {
    return (
      <Screen>
        <List
          type="device"
          renderItem={({item}) =>
            <ListRow
              selectedName="selectedDevice"
              navigateTo="DeviceScreen"
              item={item}
              childName="value"
              navigation={this.props.navigation}
            />
          }
        />
      </Screen>
    );
  }
}

export default DevicesListScreen;
