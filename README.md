# Realworld Nuxt
This is the `Nuxtjs` realworld app implementation for learning purpose. [resources](https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md)

**项目部署地址**
http://117.50.37.185:3000/

## 🚀 实现步骤
接下来是实现的详细步骤以及原理，每个section对应一个commit，可以到[commit](https://github.com/shunjizhan/realworld-nuxt/commits/main)里面根据序号可以查到具体的代码。

### 0) init
基本就是init一个nuxt项目，从resource里面拿到模板，设置到基本的routes，然后确保项目能跑起来，各个route能direct到相应的page。
### 1) login 和 register
- 基于axios封装两个函数login和register
- 在data()里面保存这个组件的state，包括username,password,email，然后通过v-model跟表单绑定在一起
- method里面加上表格onSubmit()，里面调用login或者register

### 2) SSR 保存登陆状态
注册或者登陆成功以后会返回user的data，包括登陆的token，我们需要把这些数据保存在cookie里面，这样刷新界面可以保持登陆状态。

同时我们的store里面储存了这个user的data，如果是SPA，就很方便，直接在渲染前把cookie中的data加进store就行了。但是SSR的话稍微麻烦一些，需要用到一个特殊的函数`nuxtServerInit`，在我们请求SSR的时候会在node里面调用这个函数，req里面会带上cookie，服务端就可以用这个cookie在SSR的时候调用store的commit把user data存进store里面

这个操作叫做`跨域身份验证 (JWT, jsonwebtoken)`

TODO: store是在服务端创建的，然后一起返回给客户端，还是在客户端创建的，只暴露了一个commit函数给服务端？
```ts
nuxtServerInit({ commit }, { req }) {}
```
看起来像是在客户端创建的，然后暴露一个commit的api给这个函数

### 3) 根据登陆状态处理导航显示和界面权限
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

### 4) 从article接口拿数据并显示
用getArticles()包装article的数据接口，在layout里面用asyncData()调用这个接口，就可以异步拿到article的数据。然后在laytout的模板里面直接使用这些数据,就能显示article的详情了。

### 5) 分页
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

### 6) 标签列表
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

### 7) tab query以及tab导航
接下来处理三种不同的tab:{ glob_feed, your_feed, tag },这三个tab分别对应不同的内容,他们都是同一个主页route里面的内容('/')，根据query里面tab的不同，在页面内显示不一样的内容。

首先在asyncData里面把query里面的tab和tag返回，传给组件。然后tab的导航就根据这些数据做成三个不同的链接。用v-if + user决定是否显示，:class动态类名来动态改变样式。

还要把各种nuxt-link的query更新一下，确保几个query共存的时候不会互相overwrite掉。比如tag=xxx的时候，点击页码，应该会导航到?tag=xxx&page=3

### 8) 统一设置用户token
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
TODO: token的话怎么处理token泄露的问题？因为直接是在request里面的，所以可以直接被黑客拿到。这个签名的解决方案有什么优劣？

### 9) 统一format日期
设置另一个plugin
```ts
// plugins/dayjs.js
Vue.filter('date', (value, format='YYYY.MM.DD') => {
  return dayjs(value).format(format);
});
```
这里等于创建了一个名为date的filter，然后在需要过滤的地方可以pipe这个filter
```html
<span class="data">
  {{ a.createdAt | date }}
</span>
```

### 10) 处理点赞
根据接口包装了两个函数addFavorite和deleteFavorite，然后给home增加一个处理点赞的方法
```ts
methods: {
  async onFavorite (article) {
    const { favorited, slug } = article;

    article.favoriteDisabled = true;
    if (favorited) {
      await deleteFavorite(slug);
      article.favorited = false;
      article.favoritesCount -= 1;
    } else {
      await addFavorite(slug);
      article.favorited = true;
      article.favoritesCount += 1;
    }
    article.favoriteDisabled = false;
  }
}
```
这里一个小技巧就是用article.favoriteDisabled来让按钮暂时无法点击，一直等到点赞请求返回以后，才设置回true，防止用户等待的时候重复点击。

### 11) 显示文章内容
- 封装一个接口getArticleDetails
- 然后在article index的asyncData()里面可以从params里面拿到slug
- 有了slug就调用接口拿到文章数据
- 用包转换成html的格式，因为要支持markdwon
- 用v-html注入模板

// TODO:如果想要SEO和首屏性能，就要放到asyncData()里面？为什么？

### 12) 显示文章meta
在文章界面，要两次显示文章meta，所以我们可以抽象出一个组件，然后把article data当做prop传给它，它会根据prop渲染。
- 我们在article/里面加入了components/article-meta,定义好模板和props。
- 然后在需要使用的home里面注册它，就可以在模板中使用并且传入article作为prop。

### 13) SEO 优化
为了优化SEO，我们可以给网页的head里面加上一些metadata，包括title，description等。这个可以用vue里面的head()来实现。
```ts
export default {
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
```

TODO: 本地测试似乎不会在网页上显示出来，但是查Vue的Article的组件是有$metaInfo的？

### 14) 显示comments
包装一个getComments接口，然后创建一个ArticleComments的组件。

因为我们不需要comments作为SEO，所以挂载之后在mounted里面aync拿comments，存到this.comments里面。需要用到的article.slug可以作为prop从父组件传过来。
### 15) 创建文章功能
包装一个createArticle接口，注意这里传入的文章数据不是params，而是body，所以在axios里面是用data，而不是用param。意思就是说我们这些data是内在传输的，直接POST /article接口，而不是POST /article?title=xxx&description=xxx...

在Editor组件里面，用v-model绑定几个文章数据，包括title，description等，然后submit的时候传进来就好。

submit以后，用`this.$router.push(`/article/${slug}`);`跳转到新建的文章界面。

### 16) 文章的更新和删除功能
包装好删除和更新的函数updateArticle和deleteArticle。

在article-meta组件里面选择一下，如果有user的换就显示delete和edit按钮。

delete按钮就直接调用deleteArticle。

edit的话要跳到/article/:slug，所以要更新一下route，让slug变成可选的
```ts
{
  name: 'editor',
  path: '/editor/:slug?', 
  component: resolve(__dirname, 'pages/editor/'),
},
```
然后在editor里面，可以通过this.$route.params拿到slug，slug如果不是undefined说明是create，如果有slug说明是edit。如果有slug的话，在asyncData()里面异步拿到文章的数据，覆盖之前的默认空的文章数据，同步到文本框里面，这样就可以实现edit之前的内容。

### 17) 添加评论和删除评论
包装了接口以后，提取一个公用的函数refreshcommments,这个函数在mounted，addcomment和deletecomment以后都调用一下。

### 18) Settings界面
UpdateUser跟之前的都差不多，就是mounted的时候fetch data，用v-model绑定表单数据。

logout的话就是从本地和vuex的store里面移除user，然后跳转
```ts
logout () {
  Cookie.remove('user');
  this.$store.commit('setUser', null);

  this.$router.push(`/`)
}
```


### 19) factor out AritclePreivew component
因为在profile里也需要article preview，跟home重复了，所以我们提炼一个AritclePreivew component出来，把article data当做 prop传给它能render。

记住一个component用另一个component的时候，要注册它
```ts
{
  components: {
    ArticlePreview,
  }
}
```

### 20) Profile界面
需要存两个user：
- 这个profile的user，可以根据mounted()里用this.$route.params.username调用包装好的getUserProfile
- 登陆的user，这个就用mapState从vuex里面拿就好

有两个不同的tab
- profile/:username
- profile/:username/:tab?   (tab只能是favorite)

在fetch data的时候，根据this.$route.params.tab判断是fetch user article还是fetch favorite article。

在切换tab的时候，只有route change，但是结果都是指向Profile这个component，所以不会重新触发mounted()，所以就不会重新拿数据。这里可以用到
```ts
watch: {
  // call again the method if the route changes
  '$route': 'refresh'
},
```
这样在this.$route变化的时候，会重新触发refresh()

还有一点注意就是在refresh里面不能并行async，因为要先拿到当前的profile user数据，再调用getUserProfile拿他的详细信息。
```ts
async refresh() {
  // 必须串行：先拿username，再fetch他的Article
  await this.fetchUserData();   
  await this.fetchArticles();
},
```

### 21) 订阅
略
（应该没啥新东西了，就是把api包装一下，给订阅按钮绑定一个事件就好）
## 🚀 打包和部署
**流程**
- 在nuxt config里面配置host + port，host是0.0.0.0，监听所有地址，host是3000，最后我们的项目地址就是http://117.50.37.185:3000/
- github账号创建一个token，然后放到项目的token里面，用来授权。
- 把服务器地址ssh需要的参数也加进项目的secrets里面，包括账号密码，ip等
- 添加.github/workflows/main.yml用来指导构建流程
  - 下载源码
  - 打包构建
  - 把构建结果发布 Release
  - ssh进服务器
    - wget下载最新的release
    - 解压
    - 安装依赖
    - 启动服务

**触发**
为当前commit创建一个tag并且触发github actions，因为main.yml中设置了只监听v*的commit
`git tag v0.1.0`
`git push origin v0.1.0`