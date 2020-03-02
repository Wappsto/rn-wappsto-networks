import React, { useMemo } from 'react';
import Screen from 'src/components/Screen';
import List from 'src/components/List';
import Value from './Value';
import theme from 'src/theme/themeExport';
import { selectedDeviceName } from 'src/util/params';
import { getServiceVersion } from 'wappsto-redux/util/helpers';
import DeviceDetails from './DeviceDetails';
import useUnmountRemoveItem from 'src/hooks/useUnmountRemoveItem';
import useUndefinedBack from 'src/hooks/useUndefinedBack';
import useGetItemEntity from 'src/hooks/useGetItemEntity';

const DeviceScreen = React.memo(({ navigation }) => {
  const device = useGetItemEntity(selectedDeviceName, 'device');
  const query = useMemo(() => ({
    expand: 3,
    order_by: getServiceVersion('value') === '' ? 'created' : 'meta.created',
    verbose: true
  }), []);

  useUnmountRemoveItem(selectedDeviceName);
  useUndefinedBack(device, navigation);

  if(!device || !device.meta || !device.meta.id){
    return null;
  }
  const url = '/device/' + device.meta.id + '/value';
  return (
    <Screen>
      <List
        name={url}
        url={url}
        query={query}
        renderItem={({item}) => <Value item={item} />}
        page={navigation.state.routeName}
      />
    </Screen>
  );
});

DeviceScreen.navigationOptions = ({navigation}) => {

  return {
    ...theme.headerStyle,
    title: navigation.getParam('title', ''),
    headerRight: <DeviceDetails navigation={navigation} />
  };
};

export default DeviceScreen;
