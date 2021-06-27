## login 和 register
- 基于axios封装两个函数login和register
- 在data()里面保存这个组件的state，包括username,password,email，然后通过v-model跟表单绑定在一起
- method里面加上表格onSubmit()，里面调用login或者register

## SSR 保存登陆状态
注册或者登陆成功以后会返回user的data，包括登陆的token，我们需要把这些数据保存在cookie里面，这样刷新界面可以保持登陆状态。

同时我们的store里面储存了这个user的data，如果是SPA，就很方便，直接在渲染前把cookie中的data加进store就行了。但是SSR的话稍微麻烦一些，需要用到一个特殊的函数`nuxtServerInit`，在我们请求SSR的时候会在node里面调用这个函数，req里面会带上cookie，服务端就可以用这个cookie在SSR的时候调用store的commit把user data存进store里面

这个操作叫做`跨域身份验证 (JWT, jsonwebtoken)`