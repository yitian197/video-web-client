<template>
    <div class="videoDetail">
      <NavigationBar :isFixHeaderBar="true"></NavigationBar>
      <div class="video-container">
        <div class="left-container">
          <div class="video-info-container">
            <div class="video-info-title">
              <h1>{{ video.title }}</h1>
            </div>
          </div>
          
          <div ref="player" class="dplayer-container"></div>
          <!-- <button @click="test">text</button> -->
          <div class="left-container-under-player">
            <div class="video-desc-container">
              <div class="basic-desc-info">
                <span class="desc-info-text">{{ video.descr }}</span>
              </div>
            </div>
            <div class="video-tag-container">
              <div class="tag-panel">
                <div class="firstchannel-tag tag">
                  <a href="#" class="tag-link">{{ video.mcName }}</a>
                </div>
                <div class="secondchannel-tag tag">
                  <a href="#" class="tag-link">{{ video.scName }}</a>
                </div>
                <div class="tag" v-for="(item, index) in tags" :key="index">
                  <a :href="`/search/all?keyword=${item}`" target="_blank" class="tag-link">{{ item }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-container">
          <div class="up-info-container">
            <div class="up-info--left">
              <div class="up-avatar-wrap">
                <a :href="`/space/${user.uid}`">
                  <Avatar :size="48" :imgurl="user.avatar_url"></Avatar>
                </a>
              </div>
            </div>
            <div class="up-info--right">
              <div class="up-info__detail">
                <div class="up-detail">
                  <div class="up-detail-top">
                    <a :href="`/space/${user.uid}`" target="_blank" class="up-name">{{ user.username }}</a>
                  </div>
                  <div class="up-description up-detail-bottom">{{ user.description }}</div>
                </div>
              </div>
              <div class="up-info-btn-panel">
                <button @click="toggleFollow(user)" :class="['follow-btn', user.isFollowing ? 'following' : '']">
                    {{ user.isFollowing ? '+ 关注' : '已关注' }}
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import NavigationBar from '@/components/NavigationBar.vue';
  import Avatar from "@/components/YAvatar.vue";
  import requset from '@/utils/request';
  import DPlayer from 'dplayer';  
  
  export default {
    components: {
      NavigationBar,
      Avatar
    },
    data() {
      return {
        video:{},
        user:{},
        tags:[],
        dp:null,
      };
    },
    methods: {
      async getVideoDetail() {
        try {
          const res = await requset.get('/api/getvideo', {
            params: {
              vid: this.$route.params.vid
            },
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("userToken")}` // 将 token 添加到请求头
            }
          });
          console.log(res.status)
          if (res.status == 0) {
            this.video = res.data.video; // 更新 videoUrl
            this.user = res.data.user
            this.tags = res.data.video.tags.split("\n").filter(tag => tag.trim() !== "");
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
      async toggleFollow(user) {
        try {
          await requset.post('/follow',
          {
            follower_uid: this.$store.state.user.uid,
            followed_uid: user.uid,
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("userToken")}` // 将 token 添加到请求头
            }
          }
        );
          user.isFollowing = !user.isFollowing;
        } catch (error) {
          console.error('操作失败:', error);
        }
      },
      test(){
        console.log(this.video)
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
      height: 636px;
      width: 1130px;
      box-shadow: 0 0 8px #cacaca;
    }

    .video-container{
      max-width: 2540px;
      min-width: 1080px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      box-sizing: content-box;
      position: relative;
    }


    .right-container{
      width: 411px;
      flex: none;
      margin-left: 30px;
      position: relative;
    }

    .video-info-container{
      height: 108px;
      padding-top: 22px;
    }

    .video-info-title{
      display: flex;
      align-items: center;
      overflow: hidden;
      position: relative;
    }

    .video-info-title h1{
      font-size: 22px;
      line-height: 34px;
      flex-shrink: 0;
      font-weight: 500;
      color: var(--text1);
      line-height: 28px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .up-info-container{
      box-sizing: border-box;
      height: 104px;
      display: flex;
      align-items: center;
    }

    .up-info--right{
      margin-left: 12px;
      flex: 1;
      overflow: auto;
    }

    .up-avatar-wrap{
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .up-name{
      color: #000;
      font-weight: 500;
      font-size: 16px;
    }

    .up-name:hover{
      color:#00aeec ;
    }

    .up-description{
      color: #9499a0;
      font-size: 14px;
      height: 16px;
      line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .up-info-btn-panel{
      display: flex;
      margin-top: 5px;
    }

    .follow-btn {
      background-color: grey; 
      color: white;
      width: 200px;
      border: none;
      padding: 5px 20px;
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

    /* 简介 */
    .video-desc-container{
      margin: 18px 0;
    }

    .desc-info-text{
      /* font-size: 16px; */
      /* line-height: 26px; */
      white-space: pre-line;
      letter-spacing: 0;
      color: #18191c;
      font-size: 15px;
      line-height: 24px;
      overflow: hidden;
    }

    /* 标签 */
    .video-tag-container{
      margin-top: 18px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e3e5e7;
    }

    .tag-panel{
      overflow: hidden;
    }

    .tag{
      float: left;
      margin: 0 12px 8px 0;
    }

    .tag-link{
      height: 32px;
      line-height: 32px;
      border-radius: 16px;
      font-size: 14px;
      color: #61666d;
      background: #f1f2f3;
      height: 28px;
      line-height: 28px;
      border-radius: 14px;
      font-size: 13px;
      padding: 0 12px;
      box-sizing: border-box;
      transition: all .3s;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }
  </style>
  