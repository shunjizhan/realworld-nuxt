<template>
  <div class="home-page">

  <div class="banner">
    <div class="container">
      <h1 class="logo-font">Real Crypto World</h1>
      <p>A place to witness a decentralized future</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">

      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li v-if="user" class="nav-item">
              <nuxt-link
                exact
                class="nav-link"
                :class="{ active: tab === 'your_feed' }"
                :to="{
                  name: 'home',
                  query: {
                    tab: 'your_feed',
                  }
                }"
              >
                <i class="ion-star"></i> Your Feed
              </nuxt-link>
            </li>

            <li class="nav-item">
              <nuxt-link
                exact
                class="nav-link"
                :class="{ active: tab === 'glob_feed' }"
                :to="{
                  name: 'home',
                  query: {
                    tab: 'glob_feed',
                  },
                }"
              >
                <i class="ion-earth"></i> Global Feed
              </nuxt-link>
            </li>

            <li v-if="curTag" class="nav-item">
              <nuxt-link
                class="nav-link"
                :class="{ active: tab === 'tag' }"
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: curTag,
                  },
                }"
              >
                <i class="ion-bookmark"></i> {{ curTag }}
              </nuxt-link>
            </li>

          </ul>
        </div>

        <div
          class="article-preview"
          v-for="a in articles"
          :key="a.slug"
        >
          <ArticlePreview :article="a"/>
        </div>

      </div>

      <nav>
        <ul class="pagination">
          <li
            class="page-item"
            :class="{ active: p === curPage}"
            v-for="p in totalPage"
            :key="p"
          >
            <nuxt-link
              class="page-link"
              :to="{
                name: 'home',
                query: {
                  page: p,
                  tag: $route.query.tag,
                  tab,
                }
              }"
            >
              {{ p }}
            </nuxt-link>
          </li>
        </ul>
      </nav>

      <div class="col-md-3">
        <div class="sidebar">
          <p>Popular Tags</p>

          <div class="tag-list">
            <nuxt-link
              :to="{
                name: 'home',
                query: {
                  tag: t,
                  tab: 'tag',
                }
              }"
              class="tag-pill tag-default"
              v-for="t in tags"
              :key="t"
            >
              {{ t }}
            </nuxt-link>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
</template>

<script>
import {
  getArticles,
  getFeedArticles,
} from '@/api/article';
import { getTags } from '@/api/tag';
import { mapState } from 'vuex';

import ArticlePreview from '../article/components/article-preview.vue';

export default {
  name: 'Home',
  async asyncData ({ query, store }) {
    const curPage = parseInt(query.page) || 1;
    const limit = 10;
    const { tag: curTag } = query;
    const tab = query.tab || 'global_feed'

    const _getArticles = (tab === 'your_feed') && store.state.user
      ? getFeedArticles
      : getArticles

    const [articleData, tagData] = await Promise.all([
      _getArticles({
        limit,
        offset: (curPage - 1) * limit,
        tag: curTag,
      }),
      getTags(),
    ]);
  
    const { data: {
      articles,
      articlesCount,
    } } = articleData;

    const { data: { tags } } = tagData;

    articles.forEach(a => a.favoriteDisabled = false);

    return {
      articles, 
      articlesCount,
      limit,
      curPage,
      tags,
      curTag,
      tab,
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['user']),
  },
  watchQuery: ['page', 'tag', 'tab'],
  components: {
    ArticlePreview,
  },
}
</script>

<style>

</style>