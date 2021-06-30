<template>
  <div class="article-page">

  <div class="banner">
    <div class="container">

      <h1>{{ article.title }}</h1>

      <Article-meta :article="article" />

    </div>
  </div>

  <div class="container page">

    <div class="row article-content">
      <div class="col-md-12" v-html="article.body"></div>

      <ul class="tag-list">
          <li class="tag-default tag-pill tag-outline ng-binding ng-scope" v-for="t in article.tagList" :key="t">
            {{ t }}
          </li>
      </ul>
    </div>

    <hr />

    <div class="article-actions">
      <Article-meta :article="article" />
    </div>

    <div class="row">

      <div class="col-xs-12 col-md-8 offset-md-2">
        <ArticleComments :article="article" />
      </div>

    </div>

  </div>

</div>

</template>

<script>
import { getArticleDetails } from '@/api/article';
import MarkdownIt from 'markdown-it';

import ArticleMeta from './components/article-meta.vue';
import ArticleComments from './components/article-comments.vue';

export default {
  name: 'Article',
  async asyncData ({ params }) {
    const { data: { article } } = await getArticleDetails(params.slug);
    article.body = new MarkdownIt().render(article.body);

    return {
      article,
    }    
  },
  components: {
    ArticleMeta,
    ArticleComments,
  },
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description,
        }
      ],
    }
  },
}
</script>

<style>

</style>