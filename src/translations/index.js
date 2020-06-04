import * as RNLocalize from 'react-native-localize';
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

const resources = {
  en: {
    translation: require('./en/translation'),
    account: require('./en/account'),
    error: require('./en/error'),
    languages: require('./en/languages')
  },
  da: {
    translation: require('./da/translation'),
    account: require('./da/account'),
    error: require('./da/error'),
    languages: require('./da/languages')
  },
};

const languageDetector = {
  type: 'languageDetector',
  async: false,
  detect: () => RNLocalize.getLocales()[0].languageCode,
  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    nsMode: 'translation',
    resources,
    react: {
      useSuspense: false,
    },
    interpolation: {
      format: function(value, format, lng) {
        if (format === 'CapitalizeFirst') {
          return CapitalizeFirst(value);
        }
        if (format === 'Uppercase') {
          return Uppercase(value);
        }
        return value;
      }
    }
  });

const handleLocalizationChange = a => {
  i18next.changeLanguage(RNLocalize.getLocales()[0].languageCode);
};

RNLocalize.addEventListener('change', handleLocalizationChange);

export default i18next;

export function CapitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function CapitalizeEach(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1);
  });
}

export function Uppercase(str) {
  return str.toUpperCase();
}
export { useTranslation };
