import React from 'react';
import { Text as RNText, Linking } from 'react-native';
import Text from '../../../components/Text';
import { CapitalizeFirst, useTranslation } from '../../../translations';

const TermsAndConditions = ({ termsLink, privacyLink }) => {
  const { t } = useTranslation('account');
  const message = CapitalizeFirst(t('acceptTermsWhenSignIn.message'));
  const terms = t('acceptTermsWhenSignIn.terms');
  const privacy = t('acceptTermsWhenSignIn.privacy');

  const handlePress = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <RNText style={{ marginBottom: 30 }}>
      {message
        .split(new RegExp(`(${terms}|${privacy})`))
        .map(str =>
          terms === str ? (
            <Text
              key={str}
              onPress={() => handlePress(termsLink)}
              size="p"
              color="primary"
              align="center"
              content={str}
            />
          ) : privacy === str ? (
            <Text
              key={str}
              onPress={() => handlePress(privacyLink)}
              size="p"
              color="primary"
              align="center"
              content={str}
            />
          ) : (
            <Text key={str} size="p" color="secondary" align="center" content={str} />
          ),
        )}
    </RNText>
  );
};

export default React.memo(TermsAndConditions);
