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
                        <div class="n-tab-links" @mouseleave="hoverIdx = -1">
                            <div class="n-btn n-index" :class="{'active': navIdx === 0 || navIdx === 5 || navIdx === 6}" @click="changeNav('')"  @mouseenter="hoverIdx = 0">                                
                                <span class="iconfont icon-zhuye"></span>
                                <span class="n-text">主页</span>
                            </div>
                            <div class="n-btn n-dynamic" :class="{'active': navIdx === 1}" @click="changeNav('/dynamic')"  @mouseenter="hoverIdx = 1">                                
                                <span class="iconfont icon-dongtai"></span>
                                <span class="n-text">动态</span>
                            </div>
                            <div class="n-btn n-video" :class="{'active': navIdx === 2 }" @click="changeNav('/video')"  @mouseenter="hoverIdx = 2">                                
                                <span class="iconfont icon-tougao1"></span>
                                <span class="n-text">投稿</span>
                            </div>
                            <div class="n-btn n-favlist" :class="{'active': navIdx === 3}" @click="changeNav('/favlist')"  @mouseenter="hoverIdx = 3">                                
                                <span class="iconfont icon-shoucang1"></span>
                                <span class="n-text">收藏</span>
                            </div>
                            <div class="n-btn n-setting" v-if="this.$store.state.user.uid === user.uid" :class="{'active': navIdx === 4}" @click="changeNav('/setting')" @mouseenter="hoverIdx = 4">                                
                                <span class="iconfont icon-shezhi"></span>
                                <span class="n-text">设置</span>
                            </div>
                        </div>
                        <div class="n-statistics">
                            <div class="n-data n-gz" :class="{'active': navIdx === 5 }" @click="changeNav('/fans/follow')">
                                <div class="n-data-k">关注数</div>
                                <p id="n-gz" class="n-data-v">359</p>
                            </div>
                            <div class="n-data n-fs" :class="{'active': navIdx === 6 }" @click="changeNav('/fans/fans')">
                                <div class="n-data-k">粉丝数</div>
                                <p id="n-fs" class="n-data-v">359</p>
                            </div>
                            <div class="n-data n-bf">
                                <p class="n-data-k">获赞数</p>
                                <p id="n-fs" class="n-data-v">0</p>
                            </div>
                            <div class="n-data n-bf">
                                <p class="n-data-k">播放数</p>
                                <p id="n-fs" class="n-data-v">0</p>
                            </div>
                        </div>
                    </div>
                    <div class="n-cursor" :style="sliderPosition"></div>
                </div>
            </div>
            <div class="s-space">
                <router-view></router-view>
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
                hoverIdx:-1,
                navIdx:0,
                mounted:false,
                sliderPosition:{}
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
            changeNav(path) {
                const newPath = `/space/${this.$route.params.uid}${path}`;
                if (this.$route.path === newPath) return;
                this.$router.push(newPath);
            },
            updateSliderPosition(){
                const navItems = this.$el.querySelectorAll('.n-btn');
                let target = 0;
                if (this.hoverIdx >= 0) {
                    target = this.hoverIdx;
                } else if (this.navIdx < 5) {
                    target = this.navIdx;
                }
                const activeItem = navItems[target];
                if (activeItem) {
                const { offsetLeft, offsetWidth } = activeItem;
                    this.sliderPosition = {
                        left: `${offsetLeft}px`,
                        width: `${offsetWidth}px`
                    };
                }
            },
            setNavIdxFromRoute() {
                const part = this.$route.path.split('/');
                this.navIdx = !part[3] ? 0 :
                    part[3] === '' ? 0 :
                    part[3] === 'dynamic' ? 1 :
                    part[3] === 'video' ? 2 :
                    part[3] === 'favlist' ? 3 :
                    part[3] === 'setting' ? 4 :
                    part[3] === 'fans' ? (part[4] === 'follow' ? 5 : (part[4] === 'fans' ? 6 : 0 )) : 0;
                    console.log(this.navIdx)
            },
        },
        watch:{
            '$route.path': function() {
                this.setNavIdxFromRoute();
                this.updateSliderPosition();
            },
            navIdx() {
                this.$nextTick(() => {
                    this.updateSliderPosition();
                });
            },
            hoverIdx() {
                this.$nextTick(() => {
                    this.updateSliderPosition();
                });
            }
        },
        mounted() {
            // 初始化激活的导航项
            this.setNavIdxFromRoute();
            this.updateSliderPosition();
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
.space>div{
    background-color: #fafafa;
}

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

.n .wrapper{
    position: relative;
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
    cursor: pointer;
}

.n .n-tab-links{
    display: inline-block;
    vertical-align: middle;
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

.n-btn.active{
    color: #00aeec;
}

.n-cursor {
    width: 10px;
    height: 3px;
    background-color: #00aeec;
    transition: left 0.2s ease, width 0.3s ease; /* 平滑过渡效果 */
    position: absolute;
    bottom: -1px;
}

.space-body{
    margin-top: 10px;
}

.n-statistics{
    float: right;
    height: 66px;
}

.n .n-data{
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-pack: center;
    justify-content: center;
    float: left;
    height: 66px;
    padding: 10px 5px;
    text-align: center;
    box-sizing: border-box;
}

.n .n-data.active .n-data-v,.n .n-data.active .n-data-k{
    color: #00aeec;
}

.n-data{
    color: #99a2aa;
}

.n-gz,.n-fs{
    cursor: pointer;
}

.n-gz:hover,.n-fs:hover{
    color: #00aeec;
}

.n .n-data .n-data-v{
    color: #000;
}

.s-space{
    margin-top: 10px;
}
</style>