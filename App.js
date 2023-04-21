import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/configureWappstoRedux';
import './src/getImages';
import Router from './src/navigation';
import theme from './src/theme/themeExport';

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
