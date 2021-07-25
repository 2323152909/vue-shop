import axios from 'axios'

export function request1(config) {
  const instance = axios.create({
    baseURL: "http://120.77.221.77:8888/api/private/v1",
    timeout: 5000,
  });

  // 请求拦截器 
  instance.interceptors.request.use(request => {
    // 为请求头对象，添加token 验证的 Authorization 字段
    request.headers.Authorization = sessionStorage.getItem('token');
    return request;
  }, error => {
    return Promise.reject(error);
  });

  // 配置响应拦截器
  instance.interceptors.response.use(response => {
    // Do something before response is sent
    return response;
  }, error => {
    // Do something with response error
    return Promise.reject(error);
  });

  return instance(config);
}