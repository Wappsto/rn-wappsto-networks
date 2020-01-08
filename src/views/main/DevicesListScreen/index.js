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
import { openStream, closeStream } from 'wappsto-redux/actions/stream';
import { removeItem } from 'wappsto-redux/actions/items';
import theme from '../../../theme/themeExport';
import i18n, { CapitalizeEach, CapitalizeFirst } from '../../../translations';
import { iotNetworkListAdd } from '../../../util/params';

const query = {
  expand: 1,
  limit: 10,
  order_by: 'meta.created',
  from_last: true,
  verbose: true
};
const DevicesListScreen = React.memo(({ navigation }) => {
  const dispatch = useDispatch();
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector(state => getStream(state, config.stream && config.stream.name));
  const [ appState, setAppState ] = useState(AppState.currentState);
  const getItem = useMemo(makeItemSelector, []);
  const addToList = useSelector(state => getItem(state, iotNetworkListAdd));

  const _handleNetworkAdd = (message) => {
    try{
      const json = JSON.parse(message.data);
      if(json.data.meta.type === 'network' && json.event === 'create'){
        addToList(json.data.meta.id);
      }
    } catch(e){

    }
  }

  const startStream = () => {
    if(config.stream){
      dispatch(openStream(config.stream, null, { endPoint: 'websocket', version: '2.0' }));
    }
  }

  const endStream = () => {
    if(config.stream){
      dispatch(closeStream(config.stream.name));
    }
  }

  const _handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active' && stream && stream.ws && stream.ws.readyState === stream.ws.CLOSED) {
      startStream();
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
  }, [stream]);

  // subscribe to stream
  useEffect(() => {
    startStream();
    return () => {
      endStream();
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
  }, [stream]);

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
        renderSectionHeader={({section: {title: network}}) => {
          return (
            <Text style={theme.common.listHeader}>
              { network.meta.iot ? <Text>({CapitalizeEach(i18n.t('prototype'))}) </Text> : null }
              { network.name ?
                <Text style={theme.common.H5}>{network.name} </Text>
              :
                <Text>{network.meta.id.slice(0, 4) + ' ... ' + network.meta.id.slice(-4)}</Text>
              }
            </Text>
          );
        }}
        renderSectionFooter={() => (
          <View style={theme.common.listFooter} />
        )}
        renderItem={({item: { device }}) => {
          if (device.length === 0) {
            return (
              <Text style={[theme.common.infoText, theme.common.secondary]}>
                {CapitalizeFirst(i18n.t('infoMessage.networkIsEmpty'))}
              </Text>
            );
          }
          return device.map(id => (
            <DeviceItem
              key={id}
              id={id}
              navigation={navigation}
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
