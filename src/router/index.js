import Vue from 'vue';
import VueRouter from 'vue-router';

// import Login from '../components/Login'
const Login = () => import('../components/Login');
// import Home from '../components/Home'
const Home = () => import('../components/Home');
// import Welcome from '../components/Welcome'
const Welcome = () => import('../components/Welcome');
// import Users from '../views/user/Users'
const Users = () => import('../views/user/Users');
// import Roles from '../views/power/Roles'
const Roles = () => import('../views/power/Roles');
// import Rights from '../views/power/Rights'
const Rights = () => import('../views/power/Rights');
const Cate = () => import('../views/goods/Cate');
const Params = () => import('../views/goods/Params');
const List = () => import('../views/goods/List');
const Add = () => import('../views/goods/Add');
const Order = () => import('../views/order/Order');
const Report = () => import('../views/report/Report');

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  // 登录页面路由信息
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  // 主页路由信息
  {
    name: 'home',
    path: '/home',
    redirect: '/welcome',
    component: Home,
    // 主页中的子面板路由信息
    children: [
      {
        // 欢迎页面路由信息，默认进入主页重定向到欢迎页面
        name: 'welcome',
        path: '/welcome',
        component: Welcome
      },
      // 用户列表路由信息
      {
        name: 'users',
        path: '/users',
        component: Users
      },
      // 权限管理的角色管理路由信息
      {
        name: 'roles',
        path: '/roles',
        component: Roles
      },
      // 权限管理的权限列表路由信息
      {
        name: 'rights',
        path: '/rights',
        component: Rights
      },
      // 商品分类路由信息
      {
        name: 'cate',
        path: '/categories',
        component: Cate
      },
      // 商品参数路由信息
      {
        name: 'params',
        path: '/params',
        component: Params
      },
      // 商品列表信息
      {
        name: 'list',
        path: '/goods',
        component: List
      },
      // 商品列表中的商品添加路由信息
      {
        name: 'add',
        path: '/goods/add',
        component: Add
      },
      // 订单管理页面路由信息
      {
        name: 'order',
        path: '/orders',
        component: Order
      },
      // 数据报表页面路由信息
      {
        name: 'report',
        path: '/reports',
        component: Report
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 路由导航守卫
router.beforeEach((to, from, next) => {
  /**
   * to 将要访问的路径
   * from 代表从那个路径跳转过来的
   * next 是一个函数， 表示放行
   *      next() 放行   next('/login')强制跳转
   */
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next();
  // 从sessionStorage 中获取到保存的 token
  const tokenStr = sessionStorage.getItem('token');
  // 没有token， 强制返回登录页面
  if (!tokenStr) return next('/login');

  next();
});

export default router;
