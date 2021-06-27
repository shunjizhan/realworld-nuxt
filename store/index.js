const cookieparser = process.server
  ? require('cookieparser')
  : undefined 

// 在服务端运行都是同一个实例
// 定义成函数可以防止数据冲突，每次都是返回同一个状态
export const state = () => {
  return {
    user: null,
  }
};

export const mutations = {
  setUser (state, user) {
    state.user = user;
  }
};

export const actions = {
  // 特殊的action，这个action会在服务端渲染期间自动调用，也只在服务端调用
  // 作用：初始化容器数据，传递数据给客户端使用
  nuxtServerInit({ commit }, { req }) {
    // req就是从客户端发过来的服务端渲染的请求，会把cookie传过来
    let user = null

    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }

    // 提交mutation修改store状态
    commit('setUser', user)
  }
};
