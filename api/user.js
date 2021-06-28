import { request } from '@/plugins/request';

export const login = data => request({
  method: 'POST',
  url: '/api/users/login',
  data,
});

export const register = data => request({
  method: 'POST',
  url: '/api/users',
  data,
});
