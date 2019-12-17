import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, Text } from 'react-native';
import Screen from '../../../components/Screen';
import MenuButton from '../../../components/MenuButton';
import List from '../../../components/List';
import DeviceSection from './DeviceSection';
import AddNetworkButton from './AddNetworkButton';
import { config } from '../../../configureWappstoRedux';
import { makeStreamSelector } from 'wappsto-redux/selectors/stream';
import { openStream, closeStream } from 'wappsto-redux/actions/stream';
import theme from '../../../theme/themeExport';
import i18n, { CapitalizeEach, CapitalizeFirst } from '../../../translations';
import { iotNetworkListAdd } from '../../../util/params';

const query = {
  expand: 1,
  limit: 10,
};
const DevicesListScreen = React.memo(({ navigation }) => {
  const dispatch = useDispatch();
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector(state => getStream(state, config.stream && config.stream.name));
  const [ appState, setAppState ] = useState(AppState.currentState);

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

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  useEffect(() => {
    startStream();
    return () => {
      endStream();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen>
      <List
        url='/network'
        query={query}
        addItemName={iotNetworkListAdd}
        renderSectionHeader={({section: {title}}) => {
          if(title.name){
              return (<Text style={theme.common.listHeader}><Text style={{ fontWeight: '600' }}>{title.name}</Text> - {title.id}</Text>);
          }
          return (<Text style={theme.common.listHeader}>{title.id}</Text>);
        }}
        renderItem={({item}) => {
          if (item.device.length === 0) {
            return (
              <Text style={[theme.common.infoText, theme.common.secondary]}>
                {CapitalizeFirst(i18n.t('infoMessage.networkIsEmpty'))}
              </Text>
            );
          }
          return item.device.map(id => (
            <DeviceSection
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
