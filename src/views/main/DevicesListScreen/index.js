import React, { useMemo, useCallback } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Screen from '../../../components/Screen';
import MenuButton from '../../../components/MenuButton';
import List from '../../../components/List';
import DeviceItem from './DeviceItem';
import AddNetwork from './AddNetwork';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeEach, CapitalizeFirst } from '../../../translations';
import { iotNetworkListAdd, iotNetworkListRemove } from '../../../util/params';
import { isPrototype } from 'wappsto-blanket/util';
import { getServiceVersion } from 'wappsto-redux/util/helpers';
import useAppStateStream from '../../../hooks/useAppStateStream';
import useAddNetworkStream from '../../../hooks/useAddNetworkStream';
import Icon from 'react-native-vector-icons/Feather';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import ConfirmationPopup from '../../../components/ConfirmationPopup';
import ItemDeleteIndicator from '../../../components/ItemDeleteIndicator';
import RequestError from '../../../components/RequestError';
import useDeleteItem from '../../../hooks/useDeleteItem';
import useDeleteItemRequest from '../../../hooks/useDeleteItemRequest';

const NetworkDetails = React.memo(({ network, style }) => {
  const content = useCallback((visible, hide) => {
    const { t } = useTranslation();
    const { deleteItem, request, confirmVisible, showDeleteConfirmation, hideDeleteConfirmation } = useDeleteItem(network);
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <ConfirmationPopup
          title={CapitalizeEach(t('deleteNetwork.title'))}
          description={CapitalizeFirst(t('deleteNetwork.description'))}
          visible={confirmVisible}
          accept={deleteItem}
          reject={hideDeleteConfirmation}
          acceptStyle={theme.common.errorPanel} />
        <Text style={theme.common.H5}>
          {CapitalizeEach(t('valueInfoHeader'))}
        </Text>
        <Text>
          {CapitalizeFirst(t('networkDescription.name'))}: {network.name}
        </Text>
        <Text>
          {CapitalizeFirst(t('networkDescription.uuid'))}: {network.meta.id}
        </Text>
        <RequestError request={request} />
        <TouchableOpacity onPress={showDeleteConfirmation} style={[theme.common.button, theme.common.errorPanel]}>
          <ItemDeleteIndicator request={request} />
          <Text style={theme.common.btnText}>
            <Icon name='trash-2' size={20} />
            {CapitalizeFirst(t('delete'))}
          </Text>
        </TouchableOpacity>
      </Popup>
    );
  }, [network]);
  return <PopupButton buttonStyle={style} icon='info'>{content}</PopupButton>;
});

const ItemHeader = React.memo(({ network }) => {
  const { t } = useTranslation();
  return (
    <View style={theme.common.row}>
      <Text style={[theme.common.listHeader, {flex:1}]}>
        { isPrototype(network) && <Text>({CapitalizeEach(t('prototype'))}) </Text> }
        { network.name ?
          <>
            <Text style={theme.common.H5}>{network.name}</Text>{'\n'}
            <Text>{network.meta.id}</Text>
          </>
        :
          <Text>{network.meta.id}</Text>
        }
      </Text>
      <NetworkDetails network={network}/>
    </View>
  )
});

const ItemContent = React.memo(({ network, navigation }) => {
  const { t } = useTranslation();
  if(network.device.length === 0){
    return (
      <Text style={[theme.common.infoText, theme.common.secondary]}>
        {CapitalizeFirst(t('infoMessage.networkIsEmpty'))}
      </Text>
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
  return (
    <>
      <View>
        <ItemDeleteIndicator request={request} />
        <ItemHeader network={network}/>
        <ItemContent network={network} navigation={navigation} />
      </View>
      <View style={theme.common.listFooter} />
    </>
  )
});

const DevicesListScreen = React.memo(({ navigation }) => {
  const query = useMemo(() => ({
    expand: 1,
    limit: 10,
    order_by: getServiceVersion('network') === '' ? 'created' : 'meta.created',
    from_last: true,
    verbose: true
  }), []);

  useAppStateStream();
  useAddNetworkStream(iotNetworkListAdd, iotNetworkListRemove);

  return (
    <Screen>
      <List
        url='/network'
        query={query}
        addItemName={iotNetworkListAdd}
        removeItemName={iotNetworkListRemove}
        page={navigation.state.routeName}
        renderItem={({ item: network }) => <ListItem network={network} navigation={navigation} />}
      />
    </Screen>
  );
});

DevicesListScreen.navigationOptions = ({ navigation, screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(t('pageTitle.main')),
    headerLeft: <MenuButton navigation={navigation} />,
    headerRight: <AddNetwork navigation={navigation} />,
  };
};

export default DevicesListScreen;
