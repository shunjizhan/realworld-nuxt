export default {
  router: {
    extendRoutes(routes, resolve) {
      routes.splice(0);   // 清空基于pages/默认生成的路由表规则，方便重写
      routes.push(...[{
        name: '/',
        path: '*',
        component: resolve(__dirname, 'pages/layout'),
        children: [
          {
            path: '', // 默认子路由
            name: 'home',
            component: resolve(__dirname, 'pages/home/'),
          }
        ],
      }])
    }
  }
}