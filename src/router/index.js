import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    name:'login',
    path:'/login',
    component:Login
  },
  {
    name:'home',
    path:'/home',
    component:Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  /**
   * to 将要访问的路径
   * from 代表从那个路径跳转过来的
   * next 是一个函数， 表示放行
   *      next() 放行   next('/login')强制跳转
   */
  // 如果用户访问的登录页，直接放行
  if(to.path === '/login') return next();
  // 从sessionStorage 中获取到保存的 token
  const tokenStr = sessionStorage.getItem('token');
  // 没有token， 强制返回登录页面
  if(!tokenStr) return next('/login');

  next();
})

export default router
