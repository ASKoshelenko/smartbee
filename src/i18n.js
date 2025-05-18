import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import commonUk from './locales/uk/common.json';
import commonEn from './locales/en/common.json';
import commonRu from './locales/ru/common.json';

import authUk from './locales/uk/auth.json';
import authEn from './locales/en/auth.json';
import authRu from './locales/ru/auth.json';

import profileUk from './locales/uk/profile.json';
import profileEn from './locales/en/profile.json';
import profileRu from './locales/ru/profile.json';

import coursesUk from './locales/uk/courses.json';
import coursesEn from './locales/en/courses.json';
import coursesRu from './locales/ru/courses.json';

import testingUk from './locales/uk/testing.json';
import testingEn from './locales/en/testing.json';
import testingRu from './locales/ru/testing.json';

const resources = {
  uk: {
    common: commonUk,
    auth: authUk,
    profile: profileUk,
    courses: coursesUk,
    testing: testingUk,
  },
  en: {
    common: commonEn,
    auth: authEn,
    profile: profileEn,
    courses: coursesEn,
    testing: testingEn,
  },
  ru: {
    common: commonRu,
    auth: authRu,
    profile: profileRu,
    courses: coursesRu,
    testing: testingRu,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    // Namespaces
    ns: ['common', 'auth', 'profile', 'courses', 'testing'],
    defaultNS: 'common',
  });

export default i18n; 