<template>
  <div class="platform-view">
    <div class="header">
      <div class="header-left">
        <span class="title">创作中心</span>
        <a href="/" class="home">
          <i class="iconfont icon-xiaodianshi-line"></i>
          首页
        </a>
      </div>
      <div class="header-right"></div>
    </div>
    <div class="platform-nav">
      <button class="nav-upload" @click="this.$router.push('/platform/upload')">
          <i class="iconfont icon-shangchuan"></i>
          投稿
      </button>
    </div>
    <div class="platform-main" >
      <div class="platform-main-wrap">
        <div class="content-body">
          <router-view></router-view>
        </div>    
      </div>        
    </div>
  </div>
</template>
    
<script>
    export default {
      data(){
        return{
          
        }
      }
      
    }
</script>
    
    
<style scoped>

  .header{
    background-color: #fff;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .05);
    padding: 0 100px 0 32px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 900;
    min-width: 960px;
  }

  .header-left{
    display: flex;
    height: 60px;
    align-items: center;
    justify-self: start;
  }

  .title{
    font-size: 25px;
    font-weight: 700;
    color: #00a1d6;
  }

  .home{
    margin-left: 32px;
    font-size: 14px;
    color: #757575;
    margin-left: 20px;
  }

  /* 左导航 */
  .platform-nav {
    position: fixed;
    transform: translateZ(0);
    padding-top: 60px;
    top: 0;
    left: 0;
    border-right: 1px solid #f4f4f4;
    background: #fff;
    z-index: 10;
    height: 100%;
    width: 200px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .nav-upload{
    display: block;
    width: 135px;
    height: 40px;
    border: none;
    background-color: #00a1d6;
    color: #fff;
    font-size: 15px;
    margin: auto;
    margin-top: 30px;
    cursor: pointer;
  }

  .nav-upload:hover{
    background-color: #00a0d6da;
  }

  /* 右边 */
  .platform-main {
    position: relative;
    padding: 60px 0 50px 200px;
    background: #fafafa;
    min-width: 1124px;
    display: flow-root;
    min-height: 100%;
  }

  .platform-main-wrap{
    width: 100%;
    height: 100%;
  }

  .content-body {
    min-height: calc(100vh - 126px);
    min-width: 1000px;
    max-width: 1100px;
    background: #fff;
    margin: 16px auto 0;
    padding-bottom: 20px;
    display: flow-root;
  }

</style>
    