export default {
  router: {
    extendRoutes(routes, resolve) {
      routes.splice(0);   // 清空基于pages/默认生成的路由表规则，方便重写
      routes.push(...[{
        name: 'home',
        path: '/',
        component: resolve(__dirname, 'pages/layout'),
        children: [
          {
            path: '', // 默认子路由
            component: resolve(__dirname, 'pages/home/'),
          },
          {
            name: 'login',
            path: '/login', 
            component: resolve(__dirname, 'pages/login/'),
          },
          {
            name: 'register',
            path: '/register', 
            component: resolve(__dirname, 'pages/login/'),
          },
          {
            name: 'profile',
            path: '/profile/:username', 
            component: resolve(__dirname, 'pages/profile/'),
          },
          {
            name: 'settings',
            path: '/settings', 
            component: resolve(__dirname, 'pages/settings/'),
          },
          {
            name: 'editor',
            path: '/editor', 
            component: resolve(__dirname, 'pages/editor/'),
          },
          {
            name: 'article',
            path: '/article/:slug', 
            component: resolve(__dirname, 'pages/article/'),
          },
        ],
      }])
    }
  }
}