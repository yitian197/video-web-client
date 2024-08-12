<template>
  <div v-if="showModal" class="auth-modal-container">
    <div class="left"></div>
    <div class="auth-modal">
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      <form @submit.prevent="handleSubmit">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" required />

        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />

        <button type="submit">{{ isLogin ? '登录' : '注册' }}</button>
      </form>
      <p>
        {{ isLogin ? '还没有账户？' : '已有账户？' }}
        <a href="#" @click.prevent="toggleForm">{{ isLogin ? '去注册' : '去登录' }}</a>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLogin: true,
      username: '',
      password: '',
      showModal: true,
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
    },
    async handleSubmit() {
      console.log('发送')
      try {
        const url = this.isLogin
          ? 'http://127.0.0.1:5050/api/login'
          : 'http://127.0.0.1:5050/api/reguser';

        const response = await axios.post(url, {
          username: this.username,
          password: this.password,
        });

        if (response.data.status === 100) {
          localStorage.setItem('userToken', response.data.token);
          console.log(this.isLogin ? '登录成功！' : '注册成功！');

          const userInfoResponse = await axios.get('http://127.0.0.1:5050/user/userinfo', {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          });

          if (userInfoResponse.data.status === 200) {
            this.$store.commit('setLoginStatus', true);
            this.$store.commit('updateUser', userInfoResponse.data.data);
            this.$emit("loginSuccess");
            this.closeModal();
          } else {
            console.error('获取用户信息失败：', userInfoResponse.data.message || '未知错误');
          }
        } else {
          console.error('操作失败：', response.data.message || '未知错误');
        }
      } catch (error) {
        console.error('请求出错：', error);
      }
    },
  },
};
</script>

<style scoped>
.auth-modal-container {
  display: flex;
  width: 100%;
  height: 100%;
}
.left{
  margin-right: auto;
}

.auth-modal {
  float: right;
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  width: 300px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin: 10px 0 5px;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

p {
  margin-top: 10px;
  text-align: center;
}

a {
  color: #007bff;
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}
</style>
y