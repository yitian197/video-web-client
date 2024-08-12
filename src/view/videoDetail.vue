<template>
    <div class="videoDetail">
      <NavigationBar :isFixHeaderBar="true"></NavigationBar>
      <h1>{{ video.title }}</h1>
      <div class="video-container">
        <video controls ref="videoPlayer">
          <source :src="video.video_url" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </template>
  
  <script>
  import NavigationBar from '@/components/NavigationBar.vue';
  import requset from '@/utils/request';
  
  export default {
    components: {
      NavigationBar
    },
    data() {
      return {
        video:{}
      };
    },
    methods: {
      async getVideoDetail() {
        try {
          const res = await requset.get('/api/getvideo', {
            params: {
              vid: this.$route.params.vid
            }
          });
  
          if (res.data && res.data.length > 0) {
            this.video = res.data[0]; // 更新 videoUrl
          } else {
            this.$router.push("/notfound");
          }
        } catch (error) {
          console.error('获取视频详情失败:', error);
          this.$router.push("/notfound");
        }
      }
    },
    async created() {
      await this.getVideoDetail();
    },
    watch: {
        video(newUrl) {
        if (newUrl) {
          this.$nextTick(() => {
            const video = this.$refs.videoPlayer;
            if (video) {
              video.load(); // 重新加载视频
              video.play().catch(error => console.error('播放视频错误:', error));
            }
          });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .video-container {
    position: relative;
    width: 1080px; /* 设置视频宽度 */
  }
  
  video {
    width: 100%; /* 让视频宽度自适应容器 */
    display: block;
  }
  </style>
  