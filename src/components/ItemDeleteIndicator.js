import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import theme from '../theme/themeExport';
import color from 'color';

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 99,
    backgroundColor: color(theme.variables.appBgColor).alpha(0.4).string(),
  },
});

const ItemDeleteIndicator = React.memo(({ request }) => {
  if (request && request.status === 'pending') {
    return <ActivityIndicator style={styles.spinner} color={theme.variables.spinnerColor} />;
  }
  return null;
});

ItemDeleteIndicator.displayName = 'ItemDeleteIndicator';
export default ItemDeleteIndicator;
