import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入element插件
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 导入插件
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

// 全局注册组件
Vue.component('tree-table', TreeTable);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
