import React, {Component} from 'react';

import {Text} from 'react-native';
import Screen from '../../../components/Screen';
import MenuButton from '../../../components/MenuButton';
import List from '../../../components/List';
import DeviceSection from './DeviceSection';
import AddNetworkButton from './AddNetworkButton';

import theme from '../../../theme/themeExport';
import i18n, {
  CapitalizeEach,
  CapitalizeFirst,
} from '../../../translations/i18n';

const query = {
  expand: 1,
  limit: 10,
};

class DevicesListScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      ...theme.headerStyle,
      title: CapitalizeEach(i18n.t('pageTitle.main')),
      headerLeft: <MenuButton navigation={navigation} />,
      headerRight: <AddNetworkButton navigation={navigation} />,
    };
  };
  render() {
    return (
      <Screen>
        <List
          refreshItem="refreshList"
          type="network"
          query={query}
          renderSectionHeader={({section: {title}}) => (
            <Text style={theme.common.listHeader}>{title}</Text>
          )}
          renderItem={({item}) => {
            if (item.device.length === 0) {
              return (
                <Text style={[theme.common.infoText, theme.common.secondary]}>
                  {CapitalizeFirst(i18n.t('infoMessage.networkIsEmpty'))}
                </Text>
              );
            }
            return item.device.map(id => (
              <DeviceSection
                key={id}
                id={id}
                navigation={this.props.navigation}
              />
            ));
          }}
        />
      </Screen>
    );
  }
}

export default DevicesListScreen;
