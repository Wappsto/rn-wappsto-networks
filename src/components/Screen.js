import React from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { status } from 'wappsto-redux/actions/stream';
import { useTranslation, CapitalizeFirst } from '../translations';
import theme from '../theme/themeExport';
import Text from './Text';
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
        <Text
          style={[theme.common.toastFullWidth, theme.common.warningPanel]}
          content={CapitalizeFirst(t('error:internetConnectionLost'))}
        />
      )}
      {showStream && (
        <View style={[theme.common.toastFullWidth, theme.common.warningPanel]}>
          <Text
            content={message}
          />
          {(stream.status === status.LOST || stream.status === status.CLOSED) && (
            <TouchableOpacity onPress={reconnectStream}>
              <Text
                color='primary'
                content={CapitalizeFirst(t('tryAgain'))} style={{textDecorationLine: 'underline'}}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {children}
    </View>
  );
});

export default Screen;
