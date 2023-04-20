import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text as RNText } from 'react-native';
import Text from '../../../components/Text';
import { CapitalizeFirst, useTranslation } from '../../../translations';
import NAV from '../../../enums/navigation';

const TermsAndConditions = () => {
  const { t } = useTranslation('account');
  const message = CapitalizeFirst(t('acceptTermsWhenSignIn.message'));
  const terms = t('acceptTermsWhenSignIn.terms');
  const privacy = t('acceptTermsWhenSignIn.privacy');
  const navigation = useNavigation();
  const navigateTo = to => () => navigation.navigate(to);

  return (
    <RNText style={{ marginBottom: 30 }}>
      {message
        .split(new RegExp(`(${terms}|${privacy})`))
        .map(str =>
          terms === str ? (
            <Text
              key={str}
              onPress={navigateTo(NAV.TERMS)}
              size="p"
              color="primary"
              align="center"
              content={str}
            />
          ) : privacy === str ? (
            <Text
              key={str}
              onPress={navigateTo(NAV.PRIVACY)}
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
