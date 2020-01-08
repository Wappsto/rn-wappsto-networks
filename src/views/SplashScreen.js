import AsyncStorage from '@react-native-community/async-storage';
import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import SessionVerifier from './SessionVerifier';

import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SplashScreen = ({ navigation }) => {
  const [ status, setStatus ] = useState('pending');
  const [ session, setSession ] = useState();

  // Get Session
  const getSession = async () => {
    try {
      let storageSession = await AsyncStorage.getItem('session');
      if (storageSession !== null) {
        storageSession = JSON.parse(storageSession);
        setSession(storageSession);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  useEffect(() => {
    getSession();
  }, []);

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
