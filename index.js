import('./src/router');
import('./src/pages/list-page');
import('./src/pages/create-page');
import('./src/pages/edit-page');
import('./src/components/confirmation-modal');
import('./src/components/toast-message');
import('./src/components/layout-component');
import('./src/components/pagination-component');
import('./src/components/employee-table');
import('./src/components/employee-grid');
import('./src/components/employee-form');
import('./src/components/text-input');
import('./src/components/date-input');
import('./src/components/select-input');
import('./src/components/language-switcher.js');

/**
import { msg } from '@lit/localize';
import { detectLocaleFromLangAttr, setLocale } from './lit-localize.config.js';

const observer = new MutationObserver(async (mutations) => {
  for (const mutation of mutations) {
    if (mutation.attributeName === 'lang') {
      const newLang = document.documentElement.lang || 'en';
      await setLocale(newLang);
      console.log(`Locale changed to: ${newLang}`);
    }
  }
});

observer.observe(document.documentElement, { attributes: true });

(async () => {
  await detectLocaleFromLangAttr();
  console.log(`Locale set to: ${document.documentElement.lang}`);

  await Promise.all([
    import('./src/router'),
    import('./src/pages/list-page'),
    import('./src/pages/create-page'),
    import('./src/pages/edit-page'),
    import('./src/components/layout-component'),
    import('./src/components/pagination-component'),
    import('./src/components/employee-table'),
    import('./src/components/employee-grid'),
    import('./src/components/employee-form'),
    import('./src/components/text-input'),
    import('./src/components/date-input'),
    import('./src/components/select-input'),
    import('./src/components/language-switcher.js'),
  ]);

  console.log('All components and routes loaded');
})();
 */
