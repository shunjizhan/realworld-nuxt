<template>
  <div class="settings-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Your Settings</h1>

        <form @submit.prevent="handleUpdate">
          <fieldset>
              <fieldset class="form-group">
                <input class="form-control" type="text" placeholder="URL of profile picture" v-model="user.image">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Your Name" v-model="user.username">
              </fieldset>
              <fieldset class="form-group">
                <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you" v-model="user.bio"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email" v-model="user.email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" placeholder="Password" v-model="user.password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" type="submit">
                Update Settings
              </button>
          </fieldset>
        </form>
      </div>

    </div>

    <button class="btn btn-outline-danger" @click="logout">
          Or click here to logout.
        </button>
  </div>
</div>

</template>

<script>
import {
  getUser,
  updateUser,
} from '@/api/user';

const Cookie = process.client
  ? require('js-cookie')
  : undefined

export default {
  name: 'Settings',
  middleware: 'authenticated',   // 渲染前会先执行中间件
  data () {
    return {
      user: {
        email: '',
        username: '',
        password: '',
        image: '',
        bio: '',
      }
    };
  },
  async mounted() {
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData () {
      const { data } = await getUser();
      this.user = data.user;
    },
    async handleUpdate () {
      const { data: { user: { username } } } = await updateUser(this.user);

      this.$router.push(`/profile/${username}`)
    },
    logout () {
      Cookie.remove('user');
      this.$store.commit('setUser', null);

      this.$router.push(`/`)
    }
  }
}
</script>

<style>

</style>