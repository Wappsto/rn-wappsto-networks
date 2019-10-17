import React from 'react';
import {View, Text} from 'react-native';

import Screen from '../../components/Screen';

import RequestError from '../../components/RequestError';
import MenuButton from '../../components/MenuButton';

import {Account, connect} from '../../wappsto-components/Account';

import theme from '../../theme/themeExport';
import i18n, {CapitalizeFirst, CapitalizeEach} from '../../translations/i18n';

class AccountScreen extends Account {
  static navigationOptions = ({navigation}) => {
    return {
      ...theme.headerStyle,
      title: CapitalizeEach(i18n.t('pageTitle.account')),
      headerLeft: <MenuButton navigation={navigation} />,
    };
  };

  render() {
    let request = this.props.request;
    let user = this.props.user;
    return (
      <Screen>
        {user ? (
          <View style={theme.common.spaceAround}>
            <Text>
              {CapitalizeFirst(i18n.t('userDescription.uuid'))}: {user.meta.id}
            </Text>
            <Text>
              {CapitalizeFirst(i18n.t('userDescription.firstName'))}:{' '}
              {user.first_name}
            </Text>
            <Text>
              {CapitalizeFirst(i18n.t('userDescription.lastName'))}:{' '}
              {user.last_name}
            </Text>
            <Text>
              {CapitalizeFirst(i18n.t('userDescription.nickname'))}:{' '}
              {user.nickname}
            </Text>
            <Text>
              {CapitalizeFirst(i18n.t('userDescription.email'))}: {user.email}
            </Text>
            <Text>
              {CapitalizeFirst(i18n.t('userDescription.phone'))}: {user.phone}
            </Text>
          </View>
        ) : request && request.status === 'pending' ? (
          <Text>{CapitalizeFirst(i18n.t('statusMessage.loading'))}</Text>
        ) : null}
        <RequestError error={request} />
      </Screen>
    );
  }
}

export default connect(AccountScreen);
