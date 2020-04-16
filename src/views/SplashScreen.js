import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import SessionVerifier from './SessionVerifier';
import useStorageSession from '../hooks/useStorageSession';

import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';

const styles = StyleSheet.create({
  splashScreenContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: theme.variables.appBg
  }
});

const SplashScreen = ({ navigation }) => {
  const { session, status } = useStorageSession();

  return (
    <View style={styles.splashScreenContainer}>
      <StatusBar backgroundColor={theme.variables.appBg} barStyle='dark-content' />
      <Icon name='kiwi-bird' size={100} color={theme.variables.primary} />
      <SessionVerifier
        status={status}
        session={session}
        navigate={navigation.navigate}
      />
    </View>
  );
};

export default SplashScreen;
