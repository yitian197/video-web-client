<template>
    <div class="input-container" :class="isFocus ? 'isfocus' : ''">
        <div class="tag-pre-wrp">
            <div class="label-item-container" v-for="(item, index) in tags" :key="index" @click="removetag(index)">
                <div class="label-item-content">{{ item }}</div>
                <i class="iconfont icon-close"></i>
            </div>
        </div>
        <div class="input-instance">
            <input 
            type="text" 
            maxlength="20" 
            placeholder="按回车键Enter创建标签" 
            v-model="input"
            class="input-val" 
            @focus="isFocus = true;"
            @blur="isFocus = false;"
            @keyup.enter="addTag" />
        </div>
        <p class="tag-last-wrp">还可以添加{{ 10 - this.tags.length }}个标签</p>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';

    export default{
        name: 'TagInput',
        data(){
            return{
                isFocus:false,
                input:'',
                tags:[]
            }
        },
        props: {
            // 用于接收点击添加的标签，在watch里监听变化，使用v-model:sendTag进行双向绑定
            // sendTag: {
            //     type: String,
            //     default() {
            //         return "";
            //     }
            // },
        },
        methods:{
            removetag(index){
                this.tags.splice(index, 1);
                this.$emit("updateTags", this.tags);
            },
            addTag(){
                const tag = this.input.trim();
                if (tag.length <= 0 || this.tags.length >= 10) return;
                if (this.tags.findIndex(curr=>curr==tag) != -1) {
                ElMessage.error("标签已存在，不能重复添加");
                return;
                }
                this.tags.push(tag);
                this.input = "";
                // console.log("添加的标签: ", this.tags);
                this.$emit("updateTags", this.tags);
            }
        }
    }
</script>

<style scoped>
    .input-container{
        background: hsla(0, 0%, 84.7%, 0);
        border: 1px solid #ccd0d7;
        border-radius: 4px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        transition: border .3s ease;
    }

    .input-container.isfocus{
        border-color: #00a1d6;
    }

    .input-container:hover{
        border-color: #00a1d6;
    }

    input::placeholder {
        color: #bbbbbb; /* 修改为你需要的颜色 */
        opacity: 1; /* 如果需要完整的不透明度 */
    }

    .tag-pre-wrp{
        display: flex;
        flex-wrap: wrap;
    }

    .label-item-container{
        margin: 4px 6px 4px 0;
        background: #00a1d6;
        border-radius: 4px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding: 0 9px 0 11px;
        cursor: pointer;
        color: #fff;
    }

    .label-item-content{
        line-height: 30px;
        max-width: 240px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .input-instance{
        display: flex;
        align-items: center;
        flex: 1;
    }

    .icon-close{
        margin-left: 5px;
        font-size: 12px;
    }

    .input-val{
        display: block;
        width: 100%;
        color: #222;
        line-height: 22px;
        height: 22px;
        font-size: 14px;
        outline: 0;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border: 0;
        background-color: transparent;
    }

    .tag-last-wrp{
        font-size: 14px;
        color: #858585;
        margin: 8px 0 8px 12px;
        cursor: default;
    }
</style>