<template>
  <div class="search-user">
    <!-- 显示用户列表 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else>
      <div v-if="userList.length === 0" class="no-results">没有找到相关用户</div>
      <div v-else>
        <div class="itemlist">
            <div class="user-card" v-for="(user, index) in userList" :key="index">
              <div class="user-info-card flex_start">
                <div class="user-avatar">
                  <img :src="user.avatar_url || 'default-avatar.png'" alt="User Avatar">
                </div>
                <div class="user-content">
                  <h2 class="card-title">
                    <a :href="`/space/${user.username}`" target="_blank" class="user-name" :title="user.username">
                      {{ user.username }}
                    </a>
                  </h2>
                  <p class="card-fans">
                    {{ user.follower_count }}粉丝
                  </p>
                  <button @click="toggleFollow(user)" :class="['follow-btn', user.isFollowing ? 'following' : '']">
                    {{ user.isFollowing ? '+ 关注' : '已关注' }}
                  </button>
                </div>
              </div>
          </div>
        </div>
        
      </div>
    </div>

    <!-- 分页 -->
    <!-- <div class="search-bottom flex_center" v-if="totalUsers > 30">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalUsers"
        :page-size="30"
        :pager-count="7"
        :current-page="page"
        @current-change="pageChange"
      ></el-pagination>
    </div> -->
  </div>
</template>


<script>
import axios from 'axios';
const token = localStorage.getItem('userToken');

export default {
  name: "SearchUser",
  data() {
    return {
      page: 1,
      userList: [],
      loading: true,
      totalUsers: 0,
      keyword: this.$route.query.keyword || '',  // 从路由中获取 keyword
    };
  },
  watch: {
    '$route.query.keyword'(newKeyword) {
      this.keyword = newKeyword || '';
      this.fetchUsers();
    }
  },
  methods: {
    async fetchUsers() {
      if (!this.keyword) return;
      this.loading = true;
      console.log('发送搜索用户请求');
      
      try {
        const response = await axios.get('http://127.0.0.1:5050/search/user',{
          params: {
            keyword: this.keyword,
            page: this.page,
          },
            headers: {
              'Authorization': `Bearer ${token}` // 将 Token 放入请求头
            }
        });

        if (response.data.status === 100 ) {
          console.log('用户搜索请求成功');
          console.log(response.data.data);
          this.userList = response.data.data;
          this.totalUsers = response.data.total || 0; // 确保在后端返回总数
        } else if (response.data.status === 404){
          console.log('用户搜索请求成功,找不到相关用户');
          this.userList = [];
          this.totalUsers = 0;
        }else{
          this.userList = [];
          this.totalUsers = 0;
        }
      } catch (error) {
        console.error('搜索请求失败:', error);
        this.userList = [];
        this.totalUsers = 0;
      } finally {
        this.loading = false;
      }
    },

    pageChange(page) {
      this.page = page;
      this.fetchUsers();
    },

    async toggleFollow(user) {
      try {
        await axios.post('http://127.0.0.1:5050/follow',
         {
          follower_uid: this.$store.state.user.uid,
          followed_uid: user.uid,
        },
         {
          headers: {
            'Authorization': `Bearer ${token}` // 将 token 添加到请求头
          }
        }
      );
        user.isFollowing = !user.isFollowing;
      } catch (error) {
        console.error('操作失败:', error);
      }
    },
  },
  mounted() {
    this.fetchUsers();  // 组件加载时自动发起搜索请求
  },
};
</script>



<style scoped>
.search-user {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 卡片之间的间距 */
}

.itemlist{
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 卡片之间的间距 */
  padding: 0 96px;
}

.user-card {
  padding: 15px;
  width: 530px; /* 固定卡片宽度 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 卡片阴影 */
  /* Ensure card height is at least a certain value to keep content vertically aligned */
  min-height: 150px;
}

.user-info-card {
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: 20px; /* 头像和名字之间的间距 */
}

.user-avatar img {
  width: 100px; /* 更大的头像 */
  height: 100px;
  border-radius: 50%; /* 圆形头像 */
  object-fit: cover; /* 确保图片不会变形 */
}

.user-content {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text1);
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text1);
  text-decoration: none;
}

.user-name:hover {
  color: var(--brand_pink);
}
.card-fans{
  color: grey;
}

.no-results, .loading {
  text-align: center;
  font-size: 16px;
  color: var(--text2);
}

.follow-btn {
  background-color: grey; 
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

/* 已关注按钮的样式 */
.follow-btn.following {
  background-color: #00aeec; 
  color: white;
}

</style>
