<template>
    <div :class="videoClass" id="video-container" ref="videoContainer">
        <video id="video" controls @play="onPlay" @pause="onPause" @timeupdate="onTimeUpdate">
            <source src="http://127.0.0.1:5050/upload/videos/f4b7f469fa1fd935c2ab03ff252ff18d.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div id="danmu-container">
            <div 
                v-for="danmu in activeDanmus" 
                :key="danmu.id"
                class="danmu" 
                :style="{ 
                    color: danmu.color, 
                    top: `${danmu.top}%`,
                    transform: `translateX(${danmu.startX}px)`,
                    animationDuration: `${danmu.duration}s`,
                    animationDelay: `${danmu.delay}s`,
                }"
            >
                {{ danmu.text }}
            </div>
        </div>
        <button class="fullscreen-btn" @click="toggleFullscreen">全屏</button>
    </div>
</template>

<script>
export default {
    name: 'VideoPlayer',
    data() {
        return {
            danmus: [
                { id: 1, text: '你好，世界！', time: 5, color: '#FF0000' },
                { id: 2, text: '这是一条测试弹幕', time: 10, color: '#00FF00' },
                { id: 3, text: '弹幕测试中...', time: 15, color: '#0000FF' },
                { id: 4, text: '继续测试中...', time: 20, color: '#FFFF00' },
            ],
            activeDanmus: [], // 存储活动的弹幕
            isplaying: false, // 记录视频是否在播放
            videoWidth: 0, // 存储视频容器的宽度
            videoHeight: 0, // 存储视频容器的高度
            danmuTimeouts: {} // 存储弹幕移除的定时器ID
        };
    },
    computed: {
        videoClass() {
            return this.isplaying ? 'isPlaying' : 'isPause';
        }
    },
    mounted() {
        this.updateVideoSize();
        window.addEventListener('resize', this.updateVideoSize);
        document.addEventListener('fullscreenchange', this.updateVideoSize); // 监听全屏变化
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateVideoSize);
        document.removeEventListener('fullscreenchange', this.updateVideoSize);
        // 清理所有定时器
        Object.values(this.danmuTimeouts).forEach(clearTimeout);
    },
    methods: {
        onPlay() {
            this.isplaying = true;
        },
        onPause() {
            this.isplaying = false;
        },
        onTimeUpdate() {
            const video = document.getElementById('video');
            const currentTime = video.currentTime;

            // 根据当前时间检查并显示弹幕
            this.danmus.forEach(danmu => {
                if (danmu.time <= currentTime && !this.activeDanmus.some(d => d.id === danmu.id)) {
                    this.addDanmu(danmu);
                }
            });
        },
        addDanmu(danmu) {
            const duration = 10 + Math.random() * 10; // 动画持续时间（秒）
            const delay = 0; // 动画开始前的延迟（秒）

            this.activeDanmus.push({
                ...danmu,
                top: (danmu.top / 100) * this.videoHeight, // 根据容器高度设置初始位置
                duration,
                delay,
                startX: this.videoWidth // 动画开始的位置（右边缘）
            });

            // 移除弹幕的定时器ID
            const timeoutId = setTimeout(() => {
                if (this.isplaying) {
                    this.activeDanmus = this.activeDanmus.filter(d => d.id !== danmu.id);
                }
            }, (duration + delay) * 1000);

            this.danmuTimeouts[danmu.id] = timeoutId; // 存储定时器ID
        },
        updateVideoSize() {
            if (document.fullscreenElement) {
                // 在全屏模式下
                this.videoWidth = window.innerWidth;
                this.videoHeight = window.innerHeight;
            } else {
                // 在普通模式下
                this.videoWidth = this.$refs.videoContainer.clientWidth;
                this.videoHeight = this.$refs.videoContainer.clientHeight;
            }

            // 更新弹幕位置
            this.activeDanmus.forEach(danmu => {
                danmu.top = (danmu.top / this.videoHeight) * this.videoHeight;
                danmu.startX = this.videoWidth;
            });
        },
        toggleFullscreen() {
            const videoContainer = this.$refs.videoContainer;

            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoContainer.requestFullscreen();
            }
        }
    },
};
</script>



<style scoped>
/* 视频容器 */
#video-container {
    position: relative;
    width: 640px; /* 初始宽度 */
    height: 360px; /* 初始高度 */
    overflow: hidden;
}

/* 视频元素 */
#video {
    width: 100%;
    height: 100%;
}

/* 弹幕容器 */
#danmu-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: 10; /* 确保在视频上方 */
}

/* 弹幕样式 */
.danmu {
    position: absolute;
    white-space: nowrap;
    font-size: 16px;
    animation: moveLeft linear;
}

/* 动画关键帧 */
@keyframes moveLeft {
    0% {

    }
    100% {
        transform: translateX(-100%);
    }
}
/* 播放时的弹幕样式 */
.isPlaying .danmu {
    animation-play-state: running;
}

/* 暂停时的弹幕样式 */
.isPause .danmu {
    animation-play-state: paused;
}

/* 自定义全屏按钮样式 */
.fullscreen-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 10px 20px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 20; /* 确保按钮在视频上方 */
}

/* 隐藏默认的全屏按钮 */
#video::-webkit-media-controls-fullscreen-button {
    display: none;
}

/* 全屏样式 */
/* :fullscreen #video-container {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    position: fixed;
    z-index: 9999; 
} */
</style>
