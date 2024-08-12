<template>
    <div class="space">
        <NavigationBar ></NavigationBar>
        <div class="space-container">
            <div class="h">
                <div class="wrapper">
                    <div class="h-inner">
                        <div class="h-user">
                            <div class="h-info">
                                <div class="avatar-container">
                                    <Avatar :size="60" :imgurl="user.avatar_url"></Avatar>
                                </div>
                                <div class="h-basic">
                                    <div>
                                        <span id="h-name">{{ user.username }}</span>
                                        <span class="icon gender" :class="user.gender === 0 ? 'female' : user.gender === 1 ? 'male' : ''"></span>
                                    </div>
                                    <div class="h-basic-bottom">
                                        <h4 class="h-sign" :title="user.description">{{ user.description }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="navigator" class="n">
                <div class="wrapper">
                    <div class="n-inner">
                        <div class="n-tab-links">
                            <a href="/space" class="n-btn n-index" :class="{'active': navIdx === 0 }" @click="clickNavItem('')" @mouseenter="hoverIdx = 0">                                
                                <span class="iconfont icon-zhuye"></span>
                                <span class="n-text">主页</span>
                            </a>
                            <a href="/dynamic" class="n-btn n-dynamic" :class="{'active': navIdx === 1}" @click="clickNavItem('/dynamic')" @mouseenter="hoverIdx = 1">                                
                                <span class="iconfont icon-dongtai"></span>
                                <span class="n-text">动态</span>
                            </a>
                            <a class="n-btn n-video" :class="{'active': navIdx === 2 }" @click="clickNavItem('/video')" @mouseenter="hoverIdx = 2">                                
                                <span class="iconfont icon-tougao1"></span>
                                <span class="n-text">投稿</span>
                            </a>
                            <a class="n-btn n-favlist" :class="{'active': navIdx === 4}" @click="clickNavItem('/favlist')" @mouseenter="hoverIdx = 4">                                
                                <span class="iconfont icon-shoucang1"></span>
                                <span class="n-text">收藏</span>
                            </a>
                            <a class="n-btn n-setting" v-if="this.$store.state.user.uid === user.uid" :class="{'active': navIdx === 5}" @click="clickNavItem('/setting')" @mouseenter="hoverIdx = 5">                                
                                <span class="iconfont icon-shezhi"></span>
                                <span class="n-text">设置</span>
                            </a>
                        </div>
                    </div>
                    <div class="n-cursor" :style="`width: ${barWidth}px; left: ${barLeft}px;`"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import NavigationBar from '@/components/NavigationBar.vue';
    import YAvatar from '@/components/YAvatar.vue';
    import request from '@/utils/request'
    export default{
        components:{
            NavigationBar:NavigationBar,
            Avatar:YAvatar
        },
        data(){
            return{
                user:{},
            }
        },
        methods:{
            async getUserInfo(uid) {
                console.log('发送请求')
                const res = await request.get("/user/oneuserinfo", {
                    params: { uid: uid },
                })
                if (!res.data) return;
                // if (!res.data.data) {
                //     this.$router.push('/notfound');
                //     return;
                // } else if (res.data.data.state === 2) {
                //     this.$router.push('/notfound');  // 账号已注销
                //     return;
                // }
                this.user = res.data;
            },
        },
        computed:{
        },
        async created() {
            if (this.$route.path === "/space" || this.$route.path === "/space/") {
                if (localStorage.getItem("userToken")) {
                    try {
                        // 解析JWT获取当前用户uid
                        const w = localStorage.getItem("userToken").split('.')[1];
                        const info = JSON.parse(atob(w));
                        this.$router.push(`/space/${info.sub}`);
                    } catch (e) {
                        console.log("atob exception:", e)
                        this.$router.push("/");
                    }
                } else {
                    this.$router.push("/");
                }
            } else {
                // 判断路由参数合法性
                const uid = Number(this.$route.params.uid);
                if (uid && uid !== 0) {
                    // await this.getUserFavList(uid);
                    await this.getUserInfo(uid);
                    // await this.getUserWorksCount(uid);
                } else {
                    this.$router.push('/notfound');
                }
            }
        },
    }
</script>

<style scoped>
.wrapper{
    width: 1280px;
    margin: auto;
}

.h-inner{
    background-image: url('@/assets/space.png');
    padding-top: 116px;
}

.avatar-container {
    position: relative;
}

.avatar-container ::v-deep .avatar>img {
    border: 2px solid hsla(0, 0%, 100%, .4);
    box-sizing: initial;
}

.icon {
    vertical-align: middle;
    background-repeat: no-repeat;
    display: inline-block;
    background-image: url('@/assets/icons.png');
}

.gender {
    display: none;
    width: 21px;
    height: 18px;
    margin-right: 5px;
    vertical-align: middle;
    background-position: -212px -922px;
}

.gender.male {
    display: inline-block;
    background-position: -212px -472px;
}

.gender.female {
    display: inline-block;
    background-position: -211px -404px;
}

.h-basic-bottom{
    margin-top: 6px;
}

.h-sign{
    background: transparent;
    border-radius: 4px;
    border: none;
    box-shadow: none;
    color: hsla(0, 0%, 100%, .8);
    font-size: 12px;
    font-family: Microsoft Yahei;
    line-height: 26px;
    height: 26px;
    margin-left: -5px;
    padding: 0 5px;
    position: relative;
    top: -1px;
    width: 730px;
    font-weight: 400;
}

.h-info{
    margin-left: 20px;
    padding-bottom: 16px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
}

.h-basic{
    color: #fff;
    font-size: 0;
    margin-left: 22px;
}

#h-name{
    display: inline-block;
    margin-right: 5px;
    font-weight: 700;
    line-height: 18px;
    font-size: 18px;
    vertical-align: middle;
}

.n .n-inner{
    height: 66px;
    background: #fff;
    box-shadow: 0 0 0 1px #eee;
    border-radius: 0 0 4px 4px;
    padding: 0 20px;
}

.n .n-btn{
    margin-right: 31px;
    line-height: 66px;
    display: inline-block;
}

.n .n-tab-links .iconfont {
    display: inline-block;
    width: 20px;
    font-size: 20px;
    margin-right: 4px;
    vertical-align: middle;
}

.n .n-tab-links .icon-zhuye {
    color: #00c091;
}

.n .n-tab-links .icon-dongtai {
    color: #fb7299;
}

.n .n-tab-links .icon-tougao1 {
    color: #02b5da;
}

.n .n-tab-links .icon-shoucang1 {
    color: #f3a034;
}

.n .n-tab-links .icon-shezhi {
    color: #23c9ed;
}
</style>