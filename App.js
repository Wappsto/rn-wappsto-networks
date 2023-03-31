import React from 'react';
import './src/getImages';
import { Provider } from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from './src/theme/themeExport';
import store from './src/configureWappstoRedux';
import Router from './src/navigation';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer theme={{ ...DefaultTheme, ...theme.headerStyle }}>
          <Router useSuspense={false} />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
