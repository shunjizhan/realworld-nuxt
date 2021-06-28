import { request } from '@/plugins/request';

export const getArticles = params => request({
  method: 'GET',
  url: '/api/articles',
  params,
});

export const getFeedArticles = params => request({
  method: 'GET',
  url: '/api/articles/feed',
  params,
});
