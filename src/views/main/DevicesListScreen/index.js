import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Screen from '@/components/Screen';
import MenuButton from '@/components/MenuButton';
import List from '@/components/List';
import DeviceItem from './DeviceItem';
import AddNetwork from './AddNetwork';
import theme from '@/theme/themeExport';
import i18n, { CapitalizeEach, CapitalizeFirst } from '@/translations';
import { iotNetworkListAdd, iotNetworkListRemove } from '@/util/params';
import { isPrototype } from 'wappsto-blanket/util';
import { getServiceVersion } from 'wappsto-redux/util/helpers';
import useAppStateStream from '@/hooks/useAppStateStream';
import useAddNetworkStream from '@/hooks/useAddNetworkStream';

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
        renderSectionHeader={({section: {title: network}}) => {
          return (
            <Text style={theme.common.listHeader}>
              { isPrototype(network) && <Text>({CapitalizeEach(i18n.t('prototype'))}) </Text> }
              { network.name ?
                <>
                  <Text style={theme.common.H5}>{network.name}</Text>{'\n'}
                  <Text>{network.meta.id}</Text>
                </>
              :
                <Text>{network.meta.id}</Text>
              }
            </Text>
          );
        }}
        renderSectionFooter={() => (
          <View style={theme.common.listFooter} />
        )}
        renderItem={({ item }) => {
          if (item.device.length === 0) {
            return (
              <Text style={[theme.common.infoText, theme.common.secondary]}>
                {CapitalizeFirst(i18n.t('infoMessage.networkIsEmpty'))}
              </Text>
            );
          }
          return item.device.map(id => (
            <DeviceItem
              key={id}
              id={id}
              navigation={navigation}
              isPrototype={isPrototype(item)}
            />
          ));
        }}
      />
    </Screen>
  );
});

DevicesListScreen.navigationOptions = ({ navigation }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(i18n.t('pageTitle.main')),
    headerLeft: <MenuButton navigation={navigation} />,
    headerRight: <AddNetwork navigation={navigation} />,
  };
};

export default DevicesListScreen;
