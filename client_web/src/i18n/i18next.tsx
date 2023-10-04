import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import basics_en from './en/en.json';
import basics_fr from './fr/fr.json';

const RESSOURCES = {
	en: { translation: basics_en },
	fr: { translation: basics_fr },
};

i18n.use(initReactI18next).init({
	compatibilityJSON: 'v3',
	resources: RESSOURCES,
	lng: 'fr',
	fallbackLng: 'fr',
	keySeparator: '.',
	nsSeparator: '|',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
