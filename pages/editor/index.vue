<template>
  <div class="editor-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-10 offset-md-1 col-xs-12">
        <form @submit.prevent="handleCreateArticle">
          <fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control form-control-lg" placeholder="Article Title" v-model="article.title">
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="What's this article about?" v-model="article.description">
            </fieldset>
            <fieldset class="form-group">
                <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)" v-model="article.body"></textarea>
            </fieldset>
            <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags" v-model="article.tags"><div class="tag-list"></div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="submit" :disabled="publishing">
                Publish Article
            </button>
          </fieldset>
        </form>
      </div>

    </div>
  </div>
</div>



</template>

<script>
import {
  createArticle,
  updateArticle,
  getArticleDetails,
} from '@/api/article';

export default {
  name: 'Editor',
  middleware: 'authenticated',   // 渲染前会先执行中间件
  data () {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tags: '',
      },
      publishing: false,
    }
  },
  methods: {
    async handleCreateArticle () {
      this.publishing = true;

      const {
        title,
        body,
        description,
        tags,
      } = this.article;

      const article = {
        title,
        body,
        description,
        tagList: tags.split(' '),
      }

      const { slug: oldSlug } = this.$route.params;
      let slug;
      if (!!oldSlug) {
        const { data }= await updateArticle(oldSlug, article);
        slug = data.article.slug;
      } else {
        const { data }= await createArticle(article);
        slug = data.article.slug;
      }

      this.publishing = false;

      // redirect to the the article page
      this.$router.push(`/article/${slug}`);
    }
  },
  async asyncData ({ params: { slug } }) {
    let data = {}
    if (!!slug) {
      const { data: { article } } = await getArticleDetails(slug);
      data = article;
      data.tags = article.tagList.join(' ');
    }

    return {
      article: { ...data },
    }    
  },
}
</script>

<style>

</style>