import {configureLocalization} from '@lit/localize';

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['tr'],
  loadLocale: async (locale) => {
    switch (locale) {
      case 'tr':
        return import('./public/locales/tr.json', {assert: {type: 'json'}});
      default:
        return import('./public/locales/en.json', {assert: {type: 'json'}});
    }
  },
});

export const detectLocaleFromLangAttr = async () => {
  const lang = document.documentElement.lang || 'en';
  await setLocale(lang);
};
