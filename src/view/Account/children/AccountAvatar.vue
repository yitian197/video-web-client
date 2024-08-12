<template>
    <div class="account-view">
        <div class="header">
            <span class="header-title-icon"></span>
            <span class="header-title">我的头像</span>
        </div>
        <div class="avatar">
            <div class="profile-header">
                <img :src="user.avatar_url" alt="用户头像" class="profile-avatar" />
                <button @click="triggerFileInput">更改头像</button>
                <input type="file" ref="fileInput" @change="uploadAvatar" style="display: none;" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

    export default{
        methods:{
            triggerFileInput() {
                this.$refs.fileInput.click();
                },
                async uploadAvatar(event) {
                const file = event.target.files[0];
                const token = localStorage.getItem('userToken');
                if (!file) {
                    alert('请选择一个文件');
                    return;
                }

                const formData = new FormData();
                formData.append('avatar', file); // 字段名称应与 Multer 配置一致
                for (let pair of formData.entries()) {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
                try {
                    const response = await axios.post('http://127.0.0.1:5050/update/avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}` // 添加认证头部
                    }
                    });
                    console.log(response.data.fileUrl)
                    // 更新用户头像 URL
                    this.$store.state.user.avatar_url = response.data.fileUrl;
                    alert('头像上传成功');
                } catch (error) {
                    console.error('上传头像失败', error);
                    alert('头像上传失败');
                }
            }
        },
        computed:{
            user() {
            return this.$store.state.user;
            },
        }
    }
</script>

<style scoped>
    .header{
        height: 50px;
        padding-left: 30px;
        border-bottom: 1px solid #ddd;
    }
    .header-title-icon{
        float: left;
        width: 4px;
        height: 16px;
        margin-top: 18px;
        background-color: #00a1d6;
        border-radius: 4px;
    }
    .header-title{
        float: left;
        margin: 15px 0 0 5px;
        color: #00a1d6;
        font-size: 14px;
        cursor: default;
    }

    .profile-avatar{
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
</style>