// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
import VueI18n from 'vue-i18n'
import VueCookie from 'vue-cookie'
import VueClipboard from 'vue-clipboard2'
import VueScroller from 'vue-scroller'
import VueProgressBar from 'vue-progressbar'
import Es6Promise from "es6-promise"

Es6Promise.polyfill()
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

const options = {
  color: '#E5E5E5',
  failedColor: 'red',
  height: '25px',
  thickness: '10px',
  transition:{speed: '2s', opacity: '0.6s', termination: 2000},
  position:'absolute',
  autoFinish: false
}

Vue.use(VueProgressBar, options)
Vue.use(VueScroller)
Vue.use(VueClipboard);
Vue.use(VueCookie);
Vue.use(VueI18n);

// import axios from './assets/js/axios.js'

Vue.config.productionTip = false;
Vue.prototype.$axios=axios;

//引用全局方法
import {baseUrl,currentVersion,UtcToLocale,currentVersionDot,iosCurrentVersionDot} from './api/config.js'
import {isSimilarWallet} from './components/utl.js'



Vue.prototype.currentVersionDot = currentVersionDot;
Vue.prototype.baseUrl = baseUrl;
Vue.prototype.UtcToLocale = UtcToLocale;
Vue.prototype.currentVersion = currentVersion;
Vue.prototype.iosCurrentVersionDot = iosCurrentVersionDot;

Vue.prototype.baseUrl = baseUrl;//引用全局方法
Vue.prototype.UtcToLocale = UtcToLocale;
Vue.prototype.currentVersion = currentVersion;
Vue.prototype.isSimilarWallet = isSimilarWallet;
Vue.component('icon', Icon)

const i18n = new VueI18n({
  locale: 'en',    // 语言标识
  messages: {
    'cn': require('./assets/i18n/cn.json'),   // 中文语言包
    'en': require('./assets/i18n/en.json')    // 英文语言包
  },
})
export default  i18n

/* eslint-disable no-new */
var vm=new Vue({
  el: '#app',
  router,
  i18n: i18n,
  render: h=>h(App)
  // components: { App },
  // template: '<App/>'
})

