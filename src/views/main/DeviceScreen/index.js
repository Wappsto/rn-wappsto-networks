import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Screen from '@/components/Screen';
import List from '@/components/List';
import Value from './Value';
import { removeItem } from 'wappsto-redux/actions/items';
import { makeEntitySelector } from 'wappsto-redux/selectors/entities';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import theme from '@/theme/themeExport';
import { selectedDeviceName } from '@/util/params';
import { getServiceVersion } from 'wappsto-redux/util/helpers';
import DeviceDetails from './DeviceDetails';

const DeviceScreen = React.memo(({ navigation }) => {
  const dispatch = useDispatch();
  const getItem = useMemo(makeItemSelector, []);
  const selectedDevice = useSelector(state => getItem(state, selectedDeviceName));
  const getEntity = useMemo(makeEntitySelector, []);
  const device = useSelector(state => getEntity(state, 'device',selectedDevice));
  const query = useMemo(() => ({
    expand: 3,
    order_by: getServiceVersion('value') === '' ? 'created' : 'meta.created',
    from_last: true,
    verbose: true
  }), []);

  useEffect(() => {
    return () => {
      dispatch(removeItem(selectedDeviceName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(!device || !device.meta || !device.meta.id){
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

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
