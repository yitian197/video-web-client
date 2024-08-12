<template>
    <div class="account-home">
        <div class="index-info">
            <div class="home-head">
                <img :src="user.avatar_url" alt="">
            </div>
            <div class="home-right">
                <div class="home-top-msg">
                    <span class="home-top-msg-name">{{user.username}}</span>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
    export default{
        computed:{
            user(){
                return this.$store.state.user;
            }
        }
    }
</script>

<style scoped>
    .index-info{
        padding: 50px 20px 0;
        width: 789px;
    }
    .home-head{
        display: inline-block;
        vertical-align: top;
        position: relative;
        cursor: pointer;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
    }
    .home-head img{
        width: 100%;
    }

    .home-right{
        display: inline-block;
        margin-left: 16px;
        width: 654px;
    }
    .home-top-msg-name{
        color: rgb(251, 114, 153);
        display: inline-block;
        font-size: 18px;
        font-weight: 700;
        /* color: #222; */
        margin-right: 8px;
        cursor: default;
    }
</style>