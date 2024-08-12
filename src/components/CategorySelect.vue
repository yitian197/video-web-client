<template>
    <div class="category-select">
      <div
        class="select-controller"
        ref="categorySelectController"
        :class="isShowPop ? 'select-controller-selecting' : ''"
        @click="toggleDropdown"
      >
        <p class="select-item-inserted">
          {{ category[0].name }} → {{ category[1].name }}
        </p>
        <i class="iconfont icon-xiajiantou-copy" :class="isShowPop ? 'selecting-icon' : ''"></i>
      </div>
      <div 
        class="drop-container" 
        :class="{ 'drop-container-show': isShowPop, 'drop-container-hide': !isShowPop }"
        ref="categoryPop"
      >
        <div class="drop-main">
          <div v-if="categoryList.length !== 0">
            <div
              class="drop-main-item"
              :class="main === index ? 'drop-main-item-selected' : ''"
              v-for="(item, index) in categoryList"
              :key="index"
              @click="selectMain(index)"
            >
              {{ item.mcName }}
            </div>
          </div>
        </div>
        <div class="drop-sub" v-if="categoryList.length !== 0">
          <div
            class="drop-sub-item"
            v-for="(item, index) in categoryList[main].scList"
            :key="index"
            @click="selectSubCategory(index)"
          >
            <p class="item-name" :class="isSelectedSubCategory(item) ? 'drop-sub-item-selected' : ''">
              {{ item.scName }}
            </p>
            <p class="item-descr" v-if="item.descr">{{ item.descr }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CategorySelect',
    data() {
      return {
        isShowPop: false,
        main: 0,
        sub: 0,
      };
    },
    computed: {
        // 分区列表
        categoryList() {
            return this.$store.state.channels;
        }
    },
    props: {
      category: {
        type: Array,
        default() {
          return [{id: "anime", name: "番剧"}, {id: "finish", name: "完结动画"}];
        },
      },
    },
    methods: {
      toggleDropdown() {
        this.isShowPop = !this.isShowPop;
      },
      selectMain(index) {
        this.main = index;
        this.sub = 0; // Reset subIndex when selecting a new main category
        this.$nextTick(() => {
          const dm = this.$refs.categoryPop.querySelector('.drop-main');
          const dmis = dm.querySelector('.drop-main-item');
          dm.scrollTo({
            behavior: 'smooth',
            top: dmis.clientHeight * index,
          });
        });
      },
      selectSubCategory(index) {
        this.sub = index;
        console.log('开始获取',index)
        const main = {id: this.categoryList[this.main].mcId, name: this.categoryList[this.main].mcName};
        const sub = {id: this.categoryList[this.main].scList[this.sub].scId, name: this.categoryList[this.main].scList[this.sub].scName};
        console.log(main,sub)
        this.$emit("update:category", [main, sub]);     // 将分区更新回父组件
        this.isShowPop = false;
      },
      isSelectedSubCategory(item) {
        const selectedMain = this.categoryList[this.main];
        return selectedMain && selectedMain.scList[this.sub] === item;
      },
      handleOutsideClick(event) {
        const csc = this.$refs.categorySelectController;
        const cp = this.$refs.categoryPop;
        if (!csc.contains(event.target) && !cp.contains(event.target)) {
          this.isShowPop = false;
        }
      },
    },
    mounted() {
      window.addEventListener('click', this.handleOutsideClick);
    },
    beforeUnmount() {
      window.removeEventListener('click', this.handleOutsideClick);
    },
  };
  </script>
  
  <style scoped>
  .category-select {
    position: relative;
    user-select: none;
  }
  
  .select-controller {
    padding: 7px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    min-width: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    color: #99a2aa;
    background: #fff;
    transition: border 0.3s ease;
  }
  
  .select-controller:hover {
      border-color: #00a1d6;
  }

  .select-controller-selecting {
      border-color: #00a1d6;
  }
  
  .icon-xiajiantou-copy {
    font-size: 12px;
    transition: transform 0.3s;
  }
  
  .selecting-icon {
    transform: rotate(180deg);
  }
  
  .select-item-inserted {
    color: #222;
    font-size: 14px;
    white-space: nowrap;
  }
  
  .drop-container {
    background: #fff;
    border: 1px solid #e5e9ef;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    position: absolute;
    left: 0;
    top: 46px;
    z-index: 10;
    display: flex;
    flex-direction: row; /* Ensure horizontal layout */
  }
  
  .drop-container-show {
    display: flex; /* Ensure the dropdown is shown with flex layout */
  }
  
  .drop-container-hide {
    display: none; /* Ensure the dropdown is hidden */
  }
  
  .drop-main {
    padding: 12px 0;
    width: 128px; /* Ensure enough width for main categories */
    height: 264px;
    overflow-y: auto;
    border-right: 1px solid #e5e9ef; /* Add border to separate from sub categories */
  }
  
  .drop-main-item {
    padding: 12px 24px;
    cursor: pointer;
    font-size: 14px;
    line-height: 19px;
    color: #212121;
  }
  
  .drop-sub {
    padding-top: 12px;
    flex: 1; /* Take up remaining space */
    height: 264px;
    overflow-y: auto;
    min-width: 128px;
  }
  
  .drop-sub-item {
    padding: 12px 24px;
    cursor: pointer;
    display: flex;
    white-space: nowrap;
  }
  
  .item-name {
    font-size: 14px;
    color: #212121;
    margin-right: 18px;
    white-space: nowrap;
  }
  
  .item-descr {
    font-size: 12px;
    color: #999;
  }
  
  .drop-main-item:hover, .drop-sub-item:hover {
    background-color: #f4f5f7;
  }
  
  .drop-main-item-selected, .drop-sub-item-selected {
    color: #00a1d6;
  
  
  }
  
  .drop-main::-webkit-scrollbar, .drop-sub::-webkit-scrollbar {
    width: 8px; /* Width of the scrollbar */
  }

  .drop-main::-webkit-scrollbar-thumb, .drop-sub::-webkit-scrollbar-thumb {
    background-color: #cecece; /* Color of the scrollbar thumb */
  }

  .drop-main::-webkit-scrollbar-track, .drop-sub::-webkit-scrollbar-track {
    background: #fff; /* Background of the scrollbar track */
  }
  </style>
  