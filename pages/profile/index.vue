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
            <nuxt-link v-if="curUser.username === user.username" :to="{
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
          <div v-if="isLoading">Loading...</div>
          <ArticlePreview v-else :article="a"/>
        </div>

      </div>

    </div>
  </div>

</div>
</template>

<script>
import { getArticles } from '@/api/article';
import { getUserProfile } from '@/api/user';
import ArticlePreview from '../article/components/article-preview.vue';

import { mapState } from 'vuex';

export default {
  name: 'UserProfile',
  middleware: 'authenticated',   // 渲染前会先执行中间件
  data () {
    return {
      articles: [],
      user: {},
      isLoading: false,
    };
  },
  async asyncData ({ query }) {
    return {
      tab: query.tab,
    }
  },
  computed: mapState({
    curUser: state => state.user,
  }),
  async mounted() {
    await this.refresh();
  },
  methods: {
    async refresh() {
      // 必须串行：先拿username，再fetch他的Article
      await this.fetchUserData();
      await this.fetchArticles();
    },
    async fetchUserData () {
      const { data } = await getUserProfile(this.$route.params.username);
      this.user = data.profile;
    },
    async fetchArticles () {
      const fetch = this.$route.params.tab === 'favorite'
        ? this.getFavoritedArticles
        : this.getUserArticles;
      
      this.isLoading = true;
      await fetch();
      this.isLoading = false;
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
    $route: 'refresh'
  },
  components: {
    ArticlePreview,
  }
}
</script>

<style>

</style>