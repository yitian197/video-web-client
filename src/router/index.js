import { createRouter ,createWebHistory} from "vue-router";

import HelloWorld from "@/view/HelloWorld.vue";
import PageA from "@/view/PageA.vue";
import SearchView from "@/view/search/SearchView.vue";
import SearchUser from'@/view/search/children/SearchUser.vue';
import SearchVideo from'@/view/search/children/SearchVideo.vue';
import AccountView from "@/view/Account/AccountView.vue";
import AccountHome from "@/view/Account/children/AccountHome.vue"
import AccountInfo from "@/view/Account/children/AccountInfo.vue"
import AccountAvatar from "@/view/Account/children/AccountAvatar.vue"
import AccountSecurity from "@/view/Account/children/AccountSecurity.vue"
import CarouselIndex from '@/components/CarouselIndex.vue'
import PlatformView from "@/view/Platform/PlatformView.vue";
import PlatformHome from "@/view/Platform/children/PlatformHome.vue";
import PlatformUpload from "@/view/Platform/children/PlatformUpload.vue";
import videoUpload from "@/view/Platform/children/uploadChildren/videoUpload.vue";
import textUpload from "@/view/Platform/children/uploadChildren/textUpload.vue";
import VideoDetail from "@/view/videoDetail.vue";
import spaceView from "@/view/space/spaceView.vue";
import spaceHome from "@/view/space/children/spaceHome.vue";
import spaceDynamic from "@/view/space/children/spaceDynamic.vue";

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/home',
            component:HelloWorld ,
            meta:{ requestAuth: false } ,
        },
        {
            //不知道啥界面
            path:'/pagea',
            meta:{ requestAuth: false } ,
            component:PageA
        },{
            // 轮播图测试
            path:'/slider',
            meta:{ requestAuth: false } ,
            component:CarouselIndex
        },{
            path:'/platform',
            component:PlatformView,
            redirect: '/platform/home',
            children: [
                { path: '/platform/home', meta:{ requestAuth: true } , component: PlatformHome },
                { path: '/platform/upload', 
                    redirect: '/platform/upload/video',
                    component: PlatformUpload ,
                    meta:{ requestAuth: true } ,
                    children:[
                        { path: '/platform/upload/video', meta:{ requestAuth: true } , component: videoUpload },
                        { path: '/platform/upload/text', meta:{ requestAuth: true } , component: textUpload },
                    ]
                },
                
            ]
        },
        {
            path:'/',
            redirect:'/home'
        },
        { path: '/video/:vid', component: VideoDetail, meta: { requestAuth: false } },
        {
            path: '/space',
            component:spaceView, 
            meta: { requestAuth: false } ,
            children: [
                { path:'/space/:uid', meta:{ requestAuth: false } , component: spaceHome },
                { path: '/space/:uid/dynamic', meta:{ requestAuth: false } , component: spaceDynamic},
            ]
        },
        {
            path:'/account',
            redirect: '/account/home',
            component:AccountView,
            meta: { requestAuth: true },
            children: [
                { path: '/account/home', meta:{ requestAuth: true } , component: AccountHome },
                { path: '/account/info', meta:{ requestAuth: true } , component: AccountInfo},
                { path: '/account/avatar', meta:{ requestAuth: true } , component: AccountAvatar},
                { path: '/account/security', meta:{ requestAuth: true } , component: AccountSecurity},
            ]
        },
        {
            path:'/search/all',
            component: SearchView,
            props: route => ({ keyword: route.query.keyword }),
            children: [
                { path: '/search/user', component: SearchUser, meta: { requestAuth: false }, props: route => ({ keyword: route.query.keyword }) },
                { path: '/search/all', component: SearchVideo, meta: { requestAuth: false } , props: route => ({ keyword: route.query.keyword }) },
            ]
        }
    ]
})

// 本地没有token就跳到登录界面
router.beforeEach((to, from, next) => {
    if (to.meta.requestAuth && !localStorage.getItem("userToken")) {
        next('/');
    } else {
        next();
    }
});

export default router