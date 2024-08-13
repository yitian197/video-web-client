<template>  
  <div>
    <div :class="['navigation',size]">  
      <div :class="['nav-bar',{ 'slide-down': isSlidedown}]">
        <ul class="nav-left">  
          <div class="entry-title" v-if="size=='larger'&&!isSlidedown">
            <a href="/home">
              <i class="iconfont icon-xiaodianshi-line"></i>
              <span>首页</span>
            </a>
          </div>
          <div class="left-entry-title" v-else>
            <a href="/home">
              <i class="iconfont icon-bilibili"></i>
              <div>
                <span>首页</span>
                <i class="iconfont icon-xiajiantou-copy"></i>
              </div>
            </a>
          </div>
          <li>
            <a href="pagea" target="_blank">
              <span>番剧</span>
            </a>
          </li>  
          <li>
            <a href="#">
              <span>直播</span>
            </a>
          </li>  
          <li>
            <a href="#">
              <span>游戏中心</span>
            </a>
          </li>  
          <li>
            <a href="#">
              <span>会员购</span>
            </a>
          </li>  
          <li>
            <a href="#">
              <span>漫画</span>
            </a>
          </li>  
          <li>
            <a href="#">
              <span>赛事</span>
            </a>
          </li>  
          <li>
            <a href="#">
              <span>奥运会</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="iconfont icon-xiazai"></i>
              <span>下载客户端</span>
            </a>
          </li>   
        </ul>  
        <div class="nav-center" :style="isShowSearchInput ? '' : 'display: none;'">  
          <div :class="['search_bar',{ 'isfocus': isFocused}]" ref="searchBar">
              <div action="" :class="['search_form',{ 'isfocus': isFocused},{'isactivied':isactivied}]">
                <div class="search_content">
                  <input  
                    type="text"  
                    class="search_input"  
                    placeholder="请输入搜索内容"
                    v-model="searchInput"
                    @keyup.enter="goSearch"
                    @focus="handleBoth(true)"  
                    @blur="handleActivied(false)"  
                  >  
                </div>
                <div class="search_btn" @click="goSearch">
                  <i class="iconfont icon-sousuo"></i>
                </div>
              </div>
              <div class="search_panel">
                <div class="history" v-if="history.length > 0" style="max-width: 498px;">
                  <div class="header">
                    <div class="title">搜索历史</div>
                    <div class="clear" @click.stop="clearItem()">清空</div>
                  </div>
                  <div class="history-wrap" :style="isHistoryOpen ? 'max-height: 171px;' : 'max-height: 91px;'">
                    <div class="histories" style="max-width: 498px;">
                       <div class="history-item" v-for="(item,index) of history" :key="index" @click.stop="clickItemToSearch(item)">
                          <div class="history-text">{{ item }}</div>
                          <div class="close" @click.stop="removeItem(index)">
                            <i class="iconfont icon-guanbi"></i>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div class="history-fold" v-if="isHistoryOpen" @click.stop="isHistoryOpen = false;">
                      <div class="fold-text">收起</div>
                      <i class="iconfont icon-xiajiantou-copy" style="transform: rotate(180deg); /* 旋转 180 度 */"></i>
                  </div>
                  <div class="history-fold" v-else @click.stop="isHistoryOpen = true;">
                      <div class="fold-text">展开更多</div>
                      <i class="iconfont icon-xiajiantou-copy"></i>
                  </div>
                </div>
                <div class="trending">
                  <div class="header">
                      <div class="title">bilibili热搜</div>
                    </div>
                  </div>
                  <div class="trendings-double">
                    <div class="trendings-col" style="max-width: calc(50% - 5px);">
                      <div class="trending-item" v-for="(item,index) of leftTrendings" :key="index" @click.stop="clickItemToSearch(item)">
                        <div class="trending-rank">{{ 2 * index + 1 }}</div>
                        <div class="trending-text">{{item}}</div>
                      </div>
                    </div>
                    <div class="trendings-col" style="max-width: calc(50% - 5px);">
                      <div class="trending-item" v-for="(item, index) in rightTrendings" :key="index" @click.stop="clickItemToSearch(item)">
                        <div class="trending-rank">{{ 2 * (index + 1) }}</div>
                        <div class="trending-text">{{item}}</div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>  
        <ul class="nav-right">
          <!-- 登录前 -->
          <div class="nav-avatar-wrap" v-if="!this.$store.state.isLogin">
                <div class="default-login" @click="dialogVisible = true;">
                    登录
                </div>
          </div>
          <!-- 登录后 -->
          <div class="nav-avatar-wrap" v-else @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
              <a :href="`/space/${user.uid}`" target="_blank" class="header-avatar-wrap-container mini-avatar-small">
                <picture class="v-img">
                    <img :src="user.avatar_url" :alt="`头像`" />
                </picture>
              </a>
              <div class="popover" :class="isPopoverShow ? 'popShow' : 'popHide'" :style="{ display: popoverDisplay }">
                <div class="avator-popover">
                  <div class="avator-panel-popover" >
                    <a class="big-avatar"></a>
                    <a class="nickname-item light" >{{ user.username }}</a>
                    <div class="vip-item"></div>
                    <div class="coins-item">
                      <a href="//account.bilibili.com/site/coin" target="_blank">
                        <span class="coin-item__text">硬币:</span>
                        <span class="coin-item__num">{{user.coins}}</span>
                      </a>
                    </div>
                    <div class="counts-item">
                      <a class="single-count-item" href="//space.bilibili.com/114071860/fans/follow" target="_blank">
                        <div class="count-num">{{user.following_count}}</div>
                        <div class="count-text">关注</div>
                      </a>
                      <a class="single-count-item" href="//space.bilibili.com/114071860/fans/fans" target="_blank">
                        <div class="count-num">{{user.follower_count}}</div>
                        <div class="count-text">粉丝</div>
                      </a>
                      <a class="single-count-item" href="//space.bilibili.com/114071860/dynamic" target="_blank">
                        <div class="count-num">17</div><div class="count-text">动态</div>
                      </a>
                    </div>
                    <div class="links-item">
                      <a href="/Account" class="single-link-item">
                        <div class="link-title">
                          <i class="link-icon iconfont icon-icon03"></i>
                          <span>个人中心</span>
                        </div>
                        <i class="iconfont icon-youjiantou link-icon-right"></i>
                      </a>
                      <a href="" class="single-link-item">
                        <div class="link-title">
                          <i class="link-icon iconfont icon-tougao "></i>
                          <span>投稿管理</span>
                        </div>
                        <i class="iconfont icon-youjiantou link-icon-right"></i>
                      </a>
                    </div>
                    <div class="split-line"></div>
                    <div class="logout-item" @click="logout">
                      <i class="link-icon iconfont icon-h"></i>
                      <span>退出登录</span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <li>
            <a href="" class="nav-right-item">
              <i class="iconfont icon-huiyuan"></i>
              <span>大会员</span>
            </a>
          </li>
          <li>
            <a href="" class="nav-right-item"><i class="iconfont icon-xinfengyoujian"></i><span>消息</span></a>
          </li>
          <li>
            <a href="" class="nav-right-item"><i class="iconfont icon-fengche"></i><span>动态</span></a>
          </li>
          <li>
            
            <a href="" class="nav-right-item"><i class="iconfont icon-shoucang"></i><span>收藏</span></a>
          </li>
          <li>
            <a href="" class="nav-right-item"><i class="iconfont icon-shizhong"></i><span>历史</span></a>
          </li>
          <li>
            <a href="" class="nav-right-item"><i class="iconfont icon-iconfinder_m-_"></i><span>创作中心</span></a>
          </li>
          <li>
            <a href="http://localhost:8080/platform/upload/video" target="_blank">
              <div class="nav-right-item nav-right-item-upload">
                <i class="iconfont icon-shangchuan"></i>
                <span>投稿</span>
              </div>
            </a>
          </li>
        </ul>
      <!-- 这里可以添加用户登录信息、搜索栏等其他元素 -->  
    </div>  
      </div>
      
    <img src="../assets/backround.png" alt="123" v-if="size === 'larger'">

    <el-dialog v-model="dialogVisible" :close-on-click-modal="false" destroy-on-close align-center>
        <LoginReg @loginSuccess="dialogVisible = false;"></LoginReg>
    </el-dialog>
  </div>
    
  </template>  
    
  <script>  
  // import axios from 'axios';  
  import LoginReg from './loginReg.vue';
  let inTimer
  let outTimer;

  export default { 
    props: {
      size: {
        type: String,
        default() {
            return 'mini';
        }
      },
      isShowSearchInput: {
        type: Boolean,
        default() {
            return true;
        }
      },
      isSlidedown: {
          type: Boolean,
          default() {
              return false;
          }
      },
    },
    components:{
      LoginReg:LoginReg,
    },
    data() {  
      return {  
        isFocused : false,
        isactivied:false,
        isHistoryOpen:false,
        // 登录框显隐
        dialogVisible:false,
        isPopoverShow:false,
        isAnimating:false,
        searchInput: "",
        popoverDisplay:'none',
        history:['啦啦啦','啦s啦啦','啦啦啦dasd','啦啦asd啦','啦啦啦','啦啦啦','啦dasda啦啦','啦啦da啦','啦啦啦','啦啦啦','啦啦啦','啦啦da啦','啦啦啦','啦lalla啦啦','啦啦啦','啦啦啦','啦s啦啦','啦啦啦dasd','啦啦asd啦','啦啦啦','啦啦啦','啦dasda啦啦','啦啦da啦','啦啦啦','啦啦啦','啦啦啦','啦啦da啦','啦啦啦','啦lalla啦啦','啦啦啦'],
        trendings:['莎头组合夺金','王楚钦哭了','李小双怒斥中国体操教练组','王楚钦回应球拍被踩断','特朗普同意接受FBI访谈','奥运会蓝精灵演员道歉','NIP八连败','韩国将设立第一夫人办公室','中国展巴黎爆火','BLG战胜AL']
      };  
    },  
    mounted() {  
      window.addEventListener("click", this.handleOutsideClick);
    },  
    beforeUnmount() {  
      window.removeEventListener("click", this.handleOutsideClick);
    },  
    methods: {  
      getsize(){
        console.log(this.size)
      },
      handleActivied(status){
        this.isactivied = status; 
      },
      handleFocus(status) {  
      this.isFocused = status;  
      },  
      handleBoth(status){
        this.isactivied = status; 
        this.isFocused = status; 
      },
      clickItemToSearch(value) {
        this.searchInput = value;
        this.goSearch();
      },
      goSearch() {
        // this.searchPopHide();
        let input = this.searchInput.trim();
        // const index = this.histories.indexOf(input);
        // if (index != -1) {
        //     // 值已存在，移除该值
        //     this.histories.splice(index, 1);
        // }
        // this.histories.unshift(input);  // 在列表开头插入新记录
        // this.saveToLocalStorage();
        if (input === "") {
            // 输入空白符跳转搜索首页
            this.openNewPage("/search/all");
        } else {
            // 否则就跳搜索详情页
            this.openNewPage(`/search/all?keyword=${input}`);
        }
      },
      handleOutsideClick(e) {
        const formElement = this.$refs.searchBar;
        if (
            !formElement.contains(e.target)
        ) {
            this.isFocused = false;
        }
      },
      removeItem(index) {  
        // 使用splice方法从数组中移除指定索引的元素  
        this.history.splice(index, 1);  
        console.log(this.history)
      },
      clearItem(){
        // 清空数组  
        this.history = [];  
        console.log(this.history); // 输出: []
      },
      handleMouseEnter() {
          clearTimeout(outTimer);     // 这里要清除隐藏的计时器，否则在0.2秒内出入头像，会导致头像变大但气泡突然消失
          inTimer = setTimeout(() => {
              this.popoverDisplay = "";
              this.isPopoverShow = true;
          }, 100);
      },
      handleMouseLeave() {
          clearTimeout(inTimer);    // 清除显示计时器防止快速经过头像时的气泡闪烁
          this.isPopoverShow = false;
          outTimer = setTimeout(() => {
              this.popoverDisplay = "none";
          }, 200);
      },
      logout() {
        this.$store.dispatch("logout");
        window.location.reload();
      },
      //打开新界面
      openNewPage(route) {
        window.open(this.$router.resolve(route).href, '_blank');
      },
    } ,
    computed: {
      // 计算属性，用于获取偶数索引的 trending 项
      leftTrendings() {
        return this.trendings.filter((_, index) => index % 2 === 0);
      },
      // 计算属性，用于获取奇数索引的 trending 项
      rightTrendings() {
        return this.trendings.filter((_, index) => index % 2 !== 0);
      },
      user() {
        return this.$store.state.user;
      },
    }, 
  }  
  </script>  
    
  <style scoped>  
    .nav-right .nav-right-item .iconfont{
      font-weight: bold;
      font-size:18px;
    }

    .icon-sousuo{
      font-weight: bold;
      color: black;
    }

    /* 大导航栏 */
    img{
    width: 100%;
    height: 188.129px;
    
    }

  .navigation {  
    position: relative;
    z-index: 2;
  }  

    
  .nav-bar{
    display: flex;
    position: absolute;
    width: 100%;
    height: 64px;
    left: 0px;
    top: 0px;
    align-items: center;  
    justify-content: space-between;  
    background-color: transparent;
    padding: 0 20px;  
    color: rgb(0, 0, 0);  
  }

  .nav-bar ul{
    display: flex;
    align-items: center;  
  }

  .nav-left {  
    list-style: none;  
    display: flex;  
    gap: 20px; /* CSS Grid/Flexbox中的间距属性，用于在flex子项之间添加空间 */  
  }  

  .nav-left a{  
    white-space: nowrap;
  }  

  .nav-left li{  
    margin: 0;
    white-space: nowrap;
  }  
    
  .nav-left li a {  
    display: inline-block;  
    height: 64px;
    text-decoration: none;  
    font-size: 14px;  
    line-height: 64px;
    transition: transform 0.3s ease;
    color: white;  
  } 
  
  .entry-title{
    font-size: 14px;  
    line-height: 64px;
  }
  
  
  .nav-left li a:hover{  
    animation: hoverAnimation 0.3s ease forwards;  
  }  

  .nav-bar.slide-down{  
    position: fixed;
    background-color: #ffffff; 
    box-shadow: 0 1px 4px #00000014;
  }  

  .left-entry-title a{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
  }

  .left-entry-title div{
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 14px;
    line-height: 20px;  
    color: black;
  }

  .icon-xiaodianshi-line, .icon-xiazai {
    margin-right: 6px;
  }

  .entry-title a{
    color: #ffffff;
  }

  .icon-bilibili{
    font-size: 30px;
    color: rgb(255, 161, 177);
    margin-right: 20px;
  }

  .larger .nav-right .nav-right-item{
    color: #ffffff;
  }
  
  .slide-down li a,.slide-down .nav-right .nav-right-item{
    color: black;
  }
  /* 小导航栏 */
  .mini .nav-bar{
    position: relative;
    background-color: #ffffff;
    box-shadow: 0 2px 4px #00000014;
  }

  .mini .nav-right-item,.mini .nav-left a{  
    color: black; /* 黑色文字 */  
  }  

  /* 搜索 */
  .search_bar{
    margin: 0 auto;
    height: 40px;
  }

  
  .search_form{
    display: flex;
    align-items: center;
    padding: 0 48px 0 4px;
    position: relative;
    z-index: 1;
    overflow: hidden;
    line-height: 38px;
    border: 1px solid #e3e5e7;
    height: 40px;
    background-color: #f1f2f3;
    opacity: .9;
    transition: background-color .3s;
    border-radius:8px 8px 8px 8px;
  }
  .search_form:hover{
    background-color: #ffffff;
    opacity: 1;
  }

  .search_form.isfocus{
    border-radius: 6px 6px 0 0;
    border-bottom: none;
    background-color: #ffffff;
  }
  .search_content{
    display: flex;
    width: 450px;
    height: 32px;
    padding: 0 8px;
    align-items:center;
    justify-content: space-between;
    border:2px solid transparent;
    border-radius: 6px;
  }
  .search_form.isfocus .search_content{
    background-color: #e3e5e7;
  }
  .search_input{
    width: 100%;
    background-color: transparent;
    outline: none;
    align-items:center;
    padding-right: 8px;
    border:0;
  }
  .search_btn{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    position: absolute;
    top: 3px;
    right: 7px;
    border-radius: 8px;
    transition: background-color .3s;
    cursor: pointer;
  }

  .search_btn:hover{
    background-color: #e3e5e7;
  }

  /* 搜索弹窗 */
  .search_panel{
    width: 100%;
    display: none;
    max-height: 612px;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #e3e5e7;
    border-top: none;
    border-radius: 0px 0px 8px 8px;
    padding: 13px 0 16px ;
  }
  
  .search_bar.isfocus .search_panel{
    display: block;
  }

  .history .header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }

  .history .header .title{
    height: 24px;
    font-size: 16px;
    line-height: 24px;
  }

  .history .header .clear{
    height: 24px;
    font-size: 14px;
    line-height: 24px;
    color: #9499a0;
    cursor: pointer;
  }

  .history .header .clear:hover{
    color: #00aeec;
  }

  .history-wrap{
    width: 100%;
    max-height: 200px;
    padding: 0 16px;
    overflow: hidden;
  }

  .histories{
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    margin-right: -10px;
    margin-bottom: 4px;
  }

  .history-item{
    position: relative;
    box-sizing: border-box;
    height: 30px;
    padding: 7px 10px 8px;
    font-size: 12px;
    line-height: 15px;
    background: #f6f7f8;
    border-radius: 4px;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .history-item .close{
    display: none;
    box-sizing: border-box;
    position: absolute;
    color: rgb(214, 214, 214);
    width: 16px;
    height: 16px;
    top: -6px;
    right: -6px;
    padding: 2px;
  }

  .history-text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 96px;
  }

  .history-item:hover .history-text{
    color: #00aeec;
  }

  .history-item:hover .close{
    display: block;
  }

  /* 展开 */
  .history-fold{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    margin: 0 auto 14px;
    cursor: pointer;
  }

  .history-fold .fold-text,.history-fold i{
    color: #9499a0;
  }

  .trending .header .title{
    height: 24px;
    font-size: 16px;
    line-height: 24px;
    padding: 0 16px;
  }

  .trendings-double{
    display: flex;
  }

  .trendings-col{
    flex: 1;
    margin-right: 10px;
  }

  .trending-item{
    box-sizing: border-box;
    height: 38px;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 16px;
  }

  .trending-rank{
    width: 15px;
    min-width: 15px;
    height: 17px;
    line-height: 17px;
    text-align: center;
    font-size: 14px;
    margin-right: 7px;
    color: #18191c;
  }
  
  .trending-text{
    font-size: 14px;
    line-height: 17px;
    height: 17px;
    margin-right: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0;
  }

  .trending-item:hover{
    background-color: #e3e5e7;
  }


  /* 右导航栏 */
  .nav-right{
    width: 500px;
    float: right;
    justify-content: flex-end;
  }

  .nav-avatar-wrap {
    position: relative;
    box-sizing: content-box;
    padding-right: 10px;
    width: 50px;
    height: 50px;
  }

  .default-login {
    position: absolute;
    top: 5px;
    left: 10px;
    z-index: 2;
    display: block;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-color: #00aeec;
    text-align: center;
    line-height: 38px;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
  }

  /* 用户气泡弹窗 */
  .popover {
    position: absolute;
    top: 100%; /* 使其在父元素下方 */
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    padding-top: 10px; /* 可以调整 */
    margin-left: -17px;
    width: 300px; /* 适当设置宽度 */
  }

  .avator-popover {
    position: relative;
    background-color: #ffffff;
    box-shadow: 0 0 30px #0000001a;
    border-radius: 8px;
    color: #18191c;
  }

  .avator-panel-popover {
    padding: 16px; /* 适当调整 */
    width: 100%; /* 根据需要调整宽度 */
  }

  .nav-avatar-wrap-container {
    position: relative;
    z-index: 2;
  }

  .mini-avatar-small {
      position: absolute;
      top: 5px;
      left: 10px;
      z-index: 2;
      display: block;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      box-sizing: border-box;  /* 让内边距不增加宽度 */
      border: 2px solid #fff;
      transition: width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease; /* 添加平滑过渡效果 */
  }

  .v-img {
      position: relative;
      display: inline-block;
      line-height: 1;
      width: 100%;
      height: 100%;
      vertical-align: middle;
      border-radius: 50%;
      background-color: transparent;
  }

  .v-img img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: inherit;
    border-radius: 50%;
    image-rendering: -webkit-optimize-contrast;
  }

  /* 放大头像 */
  .nav-avatar-wrap:hover .mini-avatar-small {
      top: 15px;
      left: -35px;
      width: 90px;
      height: 90px;
  }

  .navavatar-wrap:hover .mini-avatar-small.shrink {
      animation: shrink 0.3s both; /* 初始状态为缩小 */
  }

  .big-avatar{
    display: block;
    margin-bottom: 4px;
    width: 80px;
    height: 80px;
    opacity: 0;
  }

  .nickname-item{
    display: block;
    text-align: center;
    margin-top: -40px;
    margin-bottom: 2px;
    font-size: 18px;
    color: #FB7299;
    font-weight: 500;
  }

  .vip-item{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px 0;
  }

  .coins-item{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    font-size: 12px;
  }

  .coin-item__text{
    color: #9499a0;
  }

  .coin-item__num{
    color: #18191c;
  }

  .counts-item{
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 0 20px;
  }

  .single-count-item{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    transition: color .2s;
  }

  .single-count-item .count-num{
    color: #18191c;
    font-size: 18px;
    transition: color .2s;
  }

  .single-count-item .count-text{
    color: #9499a0;
    font-weight: 400;
    font-size: 12px;
    transition: color .2s;
  }

  .single-link-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
    padding: 0 14px;
    height: 38px;
    border-radius: 8px;
    color: #61666d;
    font-size: 14px;
    cursor: pointer;
    transition: background-color .3s;
    white-space: nowrap;
  }

  .link-title{
    display: flex;
    align-items: center;
  }

  .link-icon{
    margin-right: 20px;
  }

  .link-icon-right{
    font-size: 10px;
  }

  .single-link-item:hover{
    background-color: #e3e5e7;
  }

  .split-line{
    margin: 10px 0;
    width: 100%;
    height: 1px;
    background: #e3e5e7;
  }

  .logout-item{
    display: flex;
    align-items: center;
    padding: 10px 14px;
    border-radius: 8px;
    color: #61666d;
    font-size: 14px;
    cursor: pointer;
    transition: background-color .3s;
  }
  
  .logout-item:hover{
    background-color: #e3e5e7;
  }
  /*  */

  .nav-right-item{
    display: flex;
    align-items: center;
    flex-direction: column;
    flex-shrink: 0;
    margin-right: 0;
    min-width: 50px;
    text-align: center;
    font-size: 13px;
  }

  .nav-right-item:hover i{
    animation: hoverAnimation 0.3s ease forwards;  
  }

  .icon-shangchuan{
    margin-right: 5px;
    font-size: large;
    font-weight: bold;
  }

  .nav-right-item-upload{
    display: inline-block;
    width: 90px;
    height: 34px;
    line-height: 30px;
    color: #ffffff !important;
    background-color: #FB7299;
    border-radius: 8px;
    margin-left: 30px;
  }

  .popHide {
    animation: fade-out 0.2s ease-out forwards;
    transform-origin: top; /* 设置动画的旋转点为顶部 */
  }

  .popShow {
      animation: fade-in 0.2s ease-out forwards;
      transform-origin: top; /* 设置动画的旋转点为顶部 */
  }   

  /* 登录框 */

  /* 动画 */
  @keyframes hoverAnimation {  
    0% { transform: translateY(-2px); } /* 开始时上移5px */  
    50% { transform: translateY(-4px); } /* 中间状态再下移一点，这里只是为了效果更明显 */  
    100% { transform: translateY(0); } /* 结束时回到原位 */  
  }  

  /* 淡入动画 */
@keyframes fade-in {
    0% {
        opacity: 0; /* 初始状态透明 */
        transform: translateY(-10px) translateX(-50%); /* 向上平移 10px，将元素隐藏在顶部 */
    }
    100% {
        opacity: 1; /* 最终状态不透明 */
        transform: translateY(0) translateX(-50%); /* 平移恢复到原始位置 */
    }
}

/* 淡出动画 */
@keyframes fade-out {
    0% {
        opacity: 1; /* 初始状态不透明 */
        transform: translateY(0) translateX(-50%);   /* 原始位置 */
    }
    100% {
        opacity: 0; /* 最终状态透明 */
        transform: translateY(-10px) translateX(-50%); /* 向上平移 10px，将元素隐藏在顶部 */
    }
}
  </style>