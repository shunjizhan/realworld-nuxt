<template>
  <div>
    <div class="article-meta">
    <nuxt-link
    :to="{
      name: 'profile',
      params: {
        username: article.author.username,
      }
    }" 
    >
      <img :src="article.author.image">
    </nuxt-link>

    <div class="info">
      <nuxt-link
        :to="{
            name: 'profile',
            params: {
              username: article.author.username,
            }
          }" 
        >
        {{ article.author.username }}
      </nuxt-link>
      <span class="data">
        {{ article.createdAt | date }}
      </span>
    </div>
    <button
      class="btn btn-outline-primary btn-sm pull-xs-right"
      :class="{ active: article.favorited }"
      @click="onFavorite(article)"
      :disabled="article.favoriteDisabled"
    >
      <i class="ion-heart"></i> {{ article.favoritesCount }}
    </button>
  </div>

  <nuxt-link
    :to="{
      name: 'article',
      params: {
        slug: article.slug,
      }
    }"
    class="preview-link"
  >
    <h1>{{ article.title }}</h1>
    <p>{{ article.description }}</p>
    <span>Read more...</span>
  </nuxt-link>
  </div>
</template>

<script>
import {
  addFavorite,
  deleteFavorite,
} from '@/api/article';

import ArticleMeta from './article-meta.vue';

export default {
  name: 'Article-Preview',
  props: {
    article: {
      type: Object,
      required: true,
    }
  },
  methods: {
    async onFavorite (article) {
      const { favorited, slug } = article;

      article.favoriteDisabled = true;
      if (favorited) {
        await deleteFavorite(slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        await addFavorite(slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    }
  },
  components: {
    ArticleMeta,
  }
}
</script>

<style>

</style>