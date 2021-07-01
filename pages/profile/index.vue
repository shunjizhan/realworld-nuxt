<template>
  <div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="user.image" class="user-img" />
          <h4>{{ user.username }}</h4>
          <p>
            {{ user.bio }}
          </p>
          <button class="btn btn-sm btn-outline-secondary action-btn">
            <nuxt-link v-if="user" :to="{
              name: 'settings',
            }">
              <i class="ion-gear-b"></i>
              &nbsp;
              Edit Profile Settings
            </nuxt-link>
            <span v-else>
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow {{ user.username }}
            </span>
          </button>
        </div>

      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <nuxt-link :class="{ active: !tab }" class="nav-link" :to="{
                name: 'profile',
                params: {
                  username: user.username,
                },
              }">My Articles</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link :class="{ active: tab }" class="nav-link" :to="{
                name: 'profile',
                params: {
                  username: user.username,
                  tab: 'favorite',
                },
              }">Favorite Articles</nuxt-link>
            </li>
          </ul>
        </div>

        <div v-for="a in articles" class="article-preview" :key="a.slug">
          <div class="article-meta">
            <nuxt-link :to="{
              name: 'profile',
              params: {
                username: a.author.username,
              }
            }"><img :src="a.author.image" /></nuxt-link>
            <div class="info">
              <a href="" class="author">{{ a.author.username }}</a>
              <span class="date">{{ a.createdAt }}</span>
            </div>
            <button class="btn btn-outline-primary btn-sm pull-xs-right">
              <i class="ion-heart"></i> {{ a.favoritesCount }}
            </button>
          </div>
          <nuxt-link :to="{
            name: 'article',
            params: {
              slug: a.slug,
            }
          }" class="preview-link">
            <h1>{{ a.title }}</h1>
            <p>{{ a.description }}</p>
            <span>Read more...</span>
          </nuxt-link>
        </div>

      </div>

    </div>
  </div>

</div>
</template>

<script>
import { getArticles } from '@/api/article';
import { mapState } from 'vuex';

export default {
  name: 'UserProfile',
  middleware: 'authenticated',   // 渲染前会先执行中间件
  data () {
    return {
      articles: [],
    };
  },
  async asyncData ({ query }) {
    return {
      tab: query.tab,
    }
  },
  computed: {
    ...mapState(['user']),
  },
  async mounted() {
    await this.fetchArticles();
  },
  methods: {
    async fetchArticles () {
      const fetch = this.$route.params.tab === 'favorite'
        ? this.getFavoritedArticles
        : this.getUserArticles;
      
      await fetch();
    },
    async getUserArticles () {
      const { data } = await getArticles({ author: this.user.username });
      this.articles = data.articles;
    },
    async getFavoritedArticles () {
      const { data } = await getArticles({ favorited: this.user.username });
      this.articles = data.articles;
    }
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchArticles'
  },
}
</script>

<style>

</style>