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

export const postComments = (slug, comment) => request({
  method: 'POST',
  url: `/api/articles/${slug}/comments`,
  data: { ...comment },
});

export const deleteComments = (slug, id) => request({
  method: 'DELETE',
  url: `/api/articles/${slug}/comments/${id}`,
});

export const createArticle = article => request({
  method: 'POST',
  url: `/api/articles`,
  data: { article },
});

export const updateArticle = (slug, article) => request({
  method: 'PUT',
  url: `/api/articles/${slug}`,
  data: { article },
});

export const deleteArticle = slug => request({
  method: 'DELETE',
  url: `/api/articles/${slug}`,
});


