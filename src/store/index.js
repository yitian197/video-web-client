import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: {},
    isLogin: false,
    channels: [],
  },
  mutations: {
    initData(state){
      state.user = {};
      state.isLogin = false;
    },
    updateUser(state, user) {
      state.user = user;
      // console.log("更新vuex中用户信息: ", state.user);
    },
    setLoginStatus(state, status) {
      state.isLogin = status;
    },
    updateChannels(state, channels) {
      state.channels = channels;
      // console.log("vuex中的分区: ", state.channels);
    },
  },
  actions: {
    async getuserinfo(context){
      console.log('获取用户信息')
      // 这里为了更方便捕捉到错误后做出反应，就不使用封装的函数了
        const result = await axios.get("http://127.0.0.1:5050/user/userinfo", {
          headers: {
              Authorization: "Bearer " + localStorage.getItem("userToken"),
          },
      })
          .catch(() => {
              // 一般这里捕抓到异常就表示token失效了，所以直接清空浏览器缓存就好了，不需要调用退出函数了
              context.commit("initData");
              // 清除本地token缓存
              localStorage.removeItem("userToken");
              console.log('请登录')
          });
      if (!result) return;
      if (result.data.status === 200) {
        console.log('获取成功',result.data.data)
          context.commit("updateUser", result.data.data);
          context.state.isLogin = true;
      }
    },
    logout() {
      localStorage.removeItem("userToken");
    },
  },
  getters: {
    user: state => state.user,
    isLogin: state => state.isLogin,
  },
});