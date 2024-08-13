<template>
  <NavigationBar size="larger" :isSlidedown="isSlidedown"/>
  <div class="main-wrapper">
    <!-- 左侧导航菜单 -->
    <div class="nav-left">
        <a href="/dynamic" class="left-item">
          <div class="icon_bg">
            <img src="http://localhost:5050/upload/2_1722942232066.jpg" alt=""> 
          </div>
          <span>动态</span>
        </a>
        <a href="/dynamic" class="left-item">
          <div class="icon_bg">
            <i class="iconfont icon-remen"></i>  
          </div>
          <span>热门</span>
        </a>
    </div>

    <!-- 右侧和中间内容容器 -->
    <div class="nav-content-wrapper">
        <!-- 中间导航菜单 -->
        <div class="nav-center">
            <a href="/bangumi" class="nav-item">番剧</a>
            <a href="/movie" class="nav-item">电影</a>
            <a href="/guochuang" class="nav-item">国创</a>
            <a href="/drama" class="nav-item">电视剧</a>
            <a href="/variety" class="nav-item">综艺</a>
            <a href="/doc" class="nav-item">纪录片</a>
            <a href="/animation" class="nav-item">动画</a>
            <a href="/game" class="nav-item">游戏</a>
            <a href="/kichiku" class="nav-item">鬼畜</a>
            <a href="/music" class="nav-item">音乐</a>
            <a href="/dance" class="nav-item">舞蹈</a>
            <a href="/film" class="nav-item">影视</a>
            <a href="/entertainment" class="nav-item">娱乐</a>
            <a href="/knowledge" class="nav-item">知识</a>
            <a href="/tech" class="nav-item">科技</a>
            <a href="/news" class="nav-item">资讯</a>
            <a href="/food" class="nav-item">美食</a>
            <a href="/life" class="nav-item">生活</a>
            <a href="/auto" class="nav-item">汽车</a>
            <a href="/fashion" class="nav-item">时尚</a>
            <a href="/sports" class="nav-item">运动</a>
            <a href="/animal" class="nav-item">动物圈</a>
            <a href="/vlog" class="nav-item">VLOG</a>
            <a href="/more" class="nav-item">更多</a>
        </div>

        <!-- 右侧功能菜单 -->
        <div class="nav-right">
            <a href="/column" class="feature-item"><span>专栏</span></a>
            <a href="/live" class="feature-item">直播</a>
            <a href="/live" class="feature-item">活动</a>
            <a href="/live" class="feature-item">课堂</a>
            <a href="/live" class="feature-item">社区中心</a>
            <a href="/live" class="feature-item">新歌热榜</a>
        </div>
    </div>
</div>
  <div class="recommended-container">
    <div class="container">
      <!-- 轮播图 -->
       <div class="recommended-swipe grid-anchor">
        <div class="recommended-swipe-container">
          <!-- 骨架图 -->
          <!-- 主体 -->
          <div class="recommended-swipe-body">
              <div class="carousel-area">
                  <CarouselIndex></CarouselIndex>
              </div>
          </div>
        </div>
       </div>
      <!-- 随机推荐 -->
      <div class="feed-card" v-for="index in loadingRandom ? 11 : randomVideos.length" :key="index">
        <div class="video-card">
          <!-- 骨架屏 -->
          <div class="video-card__skeleton" :class="loadingRandom ? '' : 'hide'">
            <div class="video-card__skeleton--cover"></div>
              <div class="video-card__skeleton--info">
                  <div class="video-card__skeleton--right">
                      <p class="video-card__skeleton--text"></p>
                      <p class="video-card__skeleton--text short"></p>
                      <p class="video-card__skeleton--light"></p>
                  </div>
              </div>
           </div>
           <!-- 主体内容 -->
           <div class="video-card__wrap" v-if="!loadingRandom">
            <div class="video-card-picture">
              <a :href="`/video/${randomVideos[index - 1].vid}`" target="_blank" >
                <img :src="randomVideos[index - 1].cover_url" :alt="randomVideos[index - 1].title">
              </a>
              <img :src="randomVideos[index - 1].cover_url" :alt="randomVideos[index - 1].title">
            </div>
            <div class="video-card-info">
              <div class="video-card-info--title">
                <h3>
                  <a :href="`/video/${randomVideos[index - 1].vid}`" target="_blank">{{randomVideos[index - 1].title}}</a>
                </h3>
              </div>
              <div class="video-card-info--bottom">
                <a href="" class="video-card-info--owner">
                  <i class="iconfont icon-UPzhu"></i>
                  <span class="video-card-info--auther"> {{randomVideos[index - 1].author}} </span>
                  <span class="video-card-info--data"> · {{formatDate(randomVideos[index - 1].upload_date)}}</span>
                </a>
              </div>
            </div>
           </div>
        </div>
      </div>
      <!-- 随机推荐结束 -->
    </div>
  </div>
  <!-- <button @click="test">123</button>
  <button @click="testa">123</button> -->
  <div class="abc"></div>
  
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue'
import CarouselIndex from '@/components/CarouselIndex.vue';
import requset from '@/utils/request'
import '@/assets/css/videocard.css'
// import request from '@/utils/request'

