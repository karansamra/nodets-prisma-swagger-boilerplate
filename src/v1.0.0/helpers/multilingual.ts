const i18n_module = require('i18n-nodejs');

const translate = (lang: any) => {
  const config = {
    lang: lang || 'en',
    langFile: '../../src/v1.0.0/helpers/locale.json',
  };

  return new i18n_module(config.lang, config.langFile);
};

export { translate };
