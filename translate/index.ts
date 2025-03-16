/* eslint-disable */
// @ts-nocheck
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from './en';
import * as ru from './ru';

type TupleUnion<U extends string, R extends unknown[] = []> = {
  [S in U]: Exclude<U, S> extends never ? [...R, S] : TupleUnion<Exclude<U, S>, [...R, S]>;
}[U];

const ns = Object.keys(en) as TupleUnion<keyof typeof en>;

export const defaultNS = ns[0];

const supportedLanguages = ['en', 'ru'];

let lang = localStorage.getItem('selectedLanguage');
if (!lang) {
  const systemLang = navigator.language || navigator.userLanguage;
  let shortLang = systemLang.split('-')[0];

  if (!supportedLanguages.includes(shortLang)) {
    shortLang = 'en';
  }

  lang = shortLang;
  localStorage.setItem('selectedLanguage', lang);
}

void i18n.use(initReactI18next).init({
  ns,
  defaultNS,
  resources: {
    en,
    ru,
  },
  lng: lang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

export default i18n;
