import React from 'react';
import Pdf from 'react-native-pdf';
import Screen from '../../components/Screen';
import { config } from '../../configureWappstoRedux';

const TermsAndConditionsScreen = () => {
  const uri = config.links?.terms;

  if (!uri) {
    return null;
  }

  return (
    <Screen>
      <Pdf
        trustAllCerts={false}
        style={{ flex: 1 }}
        source={{ uri, cache: true }}
        onError={e => console.error('When trying to load the terms of service, we got:', e)}
      />
    </Screen>
  );
};

export default React.memo(TermsAndConditionsScreen);
