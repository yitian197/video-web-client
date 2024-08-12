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
                        <div class="n-tab-links"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import NavigationBar from '@/components/NavigationBar.vue';
    import YAvatar from '@/components/YAvatar.vue';
    export default{
        components:{
            NavigationBar:NavigationBar,
            Avatar:YAvatar
        },
        data(){
            return{

            }
        },
        computed:{
            user() {
                console.log(this.$store.state.user)
                return this.$store.state.user;
            },
        }
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
    font-size: 0;
}
</style>