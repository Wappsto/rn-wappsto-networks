import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import ItemDeleteIndicator from '../../../components/ItemDeleteIndicator';
import List from '../../../components/List';
import Screen from '../../../components/Screen';
import useDeleteItemRequest from '../../../hooks/useDeleteItemRequest';
import useGetItemEntity from '../../../hooks/useGetItemEntity';
import useUndefinedBack from '../../../hooks/useUndefinedBack';
import useUnmountRemoveItem from '../../../hooks/useUnmountRemoveItem';
import { selectedDeviceName } from '../../../util/params';
import DeviceDetails from './DeviceDetails';
import DeviceLocation from './DeviceLocation';
import Value from './Value';

const DeviceScreen = React.memo(() => {
  const navigation = useNavigation();
  const device = useGetItemEntity(selectedDeviceName, 'device');
  const deleteRequest = useDeleteItemRequest(device);
  const query = useMemo(
    () => ({
      expand: 3,
      limit: 10,
      order_by: 'meta.created',
      verbose: true,
      method: 'retrieve',
    }),
    [],
  );

  navigation.setOptions({
    title: device.name_by_user || device.name,
    headerRight: () => <DeviceDetails />,
  });

  useUnmountRemoveItem(selectedDeviceName);
  useUndefinedBack(device, navigation);

  if (!device || !device.meta || !device.meta.id || device.meta.error) {
    return null;
  }
  const url = '/device/' + device.meta.id + '/value';
  return (
    <Screen>
      <ItemDeleteIndicator request={deleteRequest} />
      <List
        name={url}
        url={url}
        query={query}
        renderItem={({ item }) => <Value item={item} navigation={navigation} />}
        listHeaderComponent={device.meta.geo ? <DeviceLocation geo={device.meta.geo} /> : null}
      />
    </Screen>
  );
});

export default DeviceScreen;
