<template>
  <div class="auth-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
        <p class="text-xs-center">
          <nuxt-link v-if="isLogin" to="/register">Need an account?</nuxt-link>
          <nuxt-link v-else to="/login">Have an account?</nuxt-link>
        </p>

        <ul class="error-messages">
          <template v-for="(errDetails, errName) in errors">
            <li
              v-for="(e, idx) in errDetails"
              :key="idx"
            >
              {{ errName }}{{ e }}
            </li>
          </template>
        </ul>

        <form @submit.prevent="onSubmit">
          <fieldset v-if="!isLogin" class="form-group">
            <input 
              type="text"
              v-model="user.username"
              class="form-control form-control-lg"
              placeholder="Your Name"
              required
            >
          </fieldset>
          <fieldset class="form-group">
            <input
              type="email"
              v-model="user.email" 
              class="form-control form-control-lg"
              placeholder="Email"
              required
            >
          </fieldset>
          <fieldset class="form-group">
            <input
              type="password"
              v-model="user.password"
              class="form-control form-control-lg"
              placeholder="Password"
              minLength="8"
              required
            >
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">
            {{ isLogin ? 'Sign in' : 'Sign up' }}
          </button>
        </form>

      </div>

    </div>
  </div>
</div>
</template>

<script>
import {
  login,
  register,
} from '@/api/user';

export default {
  name: 'LoginIndex',
  computed: {
    isLogin () {
      return this.$route.name === 'login'
    },
  },
  data () {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      },
      errors: {},
    }
  },
  methods: {
    async onSubmit () {
      try {
        const { data } = this.isLogin
          ? await login({ user: this.user })
          : await register({ user: this.user })
  
        // TODO: 保存用户登陆状态
  
        // 跳转回首页
        // TODO: 为什么这里是$router，上面的$route
        // TODO: 为什么有些事key（比如computed，methods），有些是method，比如data（）
        this.$router.push('/');        
      } catch (e) {
        this.errors = e.response.data.errors;
      }
    }
  }
}
</script>

<style>

</style>