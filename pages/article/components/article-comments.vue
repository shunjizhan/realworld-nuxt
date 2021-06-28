<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">
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
          <i class="ion-edit"></i>
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments } from '@/api/article';
import { mapState } from 'vuex';

export default {
  name: 'ArticleComments',
  data () {
    return {
      comments: [],
    }
  },
  computed: {
    ...mapState(['user']),
  },
  async mounted () {
    const { data } = await getComments(this.article.slug);
    this.comments = data.comments;
  },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style>

</style>