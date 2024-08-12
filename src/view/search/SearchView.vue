<template>
  <div class="search-view">
    <NavBar :isFixHeaderBar="true" :isShowSearchInput="false"></NavBar>
    <header class="search-header">
      <div class="search-spacing">
        <div :class="['search-container', { 'is-fixed': isFixed }]">
          <i v-if="isFixed" class="iconfont icon-bilibili"></i>
          <div class="search-form" :class="{ 'isfocus': isFocused, 'isactivied': isactivied }">
            <div class="search-content">
              <i class="iconfont icon-sousuo"></i>
              <input  
                type="text"  
                class="search-input"  
                placeholder="请输入搜索内容"
                v-model="searchInput"
                @keyup.enter="goSearch"
                @focus="handleBoth(true)"  
                @blur="handleActivied(false)"  
              >  
            </div>
            <div class="search-btn" @click="goSearch">
              <span>搜索</span>
            </div>
          </div>
        </div>
      </div>
      <ul class="nav">
        <div class="nav-tab">
          <li class="nav-item" 
              :class="{'active': index === routerIndex}"
              v-for="(item, index) in router" 
              :key="index"
              @click="changeNav(item.path, index)"
          >
              <div class="nav-text">
                {{ item.name }}
              </div>
              <span class="nav-num">{{ matchingCount[index] }}</span>
          </li>
          <div class="nav-slider" :style="sliderStyle"></div>  
        </div>
        
      </ul>
      <div class="search_line"></div>
    </header>
    
    <div class="search-content">
      <router-view :key="$route.path"></router-view>
    </div>
    
    <!-- 显示错误信息 -->
    <div class="error-message" v-if="error">
      {{ error }}
    </div>

    <div class="abc"></div>
  </div>
</template>

<script>
import NavBar from '@/components/NavigationBar.vue';

