<template>
    <div class="abc" @mouseover="stopTimer" @mouseleave="startTimer">
        <div 
            class="carousel-swrp" 
            :style="{
                transform: `translateX(-${current * 100 / (carousels.length + 2)}%)`,
                transition: isRoll ? 'none' : 'transform .3s ease-in-out'
            }"
        >
            <div class="carousel-slide">
                <a class="carousel-inner"  target="_blank">
                    <img :src=" carousels[carousels.length - 1].url  " alt="">
                </a>
            </div>
            <div class="carousel-slide" v-for="(item, index) in carousels" :key="index">
                <a class="carousel-inner" :href="item.target" target="_blank">
                    <img :src="item.url" alt="">
                </a>
            </div>
            <div class="carousel-slide">
                <a class="carousel-inner"  target="_blank">
                    <img :src=" carousels[0].url  " alt="">
                </a>
            </div>
        </div>
        <div class="shadow" :style="`background: linear-gradient(to top, ${this.color} 40%, ${this.color}00 100%);`"></div>
        <div class="carousel-footer-left">
            <div class="title"><span>{{ title }}</span></div>
                <div class="page">
                    <li
                        class="point"
                        :class="{
                            'is-active': index === current,
                            'isrever': isrever && index == current
                        }"
                        v-for="index in carousels.length"
                        :key="index"
                        @click="changePoint(index)"
                    >
                        <div class="before"></div>
                        <div class="after"></div>
                </li>
            </div>
        </div>
        <div class="carousel-footer-right">
            <button @click="prev" :disabled="isButtonDisabled" class="btn">
                <i class="iconfont icon-zuojiantou"></i>
            </button>
            <button @click="next" :disabled="isButtonDisabled" class="btn">
                <i class="iconfont icon-youjiantou"></i>
            </button>
        </div>
    </div>
</template>

<script>
import carousel from '@/assets/json/carousel.json'

export default{
    data(){
        return {
            // 轮播图列表
            carousels: [],
            // 是否滚动，0 
            isRoll: false,
            isButtonDisabled: false,
            // 当前位置
            current: 1,
            // 底色
            color: "",
            // 标题
            title: "",
            // 之前的索引
            previouscurrent: 1,
            isrever:false,
        }
    },
    methods:{
        getCarousels() {
            this.carousels = carousel;  
            this.color = this.carousels[0].color
            this.title = this.carousels[0].title
        },
        startTimer() {
            // 如果定时器已经存在，先清除它
            if (this.timer) {
                clearInterval(this.timer);
            }
            // 设置定时器
            this.timer = setInterval(this.next, 4000);
        },
        stopTimer() {
            // 清除定时器
            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        next() {
            this.isrever = false
            if (this.current < this.carousels.length) {
                this.isRoll = false;
                this.current++;
                this.isButtonDisabled = true;
                this.title = this.carousels[this.current - 1].title;
                this.color = this.carousels[this.current - 1].color;
                setTimeout(() => {
                    this.isButtonDisabled = false;
                }, 300);
            } else {
                this.isRoll = true;
                this.isButtonDisabled = true;
                this.current = 0
                this.title = this.carousels[0].title;
                this.color = this.carousels[0].color;
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.isRoll = false; // 启用过渡效果
                        this.current = 1; // 移动到第二个项目
                        setTimeout(() => {
                            this.isButtonDisabled = false; // 启用按钮
                        }, 300); // 延迟时间与过渡时间匹配
                    }, 50); 
                });
            }
        },
        prev() {
            this.isrever = true
            if (this.current > 1) {
                this.isRoll = false;
                this.current--;
                this.isButtonDisabled = true;
                this.title = this.carousels[this.current-1].title;
                this.color = this.carousels[this.current-1].color;
                setTimeout(() => {
                    this.isButtonDisabled = false;
                }, 300);
            } else {
                this.isRoll = true;
                this.isButtonDisabled = true;
                this.current = this.carousels.length +1
                this.title = this.carousels[this.carousels.length - 1].title;
                this.color = this.carousels[this.carousels.length - 1].color;
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.isRoll = false;
                        this.current = this.carousels.length;
                        setTimeout(() => {
                            this.isButtonDisabled = false; // 启用按钮
                        }, 300); // 延迟时间与过渡时间匹配
                    }, 0); 
                });
            }
        },
        changePoint(index) {
            if(index == this.current) return
            this.isrever = index < this.current
            this.current = index
            this.title = this.carousels[this.current - 1].title;
            this.color = this.carousels[this.current - 1].color;
        }

    },
    created() {
        this.getCarousels();
    },
    mounted() {
        // 初始化定时器
        this.startTimer();
    },
    beforeUnmount() {
        // 清理定时器
        if (this.timer) {
        clearInterval(this.timer);
        }
    }
}
</script>

