import React, {Component} from 'react';

import Screen from '../../../components/Screen';
import MenuButton from '../../../components/MenuButton';
import List from '../../../components/List';
import ListRow from './ListRow';
import AddNetworkButton from './AddNetworkButton';

import theme from '../../../theme/themeExport';
import i18n, {CapitalizeEach} from '../../../translations/i18n';

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
          type="device"
          renderItem={({item}) => (
            <ListRow
              selectedName="selectedDevice"
              navigateTo="DeviceScreen"
              item={item}
              childName="value"
              navigation={this.props.navigation}
            />
          )}
        />
      </Screen>
    );
  }
}

export default DevicesListScreen;
