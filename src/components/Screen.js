import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Text, View, TouchableOpacity, StatusBar} from 'react-native';
import { useSafeArea} from 'react-native-safe-area-context';
import { config } from '../configureWappstoRedux';
import { makeStreamSelector } from 'wappsto-redux/selectors/stream';
import { status, steps } from 'wappsto-redux/actions/stream';
import NetInfo from '@react-native-community/netinfo';
import i18n, { CapitalizeFirst } from '../translations';
import theme from '../theme/themeExport';
import { startStream } from '../util/helpers';

const emptyObject = {};
const Screen = React.memo(({ style, children }) => {
  const dispatch = useDispatch();
  const [ connected, setConnected] = useState(true);
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector(state => {
    if(!config.stream){
      return emptyObject;
    }
    return getStream(state, config.stream.name);
  });

  StatusBar.setBarStyle( 'light-content',true);

  useEffect(() => {
    NetInfo.isConnected.removeEventListener('connectionChange', setConnected);
    return () => {
      NetInfo.isConnected.removeEventListener('connectionChange', setConnected);
    }
  }, []);

  const reconnectStream = useCallback(() => {
    startStream(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  const getStreamMessage = (mStream = {}) => {
    let mStatus = '',
      mStep;
    switch (mStream.status) {
      case status.CONNECTING:
      case status.RECONNECTING:
        mStatus =
          mStream.status === status.CONNECTING
            ? CapitalizeFirst(i18n.t('statusMessage.connecting'))
            : CapitalizeFirst(i18n.t('statusMessage.reconnecting'));
        switch (mStream.step) {
          case steps.CONNECTING.GET_STREAM:
            mStep = CapitalizeFirst(i18n.t('statusMessage.gettingStream'));
            break;
          case steps.CONNECTING.CREATE_STREAM:
            mStep = CapitalizeFirst(i18n.t('statusMessage.creatingStream'));
            break;
          case steps.CONNECTING.UPDATE_STREAM:
            mStep = CapitalizeFirst(i18n.t('statusMessage.updatingStream'));
            break;
          case steps.CONNECTING.OPENING_SOCKET:
          case steps.CONNECTING.WAITING:
            mStep = CapitalizeFirst(i18n.t('statusMessage.openingConnection'));
            break;
        }
        break;
      case status.OPEN:
        mStatus = CapitalizeFirst(i18n.t('statusMessage.streamOpen'));
        break;
      case status.CLOSED:
        mStatus = CapitalizeFirst(i18n.t('statusMessage.streamClosed'));
        if(mStream.code){
          mStep = CapitalizeFirst(i18n.t('error:stream.code.' + mStream.code));
        }
        break;
      case status.ERROR:
        mStatus = CapitalizeFirst(i18n.t('error:generic'));
        break;
      case status.LOST:
        mStatus = CapitalizeFirst(i18n.t('error:stream.connectionLost'));
        break;
    }
    let result = mStatus + (mStep ? '\n' + mStep : '');
    if (result) {
      return result;
    }
    return undefined;
  }
  const insets = useSafeArea();

  const showStream = connected && stream && stream.status !== 2;
  return (
    <View style={{flex:1}}>
      <StatusBar backgroundColor={theme.variables.primary} barStyle='light-content' />
      {!connected && (
        <Text style={[theme.common.toastFullWidth, theme.common.warningPanel]}>
          {CapitalizeFirst(i18n.t('error:internetConnectionLost'))}
        </Text>
      )}
      {showStream && (
        <View style={[theme.common.toastFullWidth, theme.common.warningPanel]}>
          <Text>{getStreamMessage(stream)}</Text>
          {(stream.status === status.LOST || stream.status === status.CLOSED) && (
            <TouchableOpacity onPress={reconnectStream}>
              <Text style={theme.common.actionText}>
                {CapitalizeFirst(i18n.t('tryAgain'))}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {children}
    </View>
  );
});

export default Screen;
