<template>
    <div class="search-video">
      <!-- 显示视频列表 -->
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else>
        <div v-if="videoList.length === 0" class="no-results">没有找到相关视频</div>
        <div v-else>
          <div class="video-card" v-for="(video, index) in videoList" :key="index">
            <div class="video-info-card flex_start">
              <div class="video-content">
                <h2 class="card-title">
                  <a :href="video.video_url" target="_blank" class="video-name" :title="video.video_name">
                    {{ video.video_name }}
                  </a>
                </h2>
                <div class="video-details">
                  <p>上传时间: {{ new Date(video.upload_time).toLocaleDateString() }}</p>
                  <p>点赞量: {{ video.likes }}</p>
                  <p>播放量: {{ video.views }}</p>
                  <p>评论量: {{ video.comments }}</p>
                  <p>作者: {{ video.author }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 分页 -->
      <!-- <div class="search-bottom flex_center" v-if="totalVideos > 30">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalVideos"
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
  
  export default {
    name: "SearchVideo",
    data() {
      return {
        page: 1,
        videoList: [],
        loading: true,
        totalVideos: 0,
        keyword: this.$route.query.keyword || '',  // 从路由中获取 keyword
      };
    },
    watch: {
      '$route.query.keyword'(newKeyword) {
        this.keyword = newKeyword || '';
        this.fetchVideos();
      }
    },
    methods: {
      async fetchVideos() {
        if (!this.keyword) return;
  
        this.loading = true;
        console.log('发送搜索视频请求');
        try {
          const response = await axios.get('http://127.0.0.1:5050/search/all', {
            params: {
              keyword: this.keyword,
              page: this.page,
            }
            
          });
  
         if (response.data.status === 100) {
            console.log('视频搜索请求成功');
            console.log(response.data.data);
            this.videoList = response.data.data; // 根据实际 API 响应结构调整
            this.totalVideos = response.data.total || 0; // 确保在后端返回总数
         } else if (response.data.status === 404){
            console.log('视频搜索请求成功,无相关视频');
            this.videoList = [];
            this.totalVideos = 0;
         }else{
            this.videoList = [];
            this.totalVideos = 0;
         }
        } catch (error) {
          console.error('搜索请求失败:', error);
          this.videoList = [];
          this.totalVideos = 0;
        } finally {
          this.loading = false;
        }
      },
  
      pageChange(page) {
        this.page = page;
        this.fetchVideos();
      },
    },
    mounted() {
      this.fetchVideos();  // 组件加载时自动发起搜索请求
    },
  };
  </script>
  
  <style scoped>
  .search-video {
    padding: 20px;
  }
  
  .video-card {
    margin-bottom: 20px;
  }
  
  .video-info-card {
    display: flex;
    align-items: center;
  }
  
  .video-content {
    display: flex;
    flex-direction: column;
  }
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text1);
  }
  
  .video-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--text1);
    text-decoration: none;
  }
  
  .video-name:hover {
    color: var(--brand_pink);
  }
  
  .no-results, .loading {
    text-align: center;
    font-size: 16px;
    color: var(--text2);
  }
  
  .search-bottom {
    margin: 20px 0;
  }
  </style>
  