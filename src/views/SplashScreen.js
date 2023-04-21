import React from 'react';
import { View, StatusBar, StyleSheet, Image } from 'react-native';
import theme from '../theme/themeExport';
import defaultImages from '../theme/images';

const styles = StyleSheet.create({
  splashScreenContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: theme.variables.appBgColor,
  },
  image: {
    alignSelf: 'center',
    maxWidth: '100%',
  },
});

const SplashScreen = () => {
  return (
    <View style={styles.splashScreenContainer}>
      <StatusBar
        backgroundColor={theme.variables.statusBarBgLight}
        barStyle={theme.variables.statusBarColorDark}
      />
      {defaultImages.splashScreen.logo && (
        <Image resizeMode="contain" style={styles.image} source={defaultImages.splashScreen.logo} />
      )}
    </View>
  );
};

SplashScreen.displayName = 'SplashScreen';
export default SplashScreen;
