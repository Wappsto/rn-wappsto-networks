import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, Text, View } from 'react-native';
import Screen from '../../../components/Screen';
import MenuButton from '../../../components/MenuButton';
import List from '../../../components/List';
import DeviceItem from './DeviceItem';
import AddNetworkButton from './AddNetworkButton';
import { config } from '../../../configureWappstoRedux';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { makeStreamSelector } from 'wappsto-redux/selectors/stream';
import { removeItem } from 'wappsto-redux/actions/items';
import theme from '../../../theme/themeExport';
import i18n, { CapitalizeEach, CapitalizeFirst } from '../../../translations';
import { iotNetworkListAdd } from '../../../util/params';
import { isPrototype, startStream, endStream } from '../../../util/helpers';
import { getServiceVersion } from 'wappsto-redux/util/helpers';

const DevicesListScreen = React.memo(({ navigation }) => {
  const dispatch = useDispatch();
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector(state => getStream(state, config.stream && config.stream.name));
  const [ appState, setAppState ] = useState(AppState.currentState);
  const getItem = useMemo(makeItemSelector, []);
  const addToList = useSelector(state => getItem(state, iotNetworkListAdd));
  const query = useMemo(() => ({
    expand: 1,
    limit: 10,
    order_by: getServiceVersion('network') === '' ? 'created' : 'meta.created',
    from_last: true,
    verbose: true
  }), []);

  const _handleNetworkAdd = (event) => {
    try{
      let data = JSON.parse(event.data);
      if (data.constructor !== Array) {
        data = [data];
      }
      data.forEach(message => {
        if(message.meta_object.type === 'network' && message.event === 'create'){
          addToList(message.meta_object.id);
        }
      })
    } catch(e){

    }
  }

  const _handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active' && stream && stream.ws && stream.ws.readyState === stream.ws.CLOSED) {
      startStream(dispatch);
    }
    setAppState(nextAppState);
  };

  // handle app status change
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, stream]);

  // subscribe to stream
  useEffect(() => {
    startStream(dispatch);
    return () => {
      endStream(dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // add network from stream
  useEffect(() => {
    if(stream && stream.ws && addToList){
      stream.ws.addEventListener('message', _handleNetworkAdd);
    }
    return () => {
      if(stream && stream.ws && addToList){
        stream.ws.removeEventListener('message', _handleNetworkAdd);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, addToList]);

  const onRefresh = useCallback((items) => {
    items.forEach(network => {
      network.device.forEach(deviceId => {
        dispatch(removeItem('/device/' + deviceId + '/value_ids'));
        dispatch(removeItem('/device/' + deviceId + '/value_fetched'));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen>
      <List
        url='/network'
        query={query}
        addItemName={iotNetworkListAdd}
        onRefresh={onRefresh}
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
    headerRight: <AddNetworkButton navigation={navigation} />,
  };
};

export default DevicesListScreen;
