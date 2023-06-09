import Vue from 'vue'
import Vue18n from 'vue-i18n'
import Cookie from 'js-cookie'

Vue.use(Vue18n);

const i18n = new Vue18n({
  locale: Cookie.get('lang') || 'en-US',
  fallbackLocale: Cookie.get('lang') || 'en-US',
  messages: {
      'en-US': require('./lang/en').default,
      'zh-CN': require('./lang/zh').default,
  }
})

export default i18n;