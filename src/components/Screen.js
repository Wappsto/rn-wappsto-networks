import React from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import KeyboardAvoidingView from './KeyboardAvoidingView';
import FocusAwareStatusBar from './FocusAwareStatusBar';
import { streamStatus } from 'wappsto-redux';
import { useTranslation, CapitalizeFirst } from '../translations';
import theme from '../theme/themeExport';
import Text from './Text';
import useCurrentPage from '../hooks/useCurrentPage';
import useConnected from '../hooks/useConnected';
import useStreamStatus from '../hooks/useStreamStatus';
import { config } from '../configureWappstoRedux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.variables.appBgColor,
  },
  tryAgainBtn: {
    textDecorationLine: 'underline',
  },
});

const Screen = React.memo(({ style, children }) => {
  const headerHeight = useHeaderHeight();
  const { t } = useTranslation();
  const { stream, reconnectStream, message } = useStreamStatus();
  const connected = useConnected();
  useCurrentPage();
  const showStream =
    connected && stream && stream.status !== 2 && config.stream && !config.hideStreamNotification;

  return (
    <SafeAreaView style={[styles.container, style]}>
      <FocusAwareStatusBar
        backgroundColor={theme.variables.statusBarBgDark}
        barStyle={theme.variables.statusBarColorLight}
      />
      {!connected && (
        <Text
          style={[theme.common.toastFullWidth, theme.common.warningPanel]}
          content={CapitalizeFirst(t('error:internetConnectionLost'))}
        />
      )}
      {showStream && (
        <View style={[theme.common.toastFullWidth, theme.common.warningPanel]}>
          <Text content={message} />
          {(stream.status === streamStatus.LOST || stream.status === streamStatus.CLOSED) && (
            <TouchableOpacity onPress={reconnectStream}>
              <Text
                color="primary"
                content={CapitalizeFirst(t('tryAgain'))}
                style={styles.tryAgainBtn}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      <KeyboardAvoidingView offset={headerHeight}>{children}</KeyboardAvoidingView>
    </SafeAreaView>
  );
});

export default Screen;
