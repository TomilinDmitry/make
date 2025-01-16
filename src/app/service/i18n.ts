import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./translate/en.json";
import esTranslation from "./translate/es.json";
import ruTranslation from "./translate/ru.json";
import arTranslation from "./translate/ae.json";
import chTranslation from "./translate/ch.json";
import krTranslation from "./translate/kr.json";
import trTranslation from "./translate/tr.json";
import deTranslation from "./translate/de.json";
import frTranslation from "./translate/fr.json";
import itTranslation from "./translate/it.json";
// const currentLanguage = localStorage.getItem("language");
// // console.log(currentLanguage);
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    ru: {
      translation: ruTranslation,
    },
    es: {
      translation: esTranslation,
    },
    ae: {
      translation: arTranslation,
    },
    ch: {
      translation: chTranslation,
    },
    kr: {
      translation: krTranslation,
    },
    tr: {
      translation: trTranslation,
    },
    de: {
      translation: deTranslation,
    },
    fr: {
      translation: frTranslation,
    },
    it: {
      translation: itTranslation,
    },
  },
  lng: localStorage.getItem("language")?.toLowerCase() as string, // Язык по умолчанию
  fallbackLng: "en", // Язык на случай, если перевод для текущего языка не найден
  interpolation: {
    escapeValue: false, // Отключаем экранирование, если используем React
  },
});

export default i18n;
