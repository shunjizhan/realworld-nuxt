<template>
  <div class="article-meta">
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username,
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>

    <div class="info">
      <nuxt-link class="author" :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        }
      }">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date }}</span>
    </div>

    <span v-if="user">
      <nuxt-link class="btn btn-outline-secondary btn-sm" :to="{
        name: 'editor',
        params: {
          slug: article.slug,
        }}"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button class="btn btn-outline-danger btn-sm" :disabled="isDeleting" @click="handleDelete(article.slug)">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </span>

    <span v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: article.author.following }"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        Follow {{ article.author.username }} <span class="counter">(10)</span>
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{ active: article.favorited }"
      >
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </span>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import { deleteArticle } from '@/api/article';

export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      isDeleting: false,
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    async handleDelete (slug) {
      this.isDeleting = true;
      await deleteArticle(slug);
      this.isDeleting = false;

      // redirect to home page
      this.$router.push(`/`);
    }
  }
}
</script>

<style>

</style>