import React from 'react';
import { View, StatusBar } from 'react-native';
import SessionVerifier from './SessionVerifier';
import useStorageSession from 'src/hooks/useStorageSession';

import theme from 'src/theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SplashScreen = ({ navigation }) => {
  const { session, status } = useStorageSession();

  return (
    <View style={theme.common.splashScreenContainer}>
      <StatusBar backgroundColor={theme.variables.white} barStyle='dark-content' />
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
