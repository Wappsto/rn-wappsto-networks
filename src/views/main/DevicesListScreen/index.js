import React, { useCallback, useEffect } from 'react';
import { Text as RNText, StyleSheet, View } from 'react-native';
import Button from '../../../components/Button';
import List from '../../../components/List';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import DeviceItem from './DeviceItem';
import AddNetwork from './AddNetwork';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setItem } from 'wappsto-redux';
import ItemDeleteIndicator from '../../../components/ItemDeleteIndicator';
import MenuButton from '../../../components/MenuButton';
import NAV from '../../../enums/navigation';
import useAddNetworkStream from '../../../hooks/useAddNetworkStream';
import useAppStateStream from '../../../hooks/useAppStateStream';
import useDeleteItemRequest from '../../../hooks/useDeleteItemRequest';
import theme from '../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../translations';
import { iotNetworkListAdd, iotNetworkListRemove, selectedNetworkName } from '../../../util/params';

const styles = StyleSheet.create({
  listHeader: {
    paddingLeft: 10,
    paddingRight: 5,
  },
  textRow: {
    flex: 1,
  },
  listItem: {
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderBottomWidth: 3,
  },
  circle: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginRight: 6,
  },
  online: {
    backgroundColor: '#32CD32',
  },
  offline: {
    backgroundColor: '#999',
  },
});

const ItemHeader = React.memo(({ network }) => {
  const navigation = useNavigation();
  const online =
    network && network.meta && network.meta.connection && network.meta.connection.online;

  const dispatch = useDispatch();

  const navigate = useCallback(() => {
    dispatch(setItem(selectedNetworkName, network.meta.id));
    navigation.navigate(NAV.MAIN.NETWORK);
  }, [dispatch, navigation, network.meta.id]);

  return (
    <View style={[theme.common.row, styles.listHeader]}>
      {network.meta.connection && (
        <View style={[styles.circle, online ? styles.online : styles.offline]} />
      )}
      <RNText numberOfLines={1} ellipsizeMode="tail" style={styles.textRow}>
        {network.meta.name_by_user && <Text bold content={network.meta.name_by_user} />}
        <Text color="secondary" content={' [' + network.meta.id.slice(0, 9) + '... ]'} />
      </RNText>

      <Button icon="more-vertical" type="link" onPress={navigate} />
    </View>
  );
});
ItemHeader.displayName = 'ItemHeader';

const ItemContent = React.memo(({ network }) => {
  const { t } = useTranslation();
  if (network.device.length === 0) {
    return (
      <Text
        size="p"
        color="secondary"
        align="center"
        content={CapitalizeFirst(t('noData'))}
        style={theme.common.spaceAround}
      />
    );
  }
  return network.device.map(id => <DeviceItem key={id} id={id} />);
});
ItemContent.displayName = 'ItemContent';

const ListItem = React.memo(({ network }) => {
  const request = useDeleteItemRequest(network);
  if (!network.meta || network.meta.error) {
    return null;
  }
  return (
    <View style={styles.listItem}>
      <ItemDeleteIndicator request={request} />
      <ItemHeader network={network} />
      <ItemContent network={network} />
    </View>
  );
});
ListItem.displayName = 'ListItem';

const query = {
  expand: 1,
  limit: 4,
  order_by: 'this_meta.created',
  from_last: true,
  verbose: true,
  method: 'retrieve',
};
const DevicesListScreen = React.memo(() => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  useAppStateStream();
  useAddNetworkStream(iotNetworkListAdd, iotNetworkListRemove);

  useEffect(() => {
    navigation.setOptions({
      title: CapitalizeFirst(t('pageTitle.main')),
      headerLeft: () => <MenuButton />,
      headerRight: () => <AddNetwork />,
    });
  }, [navigation, t]);

  return (
    <Screen>
      <List
        url="/network"
        query={query}
        addItemName={iotNetworkListAdd}
        removeItemName={iotNetworkListRemove}
        showAddNetworkButton
        renderItem={({ item: network }) => <ListItem network={network} />}
      />
    </Screen>
  );
});

DevicesListScreen.displayName = 'DevicesListScreen';
export default DevicesListScreen;
