import { useCallback } from 'react';
import { config } from '../configureWappstoRedux';
import i18n from '../translations';

const useLanguageButton = () => {
  const changeLanguage = useCallback((lng) => i18n.changeLanguage(lng), []);
  return {
    showLanguageButton: config.showLanguageButton,
    changeLanguage
  };
}

export default useLanguageButton;
