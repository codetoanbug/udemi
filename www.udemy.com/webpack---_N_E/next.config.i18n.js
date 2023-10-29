// Maps application path to bundle names
const i18nPathToBundleMap = {
  de: "de_DE",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  id: "id_ID",
  it: "it_IT",
  ja: "ja_JP",
  ko: "ko_KR",
  nl: "nl_NL",
  pl: "pl_PL",
  pt: "pt_BR",
  ro: "ro_RO",
  ru: "ru_RU",
  ta: "ta_IN",
  th: "th_TH",
  tr: "tr_TR",
  vi: "vi_VN",
  xa: "xa_PL",
  xb: "xb_LW",
  xc: "xc_LT",
  "zh-cn": "zh_CN",
  "zh-tw": "zh_TW",
};

const i18nPreferred = ["en"];

const i18n = {
  locales: Object.keys(i18nPathToBundleMap),
  defaultLocale: "en",
};

const i18nLocaleToLangMap = (() => {
  const map = {};
  i18n.locales.forEach((lang) => {
    map[i18nPathToBundleMap[lang]] = lang;
  });
  return map;
})();

module.exports = {
  i18n,
  i18nPathToBundleMap,
  i18nLocaleToLangMap,
  i18nPreferred,
  i18nBundleNames: Object.values(i18nPathToBundleMap),
};
