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

export const addFavorite = slug => request({
  method: 'POST',
  url: `/api/articles/${slug}/favorite`,
});

export const deleteFavorite = slug => request({
  method: 'DELETE',
  url: `/api/articles/${slug}/favorite`,
});

export const getArticleDetails = slug => request({
  method: 'GET',
  url: `/api/articles/${slug}`,
});

export const getComments = slug => request({
  method: 'GET',
  url: `/api/articles/${slug}/comments`,
});
