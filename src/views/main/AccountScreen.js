import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import Screen from '../../components/Screen';
import RequestError from '../../components/RequestError';
import theme from '../../theme/themeExport';
import MenuButton from '../../components/MenuButton';
import i18n, { CapitalizeFirst, CapitalizeEach } from '../../translations';
import { useSelector } from 'react-redux';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { getUserData } from 'wappsto-redux/selectors/entities';
import { makeRequestSelector } from 'wappsto-redux/selectors/request';
import { userGetRequest } from '../../util/params';

const AccountScreen = React.memo(() => {
  const getRequest = useMemo(makeRequestSelector, []);
  const getItem = useMemo(makeItemSelector, []);
  const requestId = useSelector(state => getItem(state, userGetRequest));
  const request = useSelector(state => getRequest(state, requestId));
  const user = useSelector(getUserData);

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
      <RequestError request={request} />
    </Screen>
  );
});

AccountScreen.navigationOptions = ({navigation}) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(i18n.t('pageTitle.account')),
    headerLeft: <MenuButton navigation={navigation} />,
  };
};

export default AccountScreen;