export default {
  name: "SearchView",
  components: {
    NavBar
  },
  data() {
    return {
      searchInput: this.$route.query.keyword || '', 
      isFocused: false,
      isactivied: false,
      isFixed: false,
      timeoutId: null,
      error: null, // 存储错误信息
      router: [
        { path: '/search/all', name: '全部' },
        { path: '/search/user', name: '用户' },
        { path: '/search/article', name: '文章' },
      ],
      routerIndex: 0, // 当前激活的导航项索引
      sliderPosition: { left: '0px', width: '0px' } // 新增滑块位置数据
    };
  },
  computed: {
    matchingCount() {
      return this.$store.state.matchingCount || [];
    },
    sliderStyle() {
      return {
        left: this.sliderPosition.left,
        width: this.sliderPosition.width
      };
    }
  },
  mounted() {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);

    // 初始化激活的导航项
    this.routerIndex = this.router.findIndex(item => item.path === this.$route.path);
    this.updateSliderPosition();

    // 更新滑块位置
    this.$nextTick(() => {
      this.updateSliderPosition();
    });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    goSearch() {
      if (!this.searchInput.trim()) {
        return;
      }

      const query = encodeURIComponent(this.searchInput.trim());
      const searchUrl = `${this.router[this.routerIndex].path}?keyword=${query}`;

      this.$router.push(searchUrl);
    },
    handleBoth(value) {
      this.isFocused = value;
      this.isactivied = true;
    },
    handleActivied(value) {
      this.isactivied = value;
    },
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      if (scrollTop > 100) {
        this.timeoutId = setTimeout(() => {
          this.isFixed = true;
        }, 80);
      } else {
        this.isFixed = false;
      }
    },
    changeNav(path, index) {
      this.routerIndex = index;
      const keyword = this.$route.query.keyword || this.searchInput;
      const newUrl = `${path}?keyword=${keyword}`;
      this.$router.push(newUrl);

      // 更新滑块位置
      this.$nextTick(() => {
        this.updateSliderPosition();
      });
    },
    updateSliderPosition() {
      this.$nextTick(() => {
        const navItems = this.$el.querySelectorAll('.nav-item');
        const activeItem = navItems[this.routerIndex];
        if (activeItem) {
          const { offsetLeft, offsetWidth } = activeItem;
          this.sliderPosition = {
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`
          };
        }
      });
    }
  },
  watch: {
    '$route.path'(newPath) {
      this.routerIndex = this.router.findIndex(item => item.path === newPath);
      this.updateSliderPosition();
    }
  }
};
</script>




<style scoped>
.abc {
  height: 10000px; /* 用于填充页面的高度 */
}

/* .search-header {
} */

.search-spacing {
  margin: 40px 0; /* 上下间距 */
  height: 40px;
}

.search-container {
  width: 100%; /* 占页面宽度的100% */
  min-width: 300px; /* 最小宽度，确保适应小屏幕 */
  margin: 0 auto; /* 在容器中居中 */
  display: flex;
  align-items: center; /* 垂直居中 */
  position: relative; /* 相对定位，以便在固定时正确定位图标 */
  transition: position 0.3s ease, border 0.3s ease; /* 平滑过渡效果 */
}

.search-container.is-fixed {
  position: fixed;
  top: 0; /* 固定状态下与页面顶部的距离 */
  left: 50%; /* 从页面中间开始 */
  transform: translateX(-50%); /* 将容器水平居中 */
  background-color: #ffffff; /* 固定状态的背景颜色 */
  z-index: 1000; /* 确保在其他内容之上 */
  padding: 10px; /* 上下内边距 */
  box-sizing: border-box; /* 包括内边距和边框在宽度计算中 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, .08);
}

.search-container.is-fixed .icon-bilibili {
  position: absolute; /* 绝对定位图标 */
  left: 20px; /* 图标距离容器左侧的距离 */
  font-size: 30px;
  color: rgb(255, 161, 177);
  margin-right: 20px; /* 图标和搜索框之间的间距 */
}

.search-form {
  display: flex;
  align-items: center;
  height: 55px;
  background-color: #f6f7f8;
  border-radius: 8px; /* 增加圆角半径，显得更圆润 */
  width: 30%; /* 占满容器宽度的20% */
  max-width: 600px; /* 最大宽度 */
  border: 1px solid #f1f2f3;
  margin: 0 auto; /* 在容器中居中 */
}

.search-form.isactivied {
  background: #ffffff;
  border-color: #00aeec;
}

.search-content {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 10px; /* 增加内边距 */
}

.icon-sousuo{
  display: inline-block;
  color: #00aeec;
  font-size: 20px;
  font-weight: bold;
}


.search-input {
  width: 100%;
  padding: 12px; /* 增加内边距，让输入框更大 */
  background: none;
  border: none;
  border-radius: 8px 0 0 8px; /* 调整圆角，使其更圆润 */
  outline: none;
  font-size: 16px; /* 增加字体大小 */
}

.search-btn {
  padding: 12px 16px; /* 增加内边距，使按钮更大 */
  background-color: #00aeec;
  margin-right: 5px;
  color: #ffffff;
  border-radius: 8px; /* 调整圆角，使其与输入框相配 */
  cursor: pointer;
  font-size: 16px; /* 增加字体大小 */
}

.search-btn:hover {
  background-color: #00adecaf;
}

/* .nav {
} */

.nav-tab{
  position: relative;
  display: flex;
  list-style-type: none;
  padding: 0 50px ;
  margin: 0;
}

.nav-item {
  padding:0 10px;
  margin-left: 30px;
  cursor: pointer;
  position: relative;
  font-size: 16px;
  color:#61666d;
}

.nav-item.active {
  color: #00aeec;
}

.nav-slider {
  position: absolute;
  bottom: 0;
  height: 3px;
  background-color: #00aeec;
  transition: left 0.3s ease, width 0.3s ease; /* 平滑过渡效果 */
}

.nav-num {
  margin-left: 10px;
}
.search_line{
  margin-top: 3px;
    border: none;
    border-top: 1px solid #f1f2f3;
}
</style>
