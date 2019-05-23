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
    selectedNetwork: getEntity(state, "network", state.items.selectedNetwork)
  }
}

function mapDispatchToProps(dispatch){
  return {
    ...bindActionCreators(items, dispatch)
  }
}

class NetworkScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', '')
    };
  }

  componentWillUnmout(){
    this.props.removeItem("network");
  }

  render() {
    let network = this.props.selectedNetwork;
    return (
      <Screen>
        <ScrollView>
          <View style={theme.common.infoPanel}>
            <Text>
              UUID: <Text>{network.meta.id}</Text>
            </Text>
          </View>
          <List
            id={network.meta.id}
            type="network"
            childType="device"
            renderItem={({item}) =>
              <ListRow
                selectedName="selectedDevice"
                navigateTo="DeviceScreen"
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

export default connect(mapStateToProps, mapDispatchToProps)(NetworkScreen);
