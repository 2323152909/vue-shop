import axios from 'axios'

// 导入 NProgress对应的 js和 css
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

export function request1(config) {
  const instance = axios.create({
    baseURL: "http://120.79.64.82:8888/api/private/v1",
    //baseURL: "http://120.77.221.77:8888/api/private/v1",
    timeout: 5000,
  });

  // 请求拦截器 
  // 在 request拦截器中， 展示进度条 NProgress.start()
  instance.interceptors.request.use(request => {
    // 为请求头对象，添加token 验证的 Authorization 字段
    request.headers.Authorization = sessionStorage.getItem('token');
    // 启用进度条
    NProgress.start();
    return request;
  }, error => {
    return Promise.reject(error);
  });

  // 配置响应拦截器
  // 在 response拦截器中， 关闭进度条 NProgress.done()
  instance.interceptors.response.use(response => {
    // 隐藏进度条
    NProgress.done()
    return response;
  }, error => {
    // Do something with response error
    return Promise.reject(error);
  });

  return instance(config);
}
