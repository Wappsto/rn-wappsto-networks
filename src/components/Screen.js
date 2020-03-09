import React from 'react';
import {Text, View, TouchableOpacity, StatusBar} from 'react-native';
import { useSafeArea} from 'react-native-safe-area-context';
import { status } from 'wappsto-redux/actions/stream';
import { useTranslation, CapitalizeFirst } from '../translations';
import theme from '../theme/themeExport';
import useCurrentPage from '../hooks/useCurrentPage';
import useConnected from '../hooks/useConnected';
import useStreamStatus from '../hooks/useStreamStatus';

const Screen = React.memo(({ style, children }) => {
  const { t } = useTranslation();
  const { stream, reconnectStream, message } = useStreamStatus();
  const connected = useConnected();
  useCurrentPage();

  StatusBar.setBarStyle( 'light-content',true);
  const insets = useSafeArea();

  const showStream = connected && stream && stream.status !== 2;
  return (
    <View style={{flex:1}}>
      <StatusBar backgroundColor={theme.variables.primary} barStyle='light-content' />
      {!connected && (
        <Text style={[theme.common.toastFullWidth, theme.common.warningPanel]}>
          {CapitalizeFirst(t('error:internetConnectionLost'))}
        </Text>
      )}
      {showStream && (
        <View style={[theme.common.toastFullWidth, theme.common.warningPanel]}>
          <Text>{message}</Text>
          {(stream.status === status.LOST || stream.status === status.CLOSED) && (
            <TouchableOpacity onPress={reconnectStream}>
              <Text style={theme.common.actionText}>
                {CapitalizeFirst(t('tryAgain'))}
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
