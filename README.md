# Realworld Nuxt
This is the `Nuxtjs` realworld app implementation for learning purpose.

[resources](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md)

接下来是实现的详细步骤以及原理，每个section对应一个commit，可以到[commit](https://github.com/shunjizhan/realworld-nuxt/commits/main)里面根据序号可以查到具体的代码。

## 0) init
基本就是init一个nuxt项目，从resource里面拿到模板，设置到基本的routes，然后确保项目能跑起来，各个route能direct到相应的page。
## 1) login 和 register
- 基于axios封装两个函数login和register
- 在data()里面保存这个组件的state，包括username,password,email，然后通过v-model跟表单绑定在一起
- method里面加上表格onSubmit()，里面调用login或者register

## 2) SSR 保存登陆状态
注册或者登陆成功以后会返回user的data，包括登陆的token，我们需要把这些数据保存在cookie里面，这样刷新界面可以保持登陆状态。

同时我们的store里面储存了这个user的data，如果是SPA，就很方便，直接在渲染前把cookie中的data加进store就行了。但是SSR的话稍微麻烦一些，需要用到一个特殊的函数`nuxtServerInit`，在我们请求SSR的时候会在node里面调用这个函数，req里面会带上cookie，服务端就可以用这个cookie在SSR的时候调用store的commit把user data存进store里面

这个操作叫做`跨域身份验证 (JWT, jsonwebtoken)`

TODO: store是在服务端创建的，然后一起返回给客户端，还是在客户端创建的，只暴露了一个commit函数给服务端？
```ts
nuxtServerInit({ commit }, { req }) {}
```
看起来像是在客户端创建的，然后暴露一个commit的api给这个函数

## 3) 根据登陆状态处理导航显示和界面权限
根据登陆状态，首先用mapstate拿到store里面的user，然后导航直接用v-if，v-else判断有没有user来显示不同的导航。

处理界面访问权限，在SPA中可以直接在routes里面设置导航拦截，但是只能在前端生效。想要在SSR中，前端后端都能生效的拦截，需要用到nuxt的middleware：
```ts
// middleware/authenticated.js
export default function ({ store, redirect }) {
  if (!store.state.user) {
    return redirect('/login');
  }
};
```
然后在想拦截的界面，加上middleware
```ts
export default {
  name: 'Editor',
  middleware: 'authenticated',   // 渲染前会先执行中间件
}
```

## 4) 从article接口拿数据并显示
用getArticles()包装article的数据接口，在layout里面用asyncData()调用这个接口，就可以异步拿到article的数据。然后在laytout的模板里面直接使用这些数据,就能显示article的详情了。

## 5) 分页
通过asyncData({ query })可以拿到query(page = xxx)，加上上一步拿到的article数据，我们可以：
- 给getArticles()传limit和offset参数，拿到当前页面的article data，而不需要拿到全部data
- 在computed里面计算总共有多少页，然后渲染出相应个数的的底部跳转链接。

默认情况下，query改变不会调用asyncData（为了提高性能）。如果要监听这个行为，可以用到watchQuery。
```ts
export default {
  watchQuery: ['page'],
}
```
这样在page参数改变的时候，asyncData会被重新调用更新数据，从而更新界面

## 6) 标签列表
跟拿articleData类似，我们写一个getTags()包装好tags的api，从这个接口拿tags数据，然后渲染到界面上。

#### 注意1
这里有一个优化操作，因为getTags()和getArticles()没有相互依赖的关系，所以可以让他们并行运行，加快速度。
```ts
const [articleData, tagData] = await Promise.all([
  getArticles({ ... }),
  getTags(),
]);

// 注意这里不能加await，否则还是会串行，因为getTags()返回一个promise，如果await它就会等它resolve才会继续运行
// 我们要先创建promise，让Promise.all来等它resolve，而不是在创建的时候就等它resolve
const [articleData, tagData] = await Promise.all([
  await getArticles({ ... }),   // wrong!!
  await getTags(),              // wrong!!
]);
```

#### 注意2
点击页码跳转的时候，我们应该要相同的tag query，所以在nuxt-link的:to里面，也要加上现在的tag
```html
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
```

## 7) tab query以及tab导航
接下来处理三种不同的tab:{ glob_feed, your_feed, tag },这三个tab分别对应不同的内容,他们都是同一个主页route里面的内容('/')，根据query里面tab的不同，在页面内显示不一样的内容。

首先在asyncData里面把query里面的tab和tag返回，传给组件。然后tab的导航就根据这些数据做成三个不同的链接。用v-if + user决定是否显示，:class动态类名来动态改变样式。

还要把各种nuxt-link的query更新一下，确保几个query共存的时候不会互相overwrite掉。比如tag=xxx的时候，点击页码，应该会导航到?tag=xxx&page=3

## 8) 统一设置用户token
和glob_feed不同，在请求your_feed的时候，header中需要带上用户的token，才能授权查询（以及知道是哪个用户）。解决办法：
- 我们可以在每个需要用户token的reques里面手动设置header，但是这样很费时费力，每次新加一个不同的请求就要加一次header
- 可以用请求拦截器统一添加header

拦截器就是在request里面做统一的操作，那怎么样才能从拦截器里面拿到用户的token呢？这里可以用到nuxt里面的plugin，在config里面设置以后，nuxt会自动调用plugin，并且把context传进来，我们就可以从context里面拿到所有需要的信息。

之前我们的utils/request是没有经过拦截器处理的，所以我们把所有用到request的地方统一换成plugin/request.js这个经过拦截器的request，然后拦截器就会在有user的情况下，自动加入header。

```ts
// plugin/request.js
export const request = axios.create({
  baseURL: 'https://conduit.productionready.io',
});

export default (context) => {
  const { user } = context.store.state;

  // 请求拦截器：任何请求都要经过它，可以做一个公共的业务处理，例如统一设置token
  request.interceptors.request.use(config => {
    if (user && user.token) {
      config.headers.Authorization = `Token ${ user.token }`;
    }

    return config;
  }, Promise.reject);
}
```

TODO: 似乎服务端渲染会出问题。跳转http://localhost:3000/?tab=your_feed的话是没问题的，但是刷新界面就会401.