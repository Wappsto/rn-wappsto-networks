import React from 'react';
import ConfirmGoogleCaptcha from 'react-native-google-recaptcha-v2';
import { useTranslation, CapitalizeFirst } from '../translations';
import { config } from '../configureWappstoRedux';

const ReCaptcha = React.memo(({ onCheck, style, recaptchaRef }) => {
  const { t, i18n } = useTranslation();

  return (
    <ConfirmGoogleCaptcha
      ref={recaptchaRef}
      siteKey={config.recaptchaKey}
      baseUrl={config.baseUrl && config.baseUrl.replace('/services', '')}
      languageCode={i18n.language}
      onMessage={(event) => onCheck(event.nativeEvent.data)}
      cancelButtonText={CapitalizeFirst(t('genericButton.cancel'))}
    />
  );
});

export default ReCaptcha;
