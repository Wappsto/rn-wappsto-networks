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
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import ConfirmationPopup from '../../../components/ConfirmationPopup';
import ItemDeleteIndicator from '../../../components/ItemDeleteIndicator';
import useDeleteItem from '../../../hooks/useDeleteItem';
import useDeleteItemRequest from '../../../hooks/useDeleteItemRequest';
import RequestError from '../../../components/RequestError';
import { useSelector } from 'react-redux';
import { makeItemSelector } from 'wappsto-redux/selectors/items';

const styles = StyleSheet.create({
  listHeader: {
    backgroundColor: theme.variables.appBg,
    paddingLeft: 10,
    paddingRight: 5
  },
  textRow:{
    flex: 1
  },
  listItem: {
    marginBottom:20
  },
  circle: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginTop: 3,
    marginRight: 6
  },
  online: {
    backgroundColor: '#32CD32'
  },
  offline: {
    backgroundColor: '#bbb'
  }
});

const NetworkDetails = React.memo(({ network, style }) => {
  const content = useCallback((visible, hide) => {
    const { t } = useTranslation();
    const { deleteItem, request, confirmVisible, showDeleteConfirmation, hideDeleteConfirmation } = useDeleteItem(network);
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <ConfirmationPopup
          visible={confirmVisible}
          accept={deleteItem}
          reject={hideDeleteConfirmation}
        />
        <Text size='h4' content={network.name}/>
        <Text content={CapitalizeEach(t('networkDescription.uuid')) + ': ' + network.meta.id}/>
        <RequestError request={request} />
        <Button
          type='outlined'
          color='alert'
          onPress={showDeleteConfirmation}
          request={request}
          disabled={request && request.status === 'pending'}
          text={CapitalizeFirst(t('genericButton.delete'))}
          icon='trash-2'
        />
      </Popup>
    );
  }, [network]);
  return <PopupButton buttonStyle={style} icon='info'>{content}</PopupButton>;
});

const ItemHeader = React.memo(({ network }) => {
  const { t } = useTranslation();
  const isPrototypeNetwork = isPrototype(network);
  const online = network && network.meta && network.meta.connection && network.meta.connection.online;
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
        <Text color='secondary' content={network.meta.id}/>
      </RNText>
      <NetworkDetails network={network}/>
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
      <ItemHeader network={network}/>
      <ItemContent network={network} navigation={navigation} />
    </View>
  )
});

const query = {
  expand: 1,
  limit: 10,
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
    headerRight: () => <AddNetwork navigation={navigation} />,
  };
};

export default DevicesListScreen;
