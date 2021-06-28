import { request } from '@/plugins/request';

export const getTags = () => request({
  method: 'GET',
  url: '/api/tags',
});
