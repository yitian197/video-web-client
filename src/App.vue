<template>
  <router-view></router-view>
</template>

<script>
// import axios from 'axios';
import request from '@/utils/request'

export default {
  data() {
    return {
    };
  },
  methods:{
    async getChannels() {
      let res = await request.get("/api/category");
      // console.log("频道列表: ", res.data);
      this.$store.commit("updateChannels", res.data);
    },
  },
  async created() {
    if (localStorage.getItem("userToken")) {
      await this.$store.dispatch("getuserinfo");
    }
    this.getChannels()
  }
};
</script>

<style>
</style>
