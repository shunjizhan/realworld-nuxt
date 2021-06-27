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

      <div class="col-md-3">
        <div class="sidebar">
          <p>Popular Tags</p>

          <div class="tag-list">
            <a href="" class="tag-pill tag-default">programming</a>
            <a href="" class="tag-pill tag-default">javascript</a>
            <a href="" class="tag-pill tag-default">emberjs</a>
            <a href="" class="tag-pill tag-default">angularjs</a>
            <a href="" class="tag-pill tag-default">react</a>
            <a href="" class="tag-pill tag-default">mean</a>
            <a href="" class="tag-pill tag-default">node</a>
            <a href="" class="tag-pill tag-default">rails</a>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
</template>

<script>
import { getArticles } from '@/api/article';

export default {
  name: 'Home',
  async asyncData () {
    const { data: {
      articles,
      articlesCount,
    } } = await getArticles();

    return {
      articles, 
      articlesCount,
    }
  }
}
</script>

<style>

</style>