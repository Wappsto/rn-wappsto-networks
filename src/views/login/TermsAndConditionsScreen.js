import React from 'react';
import Pdf from 'react-native-pdf';

const TermsAndConditionsScreen = () => {
  const uri =
    'https://www.seluxit.com/wp-content/uploads/sites/5/2022/04/Seluxit-Wappsto-Applications-Terms-and-Conditions-DPA-2022.pdf';
  return (
    <Pdf
      style={{ flex: 1 }}
      source={{ uri, cache: true }}
      onError={e => console.error('When trying to load the terms of service, we got:', e)}
    />
  );
};

export default React.memo(TermsAndConditionsScreen);
