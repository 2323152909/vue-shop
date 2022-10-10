import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入element插件
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 导入插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入工具类
import { dateFormat } from './utils/format'

// 导入vue-quill-editor 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入 NProgress对应的 js和 css
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

Vue.config.productionTip = false

// 全局注册属性表格组件
Vue.component('tree-table', TreeTable);

// 全局挂载富文本编辑器，全局可用
Vue.use(VueQuillEditor);

// 全局注册过滤器
Vue.filter('dateFormat', dateFormat)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
