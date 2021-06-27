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
