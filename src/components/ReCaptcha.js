import React from 'react';
import Recaptcha from 'react-native-recaptcha-that-works';
import { useTranslation } from '../translations';
import { config } from '../configureWappstoRedux';

const ReCaptcha = React.memo(({ onCheck, style, recaptchaRef }) => {
  const { i18n } = useTranslation();

  return (
    <Recaptcha
      ref={recaptchaRef}
      siteKey={config?.recaptchaKey}
      baseUrl={config?.baseUrl?.replace('/services', '')}
      languageCode={i18n.language}
      onVerify={onCheck}
      lang={i18n.language}
    />
  );
});

export default ReCaptcha;
