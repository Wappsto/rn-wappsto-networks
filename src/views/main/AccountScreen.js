import React, { useMemo } from 'react';
import { View } from 'react-native';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import RequestError from '../../components/RequestError';
import theme from '../../theme/themeExport';
import MenuButton from '../../components/MenuButton';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../translations';
import { useSelector } from 'react-redux';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { getUserData } from 'wappsto-redux/selectors/entities';
import { makeRequestSelector } from 'wappsto-redux/selectors/request';
import { userGetRequest } from '../../util/params';

const AccountScreen = React.memo(() => {
  const { t } = useTranslation();
  const getRequest = useMemo(makeRequestSelector, []);
  const getItem = useMemo(makeItemSelector, []);
  const requestId = useSelector(state => getItem(state, userGetRequest));
  const request = useSelector(state => getRequest(state, requestId));
  const user = useSelector(getUserData);

  return (
    <Screen>
      {user ? (
        <View style={theme.common.contentContainer}>
          <Text
            content={CapitalizeFirst(t('accountDetails.uuid')) + ': ' + user.meta.id}
          />
          <Text
            content={CapitalizeFirst(t('accountDetails.firstName')) + ': ' + user.first_name}
          />
          <Text
            content={CapitalizeFirst(t('accountDetails.lastName')) + ': ' + user.last_name}
          />
          <Text
            content=
            {CapitalizeFirst(t('accountDetails.nickname')) + ': ' + user.nickname}
          />
          <Text
            content={CapitalizeFirst(t('accountDetails.email')) + ': ' + user.email}
          />
          <Text
            content={CapitalizeFirst(t('accountDetails.phone')) + ': ' + user.phone}
          />
        </View>
      ) : request && request.status === 'pending' ? (
        <Text
          content={CapitalizeFirst(t('statusMessage.loading'))}
        />
      ) : null}
      <RequestError request={request} />
    </Screen>
  );
});

AccountScreen.navigationOptions = ({ navigation, screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(t('pageTitle.account')),
    headerLeft: <MenuButton navigation={navigation} />,
  };
};

export default AccountScreen;