export default {
  components:{
      NavigationBar:NavigationBar,
      CarouselIndex:CarouselIndex,
  },
  data(){
    return{
      isSlidedown:false,
      loadingRandom:true,
      // 获取随机推荐视频列表
      randomVideos: [],
      videoSrc: 'https://player.bilibili.com/player.html?isOutside=true&aid=1506013917&bvid=BV1sS421o7gC&cid=1605417140&p=1' 
    }
  },
  mounted(){
    this.scrollListener = window.addEventListener('scroll', this.handleScroll);  
  },
  methods:{
    async getRandomVideos() {
            this.loadingRandom = true;
            const res = await requset.get("/api/getrandomvideos");
            console.log(res.data)
            if (res.data) {
                this.randomVideos = res.data;
                this.loadingRandom = false;
            }
            // console.log(this.randomVideos);
      },
    formatDate(uploadDate) {
      const today = new Date();
      const date = new Date(uploadDate);
      const timeDiff = today.getTime() - date.getTime();
      const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

      if (timeDiff < oneDay) {
        return '今天'; // Today
      } else if (timeDiff < 2 * oneDay) {
        return '昨天'; // Yesterday
      } else {
        // Format the date as "YYYY-MM-DD"
        // const year = date.getFullYear();
        const month = String(date.getMonth() + 1); // Months are zero-based
        const day = String(date.getDate());
        return `${month}-${day}`;
      }
    },
        
    handleScroll() {  
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;  
        if (this.timeoutId) {  
          clearTimeout(this.timeoutId);  
          this.timeoutId = null;
        }  
        // this.isSlidedown = scrollTop > 50; // 当滚动超过50px时，isSlidedown变为true 
        if (scrollTop > 50) {  
        this.timeoutId = setTimeout(() => {  
          this.isSlidedown = true;  
        }, 80);  
        } else {  
          // 如果需要，可以在这里处理滚动回顶部的情况  
          this.isSlidedown = false;  
        }
      } ,
      test(){
        if(!localStorage.getItem("userToken")) return
        const w = localStorage.getItem("userToken").split('.')[1];
        const info = JSON.parse(atob(w));
        console.log(info.uid)
      },
      async testa(){
        await this.$store.dispatch('getuserinfo')
        // const res = await request.get('/userinfo', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('userToken')}` // 将 token 添加到 Authorization 头
        //   },
        // });
        // if (!res) return;
        // console.log(res.data)
      }
  },
  created() {
        this.getRandomVideos();
    },
  
}
</script>


<style scoped>
  /* .abc{
    height: 10000px;
  } */
  .main-wrapper{
    width: 100%;
    height: 120px;
    padding: 0 140px;
    max-width: 2270px;
    display: flex;
    align-items: center;
    
  }

  .main-wrapper,.recommended-container{
    padding: 0 140px;
  }

    .nav-content-wrapper{
      width: 100%;
      display: flex;
    }
    /* 基本样式 */
    .nav-left{
      display: flex;
      margin-right: 20px;
    }

    .left-item{
      display: flex;
      flex-direction: column;
      margin-right: 25px;
    }

    .left-item .icon_bg{
      overflow: hidden;
      display: flex;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background-color:  #f07775;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
    }

    .left-item img{
      width: 100%;
      height: 100%;
    }

    .icon-remen{
      width: 25px;
      height: 25px;
      color: #fff;
      font-size: 25px;
      font-weight: 300;
    }

    .left-item span{
      font-size: 14px;
      line-height: 20px;
      color: #61666d;
      text-align: center;
    }

    /* 中间导航菜单的 grid 布局 */
    .nav-center {
        width: 100%;
        display: grid;
        grid-auto-flow: column;
        grid-gap: 10px; /* 项目间的间距 */
        /* grid-template-columns: repeat(2, 1fr); 两列布局 */
        grid-template-rows: repeat(2, 1fr); /* 两行布局，高度自适应 */
        padding-right: 30px;
        border-right: 1px solid #e3e5e7;
    }

    .nav-center .nav-item {
        align-items: center;
        justify-content: center;
        width: 100%; /* 使项目宽度适应网格列 */
        height: 30px; /* 根据需要调整高度 */
        box-sizing: border-box;
        border: 1px solid #f1f2f3;
        border-radius: 6px;
        background-color: #f6f7f8;
        color: var(--text2);
        text-align: center;
        font-weight: 400;
        line-height: 30px; /* 高度与行高一致 */
        transition: background-color .3s, color .3s;
    }




  /* Hover 和 Active 状态 */
  .nav-center .nav-item:hover, 
  .nav-center .nav-item.active {
      background-color: var(--graph_bg_thick);
      color: var(--text1);
  }

  .nav-right{
    padding-left: 30px;
    width: 258px;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 10px; /* 项目间的间距 */
    /* grid-template-columns: repeat(2, 1fr); 两列布局 */
    grid-template-rows: repeat(2, 1fr); /* 两行布局，高度自适应 */
  }

  .nav-right a{
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #61666d;
    text-align: center;
    font-weight: 400;
  }

  /* 视频推荐列表 */
  .recommended-container{
    width: 100%;
    height: 2000px;
  }
  .recommended-container .container{
    display: grid;
    width: 100%;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 20px;
  }

  .video-card-info--title{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box; /* 启用 flexbox 模型的旧版 */
    -webkit-box-orient: vertical; /* 设置主轴方向为垂直 */
    -webkit-line-clamp: 2; /* 设置显示的行数为 2 行 */
    line-clamp: 2;
    overflow: hidden; /* 隐藏溢出的文本 */
    text-overflow: ellipsis; /* 用省略号表示被截断的文本 */
  }

  .video-card-info--auther{
    margin-left: 3px;
  }

  .grid-anchor{
    grid-column: span 2; 
    grid-row: span 2;
  }

  .recommended-swipe-container{
    position: relative;
    width: 100%;
    height: 100%;
  }

  .recommended-swipe-body,.carousel-area{
    width: 100%;
    height: 86%;
  }

  .carousel-area{
    width: 100%;
    height: 100%;
  }
</style>
