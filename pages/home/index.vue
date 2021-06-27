<template>
  <div class="home-page">

  <div class="banner">
    <div class="container">
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>

  <div class="container page">
    <div class="row">

      <div class="col-md-9">
        <div class="feed-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <a class="nav-link disabled" href="">Your Feed</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="">Global Feed</a>
            </li>
          </ul>
        </div>

        <div
          class="article-preview"
          v-for="a in articles"
          :key="a.slug"
        >
          <div class="article-meta">
            <nuxt-link
             :to="{
               name: 'profile',
               params: {
                 username: a.author.username,
               }
             }" 
            >
              <img :src="a.author.image">
            </nuxt-link>

            <div class="info">
              <nuxt-link
              :to="{
                  name: 'profile',
                  params: {
                    username: a.author.username,
                  }
                }" 
              >
                {{ a.author.username }}
                <span class="data">
                  {{ a.createdAt }}
                </span>
              </nuxt-link>
            </div>
            <button
              class="btn btn-outline-primary btn-sm pull-xs-right"
              :class="{ active: a.favorited }"
            >
              <i class="ion-heart"></i> {{ a.favoritesCount }}
            </button>
          </div>

          <nuxt-link
            :to="{
              name: 'article',
              params: {
                slug: a.slug,
              }
            }"
            class="preview-link"
          >
            <h1>{{ a.title }}</h1>
            <p>{{ a.description }}</p>
            <span>Read more...</span>
          </nuxt-link>
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
import { getArticles } from '@/api/article';
import { getTags } from '@/api/tag';

export default {
  name: 'Home',
  async asyncData ({ query }) {
    const curPage = parseInt(query.page) || 1;
    const limit = 2;

    const [articleData, tagData] = await Promise.all([
      getArticles({
        limit,
        offset: (curPage - 1) * limit,
        tag: query.tag,
      }),
      getTags(),
    ]);
  
    const { data: {
      articles,
      articlesCount,
    } } = articleData;

    const { data: { tags } } = tagData;

    return {
      articles, 
      articlesCount,
      limit,
      curPage,
      tags,
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  watchQuery: ['page', 'tag'],
}
</script>

<style>

</style>