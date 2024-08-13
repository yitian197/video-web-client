<template>
    <div class="videoDetail">
      <NavigationBar :isFixHeaderBar="true"></NavigationBar>
      <h1>{{ video.title }}</h1>
      <div ref="player" class="dplayer-container"></div>
    </div>
  </template>
  
  <script>
  import NavigationBar from '@/components/NavigationBar.vue';
  import requset from '@/utils/request';
  import DPlayer from 'dplayer';  
  
  export default {
    components: {
      NavigationBar
    },
    data() {
      return {
        video:{},
        dp:null,
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
            this.initPlayer(); // 数据更新后初始化播放器
          } else {
            this.$router.push("/notfound");
          }
        } catch (error) {
          console.error('获取视频详情失败:', error);
          this.$router.push("/notfound");
        }
      },
      initPlayer() {
        this.dp = new DPlayer({
          container: this.$refs.player,
          lang:'zh-cn',
          preload: 'auto',
          video: {
            url: this.video.video_url,
          },
          danmaku: { 
              id: this.video.vid || this.$route.params.vid,
              user:this.$store.state.user.uid || 'default',
              api: 'http://127.0.0.1:5050/api/',
              token: 'tokendemo',   
          },
          mutex:true,
        });  
        const player = this.dp ;   
        player.on('play', () => {
          this.$refs.player.classList.add('dplayer-playing');
          this.$refs.player.classList.remove('dplayer-paused');
        });

        player.on('pause', () => {
          this.$refs.player.classList.remove('dplayer-playing');
        });
        Object.keys(player.events).forEach(eventType => {
          if (eventType === 'events') {
            return;
          }
          
          player.events[eventType].forEach(event => {
            player.on(event, () => {
              this.$emit(event);
            });
          });
        });
      },
      test(){
        this.dp.play()
      },
    },
    mounted(){
      this.initPlayer();
    },
    async created() {
      await this.getVideoDetail();
    },
    // watch: {
    //     video(newUrl) {
    //       if (newUrl) {
    //         this.$nextTick(() => {
    //           const video = this.$refs.videoPlayer;
    //           if (video) {
    //             video.load(); // 重新加载视频
    //             video.play().catch(error => console.error('播放视频错误:', error));
    //           }
    //         });
    //       }
    //     }
    // }
  };
  </script>
  
  <style scoped>
    .dplayer-container{
      height: 400px;
      width: 800px;
    }
  </style>
  