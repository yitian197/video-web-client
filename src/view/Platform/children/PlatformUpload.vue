<template>
  <div class="platform-upload">
    <div class="upload-nav" :style="isNavBarShow? '':'display:none;'">
      <a class="nav-item" 
              :class="{'active': index === routerIndex}"
              v-for="(item, index) in navBarData" 
              :key="index"
              @click="changeNav(item.path,index)"
          >{{ item.name }}</a>
    </div>
    <router-view @changeNavBarShow="changeNavBarShow"></router-view>
  </div>
</template>
    
<script>
    export default {
      data(){
        return{
          routerIndex : 0,
          isNavBarShow:true,
          navBarData: [
                { name: "视频投稿", path: '/platform/upload/video' },
                { name: "专栏投稿", path: '/platform/upload/text' },
            ],
        }
      },
      methods:{
        changeNav(path, index) {
          this.routerIndex = index;
          this.$router.push(path)
        },
        changeNavBarShow(flag) {
            this.isNavBarShow = flag;
        }
      }
    }
</script>
    
    
<style scoped>

  .upload-nav{
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #e7e7e7;
    display: flex;
  }

  .nav-item{
    margin:auto 0;
    margin-left: 20px;
    padding: 18px;
    cursor: pointer;
    position: relative;
    font-size: 16px;
    color:#61666d;
  }

  .nav-item.active {
    color: #00aeec;
    font-weight: 500;
    border-bottom:2px solid #00aeec;
  }
</style>
    