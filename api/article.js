import request from '@/utils/request';

export const getArticles = params => request({
  method: 'GET',
  url: '/api/articles',
  params,
});
