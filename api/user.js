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

export const getUser = () => request({
  method: 'GET',
  url: '/api/user',
});

export const updateUser = user => request({
  method: 'PUT',
  url: '/api/user',
  data: { user },
});

export const getUserProfile = username => request({
  method: 'GET',
  url: `/api/profiles/${username}`,
});
