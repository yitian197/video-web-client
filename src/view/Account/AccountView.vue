<template>
  <NavigationBar/>
  <div class="account-layout">
    <div class="top-header">
      <img class="top-img" src="@/assets/rl_top.png" alt="">
    </div>
    <div class="account-container">
      <div class="account-left">
        <span class="account-title">个人中心</span>
        <ul class="account-list" >
          <li class="account-item" @click="clickBarItem(navList[0].path, 0)">
            <span>首页</span>
          </li>
          <li class="account-item" @click="clickBarItem(navList[1].path, 1)">
            <span>个人信息</span>
          </li>
          <li class="account-item" @click="clickBarItem(navList[2].path, 2)">
            <span>头像</span>
          </li>
          <li class="account-item" @click="clickBarItem(navList[3].path, 3)"> 
            <span>安全中心</span>
          </li>
        </ul>
      </div>
      <div class="account-right">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <!-- <div class="profile-container">
    <h1>个人信息</h1>
    <div class="profile-header">
      <img :src="user.avatar_url" alt="用户头像" class="profile-avatar" />
      <button @click="triggerFileInput">更改头像</button>
      <input type="file" ref="fileInput" @change="uploadAvatar" style="display: none;" />
    </div>
    <label>uid:{{ user.uid }}</label>
    <p></p>
    <form @submit.prevent="saveChanges" class="profile-info-form">
      <label for="username">用户名:</label>
      <input type="text" v-model="user.username" id="username" />

      <label for="email">邮箱:</label>
      <input type="email" v-model="user.email" id="email" />

      <label for="password">密码:</label>
      <input type="password" v-model="user.password" id="password" />

      <button type="submit">保存更改</button>
    </form>
    <div class="profile-stats">
      <h2>关注者和粉丝</h2>
      <div class="stats">
        <div class="followers">
          <h3>关注者</h3>
          <ul>
            <li v-for="follower in followers" :key="follower">{{ follower }}</li>
          </ul>
        </div>
        <div class="following">
          <h3>我关注的人</h3>
          <ul>
            <li v-for="follow in following" :key="follow">{{ follow }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import axios from 'axios';
import NavigationBar from '@/components/NavigationBar.vue'

export default {
  components:{
      NavigationBar:NavigationBar,
  },
  data() {
    return {
        // 导航栏列表
        navList: [
            { name: "首    页", path: '/account/home' },
            { name: "我的信息", path: '/account/info' },
            { name: "我的头像", path: '/account/avatar' },
            { name: "账号安全", path: '/account/security' },
        ],
        activeIdx: 0,
    }
  },
  methods: {
    clickBarItem(path, index) {
      this.activeIdx = index;
      this.$router.push(path);
    },
    async saveChanges() {
      const token = localStorage.getItem('userToken');
      try {
        const response = await axios.put('http://127.0.0.1:5050/update/user', this.user, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Use response data here if needed
        console.log('服务器返回的响应:', response.data);
        alert('用户信息保存成功');
      } catch (error) {
        console.error('保存用户信息失败', error);
        alert('保存用户信息失败');
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async uploadAvatar(event) {
      const file = event.target.files[0];
      console.log(file)
      const token = localStorage.getItem('userToken');
      console.log(token)
      if (!file) {
        alert('请选择一个文件');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file); // 字段名称应与 Multer 配置一致
      for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
      }
      try {
        const response = await axios.post('http://127.0.0.1:5050/update/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` // 添加认证头部
          }
        });

        // 更新用户头像 URL
        this.user.avatar = response.data.avatarUrl;
        alert('头像上传成功');
      } catch (error) {
        console.error('上传头像失败', error);
        alert('头像上传失败');
      }
    }
  },
  computed:{
    user() {
      return this.$store.state.user;
    },
  }
};
</script>

<style scoped>
  .account-layout {
    position: relative;
  }

  .top-header {
    width: 100%;
    height: 106px;
    background: url('@/assets/rl_bp.png') repeat-x;
  }

  .top-img{
    width: 980px;
    height: 106px;
    margin: 0 auto;
    background: url('@/assets/rl_top.png') no-repeat;
  }

  .top-img img {
    height: 60px;
    transform: translateY(15px);
  }

  .account-container {
    overflow: hidden;
    width: 980px;
    height: 100%;
    margin: 10px auto 0;
    border: 1px solid #e1e2e5;
    box-shadow: 0 2px 4px rgba(0,0,0,.14);
    background: #fafafa;
    border-radius: 4px;
    display: flex;
  }
  .account-left {
    float: left;
    width: 150px;
    height: 100%;
    overflow: hidden;
  }

  .account-title {
      display: block;
      width: 150px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 16px;
      color: #99a2aa;
      cursor: default;
  }

  .account-title, .account-list {
      border-bottom: 1px solid #e1e2e5;
  }

  .account-list li {
      overflow: hidden;
  }

  .account-item {
      width: 150px;
      height: 48px;
      line-height: 48px;
      display: flex;
      align-items: center;
      color: var(--text1);
      fill: var(--text3);
      cursor: pointer;
  }

  .account-right {
    float: left;
    width: 829px;
    border-left: 1px solid #ddd;
    background: #fff;
    min-height: calc(100vh - 232px);
  }
</style>
