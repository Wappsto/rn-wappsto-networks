import React from 'react';
import useLanguageButton from '../hooks/useLanguageButton';
import Button from './Button';
import { useTranslation, CapitalizeFirst } from '../translations';

const LanguageButton = React.memo(() => {
  const { t } = useTranslation();
  const { changeLanguage, showLanguageButton } = useLanguageButton();
  if (!showLanguageButton) {
    return null;
  }
  return (
    <>
      <Button text={CapitalizeFirst(t('languages:en'))} onPress={() => changeLanguage('en')} />
      <Button text={CapitalizeFirst(t('languages:da'))} onPress={() => changeLanguage('da')} />
    </>
  );
});

LanguageButton.displayName = 'LanguageButton';
export default LanguageButton;
