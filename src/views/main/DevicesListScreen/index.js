import React, { useMemo, useCallback } from 'react';
import { Text as RNtext, View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
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
import useDeleteItem from '../../../hooks/useDeleteItem';
import useDeleteItemRequest from '../../../hooks/useDeleteItemRequest';

const styles = StyleSheet.create({
  listHeader: {
    backgroundColor: theme.variables.appBg,
    paddingLeft: 10,
    paddingRight: 5
  },
  listItem: {
    marginBottom:20
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
        <Button
          type='outline'
          color='alert'
          onPress={showDeleteConfirmation}
          request={request}
          text={CapitalizeFirst(t('delete'))}
          icon='trash-2'
        />
      </Popup>
    );
  }, [network]);
  return <PopupButton buttonStyle={style} icon='info'>{content}</PopupButton>;
});

const ItemHeader = React.memo(({ network }) => {
  const { t } = useTranslation();
  return (
    <View style={[theme.common.row,styles.listHeader]}>
      <RNtext numberOfLines={1} ellipsizeMode='tail' style={{flex: 1}}>
        { isPrototype(network) &&
          <Text color='secondary' content={'(' + CapitalizeEach(t('prototype')) + ') '}/>
        }
        { network.name &&
          <Text style={{fontWeight:'bold'}} content={network.name + ' '}/>
        }
        <Text color='secondary' content={network.meta.id}/>
      </RNtext>
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
  return (
    <View style={styles.listItem}>
      <ItemDeleteIndicator request={request} />
      <ItemHeader network={network}/>
      <ItemContent network={network} navigation={navigation} />
    </View>
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
