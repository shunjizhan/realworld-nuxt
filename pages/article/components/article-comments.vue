<template>
  <div>
    <form class="card comment-form" @submit.prevent="handleComment">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="commentBody"></textarea>
      </div>
      <div class="card-footer">
        <img :src="article.author.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" type="submit">
          Post Comment
        </button>
      </div>
    </form>

    <div
      class="card"
      v-for="c in comments"
      :key="c.id"
    >
      <div class="card-block">
        <p class="card-text">{{ c.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: c.author.username,
          }
        }">
          <img :src="c.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link class="comment-author" :to="{
          name: 'profile',
          params: {
            username: c.author.username,
          }
        }">
          {{ c.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ c.createdAt | date }}</span>
        <span v-if="user.username === c.author.username" class="mod-options">
          <i @click="removeComment(c.id)" class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getComments,
  postComments,
  deleteComments,
} from '@/api/article';
import { mapState } from 'vuex';

export default {
  name: 'ArticleComments',
  data () {
    return {
      comments: [],
      commentBody: '',
    }
  },
  computed: {
    ...mapState(['user']),
  },
  async mounted () {
    await this.refreshComments();
  },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async refreshComments () {
      const { data } = await getComments(this.article.slug);
      this.comments = data.comments;
    },
    async handleComment () {
      const comment = { body: this.commentBody };
      await postComments(this.article.slug, comment);
      this.commentBody = '';

      await this.refreshComments();
    },
    async removeComment (id) {
      await deleteComments(this.article.slug, id);

      await this.refreshComments();
    }
  }
}
</script>

<style>

</style>