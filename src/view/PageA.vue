<template>
  <div class="navbar">
    <NavigationBar />
  </div>
  <div class="abc">123123123123123122312</div>
</template>
  
  <script>
  import NavigationBar from '@/components/NavigationBar.vue'

  export default {
    components:{
      NavigationBar:NavigationBar,
    },
    data(){
      return{
        names:["我","你","他"],
        videoSrc: 'https://player.bilibili.com/player.html?isOutside=true&aid=1506013917&bvid=BV1sS421o7gC&cid=1605417140&p=1' 
      }
    }
    
  }
  </script>
  
  
  <style scoped>
    .navbar{
      height: 100px;
    }
    .abc{
      height: 10000px;
    }
  </style>
  