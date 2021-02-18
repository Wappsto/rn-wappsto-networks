import React, { useMemo, useCallback } from 'react';
import { Text as RNText, View, StyleSheet } from 'react-native';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Screen from '../../../components/Screen';
import MenuButton from '../../../components/MenuButton';
import List from '../../../components/List';
import DeviceItem from './DeviceItem';
import AddNetwork from './AddNetwork';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeEach, CapitalizeFirst } from '../../../translations';
import { iotNetworkListAdd, iotNetworkListRemove, iotNetworkAddFlow } from '../../../util/params';
import { isPrototype } from 'wappsto-blanket/util';
import { getServiceVersion } from 'wappsto-redux/util/helpers';
import useAppStateStream from '../../../hooks/useAppStateStream';
import useAddNetworkStream from '../../../hooks/useAddNetworkStream';
import ItemDeleteIndicator from '../../../components/ItemDeleteIndicator';
import useDeleteItemRequest from '../../../hooks/useDeleteItemRequest';
import { selectedNetworkName } from '../../../util/params';
import { useSelector, useDispatch } from 'react-redux';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { setItem } from 'wappsto-redux/actions/items';

const styles = StyleSheet.create({
  listHeader: {
    paddingLeft: 10,
    paddingRight: 5
  },
  textRow:{
    flex: 1
  },
  listItem: {
    paddingBottom:20,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderBottomWidth: 3,
  },
  circle: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginRight: 6
  },
  online: {
    backgroundColor: '#32CD32'
  },
  offline: {
    backgroundColor: '#999'
  }
});

const ItemHeader = React.memo(({ network, navigation}) => {
  const { t } = useTranslation();
  const isPrototypeNetwork = isPrototype(network);
  const online = network && network.meta && network.meta.connection && network.meta.connection.online;

  const dispatch = useDispatch();

  const navigate = useCallback(() => {
    dispatch(setItem(selectedNetworkName, network.meta.id));
    navigation.navigate('NetworkScreen', {
      title: network.name ? network.name : network.meta.id
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  return (
    <View style={[theme.common.row,styles.listHeader]}>
      { !isPrototypeNetwork &&
        <View style={[styles.circle, online ? styles.online : styles.offline ]} />
      }
      <RNText numberOfLines={1} ellipsizeMode='tail' style={styles.textRow}>
        { isPrototypeNetwork &&
          <Text color='secondary' content={'(' + CapitalizeEach(t('prototype')) + ') '}/>
        }
        { network.name &&
          <Text bold content={network.name + ' '}/>
        }
        <Text color='secondary' content={'[' + network.meta.id.slice(0, 9) + '... ]'}/>
      </RNText>

      <Button
        icon='more-vertical'
        type='link'
        onPress={navigate}/>
    </View>
  )
});

const ItemContent = React.memo(({ network, navigation }) => {
  const { t } = useTranslation();
  if(network.device.length === 0){
    return (
      <Text
        size='p'
        color='secondary'
        align='center'
        content={CapitalizeFirst(t('noData'))}
        style={theme.common.spaceAround}
      />
    )
  }
  return network.device.map(id => (
    <DeviceItem
      key={id}
      id={id}
      navigation={navigation}
      isPrototype={isPrototype(network)}
    />
  ));
});

const ListItem = React.memo(({ network, navigation }) => {
  const request = useDeleteItemRequest(network);
  if(!network.meta || network.meta.error){
    return null;
  }
  return (
    <View style={styles.listItem}>
      <ItemDeleteIndicator request={request} />
      <ItemHeader network={network} navigation={navigation} />
      <ItemContent network={network} navigation={navigation} />
    </View>
  )
});

const query = {
  expand: 1,
  limit: 4,
  order_by: getServiceVersion('network') === '' ? 'created' : 'meta.created',
  from_last: true,
  verbose: true
};
const DevicesListScreen = React.memo(({ navigation }) => {
  const getItem = useMemo(makeItemSelector, []);
  const showAddFlow = useSelector(state => getItem(state, iotNetworkAddFlow));

  useAppStateStream();
  useAddNetworkStream(iotNetworkListAdd, iotNetworkListRemove);

  return (
    <Screen>
      <List
        url='/network'
        query={query}
        addItemName={iotNetworkListAdd}
        removeItemName={iotNetworkListRemove}
        emptyAddFlow={showAddFlow}
        renderItem={({ item: network }) => <ListItem network={network} navigation={navigation} />}
      />
    </Screen>
  );
});

DevicesListScreen.navigationOptions = ({ navigation, t }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(t('pageTitle.main')),
    headerLeft: () => <MenuButton navigation={navigation} />,
    headerRight: () => <AddNetwork navigation={navigation} />
  };
};

export default DevicesListScreen;
