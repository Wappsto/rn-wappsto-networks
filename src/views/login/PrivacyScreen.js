import React from 'react';
import WebView from 'react-native-webview';
import Screen from '../../components/Screen';
import { config } from '../../configureWappstoRedux';

const PrivacyScreen = () => {
  const uri = config.links?.privacy;

  if (!uri) {
    return null;
  }

  return (
    <Screen>
      <WebView
        source={{ uri }}
        onError={e => console.error('When trying to load the privacy screen, we got:', e)}
      />
    </Screen>
  );
};

export default React.memo(PrivacyScreen);
