import axios from 'axios'

export function request1(config) {
  const instance = axios.create({
    baseURL: "http://120.77.221.77:8888/api/private/v1",
    timeout: 5000,
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
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