<style scoped>
    .abc{
        position: relative;
        width: 100%;
        height: 100%;
        background-color: rgb(215, 250, 244);
        overflow: hidden;
        border-radius: 10px;
    }
    .carousel-swrp{
        position: absolute;
        display: flex;
        width: 800%;
        height: 100%;
        translate: 0;
    }

    .carousel-swrp img{
        width: 100%;
    }

    .shadow {
        position: absolute;
        width: 100%;
        height: 50%;
        bottom: 0;
        pointer-events: none;   /* 禁止蒙版元素捕获鼠标事件 */
        z-index: 1;
    }

    .carousel-footer-left {
        position: absolute;
        bottom: 20px;
        left: 15px;
        z-index: 1;
    }

    .page{
        display: flex;
        align-items: center;
    }

    .carousel-footer-left .point{
        position: relative;
        display: inline-block;
        width: 8px;
        height:8px;
        margin: 4px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, .4);
        cursor: pointer;
        /* transition: left 0.5s ease; */
    }

    .carousel-footer-left .is-active.point{
        width: 14px;
        height:14px;
        margin: 1px;
        border-radius: 50%;
        background-color: transparent;
        /* transition: left 0.5s ease; */
    }

    .btn{
        align-items: center;
        justify-content: center;
        display: flex;
        width: 28px;
        height: 28px;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.171);
        justify-content: center;
        align-items: center;
        margin-right: 5px;
        border-width: 0;
        cursor: pointer;
    }

    .btn:hover{
        background-color: rgba(255, 255, 255, 0.295);
    }

    .btn i{ 
        color: #fff;
        font-size: 10px;
    }


    /* 吃豆人动画 */

     .is-active .before{
        position: absolute;
        width: 14px;
        height: 7px;
        background-color: #fff;
        border-radius: 7px 7px 0 0;
        top: 0;
        transform-origin: center bottom;
        animation: eat-up 0.75s linear forwards;
     }
     .is-active .after{
        position: absolute;
        width: 14px;
        height: 7px;
        background-color: #fff;
        border-radius:  0 0 7px 7px;
        bottom: 0;
        transform-origin: center top;
        animation: eat-down 0.75s linear forwards;
     }

     .isrever .before{
        animation: eat-down 0.75s linear forwards;
     }

     .isrever .after{
        animation: eat-up 0.75s linear forwards;
     }

    .title span{
        display: block;
        font-weight: 400;
        line-height: 25px;
        font-size: 18px;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 10px;
        
    }

    .carousel-footer-right{
        position: absolute;
        z-index: 1;
        display: flex;
        align-items: flex-end;
        bottom: 50px;
        right: 20px;
    }


    @keyframes eat-up{
        0%{
            transform: rotate(0deg);
        }
        25%{
            transform: rotate(-45deg);
        }
        50%{
            transform: rotate(0deg);
        }
        75%{
            transform: rotate(-45deg);
        }
        100%{
            transform: rotate(0deg);
        }
    }

    @keyframes eat-down{
        0%{
            transform: rotate(0deg);
        }
        25%{
            transform: rotate(45deg);
        }
        50%{
            transform: rotate(0deg);
        }
        75%{
            transform: rotate(45deg);
        }
        100%{
            transform: rotate(0deg);
        }
    }
</style>