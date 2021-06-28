// 基于axios封装的请求模块

import axios from 'axios';

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io',
});

export default (context) => {
  const { user } = context.store.state;

  // 请求拦截器：任何请求都要经过它，可以做一个公共的业务处理，例如统一设置token
  request.interceptors.request.use(config => {
    if (user && user.token) {
      config.headers.Authorization = `Token ${ user.token }`;
    }

    return config;
  }, Promise.reject);
}
