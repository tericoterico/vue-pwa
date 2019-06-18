import Vue from 'vue'
import router from './router'
import store from './store'

import App from './App.vue'

import Vuetify from 'vuetify'
import CircularCountDownTimer from 'vue-circular-count-down-timer';

import Dexie from "dexie"
import moment from 'moment';
import lodash from 'lodash';

// VuetifyのCSS
import 'vuetify/dist/vuetify.min.css'

//全体で共通使用する外部ライブラリ
Object.defineProperty(Vue.prototype, '$moment', { value: moment });
Object.defineProperty(Vue.prototype, '_', { value: lodash });

import './registerServiceWorker'

Vue.config.productionTip = false

//Vueプラグイン インポート

//Vueプラグイン 登録
Vue.use(CircularCountDownTimer);
Vue.use(Vuetify, {options: { customProperties: true}});

//Todo:グローバル変数ではなく、別の方法で各コンポーネントから一括で参照できる定義方法はないのか。。
global.$db = new Dexie("Todo");

// store定義
$db.version(1).stores({
  todos: "++id,name,data",
  scores: "++id,setId,score,date"
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
