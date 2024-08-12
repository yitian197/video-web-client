// axios.js

import axios from 'axios';
// import store from '@/store'; // 引入您的 Vuex store，路径根据实际情况调整

// 创建一个 Axios 实例
const instance = axios.create({
  baseURL: 'http://127.0.0.1:5050/', // 根据您的实际后端 API 地址进行配置
  timeout: 30000, // 请求超时时间设置为30秒
  withCredentials: true, // 跨域请求时是否携带凭证（例如 Cookie）
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，例如添加公共请求头
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求拦截器发生错误:', error);
    
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么，例如统一处理错误信息
    const code = response.data.code;
    if (code && code !== 200) {
        console.log(response.data.message)    }
    return response.data;
  },
  (error) => {
    // 对响应错误做些什么
    console.error('响应拦截器发生错误:', error);
    if (error.response && error.response.status === 401) {
      // 处理未授权错误，例如清除用户信息并跳转到登录页
    //   store.commit('logout'); // 假设您的 Vuex store 中有 logout mutation
      localStorage.removeItem('userToken');
      console.log('登录状态已过期，请重新登录')
    } else {
      console.log('网络异常，请稍后重试')
    }
    // return Promise.reject(error);
  }
  
);

instance.defaults.withCredentials = true;

export default instance;
