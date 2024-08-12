<template>
    <div class="account-view">
        <div class="header">
            <span class="header-title-icon"></span>
            <span class="header-title">我的信息</span>
        </div>
        <div v-if="isLoading" class="loading">加载中...</div>
        <div v-else class="user-setting-warp">
            <div>
                <form @submit.prevent="saveChanges" class="info-form">
                    <div class="info-item user-nick-name">
                        <label class="info-form-item__label">昵称:</label>
                        <div class="el-form-item__content">
                            <div class="el-input"><!---->
                                <el-input type="text" placeholder="你的昵称" v-model="username" maxlength="24" />
                            </div> 
                            <!-- <span class="nick-name-not">注：修改一次昵称需要消耗6个硬币</span> -->
                        </div>
                    </div>
                    <div class="info-item user-uid">
                        <label class="info-form-item__label">UID:</label>
                        <div class="el-form-item__content">
                            <span class="user-uid-text">{{ this.$store.state.user.uid }}</span>
                        </div>
                    </div>
                    <div class="info-item user-my-sign">
                        <label class="info-form-item__label">我的签名:</label>
                        <div class="el-form-item__content">
                            <el-input type="textarea" placeholder="设置您的签名- ( ゜- ゜)つロ" v-model="description"  maxlength="100" resize="none" :rows= "4" />
                        </div>
                    </div>
                    <div class="info-item user-my-sex">
                        <label class="info-form-item__label">性别:</label>
                        <div class="el-form-item__content">
                            <div class="radio-group">
                                <span class="radio-item" :class="{'check': gender === 1}" @click="gender = 1">男</span>
                                <span class="radio-item" :class="{'check': gender === 0}" @click="gender = 0">女</span>
                                <span class="radio-item" :class="{'check': gender === 2}" @click="gender = 2">保密</span>
                            </div>
                        </div>
                    </div>

                <!-- <label for="email">邮箱:</label>
                <input type="email" v-model="user.email" id="email" /> -->
                <div class="padding-dom"></div>
                <div class="user-my-btn-warp">
                    <div class="btn" @click="submit">保存更改</div>
                </div>
                
                </form>
            </div>
        </div>
        <!-- <div class="profile-header">
      <img :src="user.avatar_url" alt="用户头像" class="profile-avatar" />
      <button @click="triggerFileInput">更改头像</button>
      <input type="file" ref="fileInput" @change="uploadAvatar" style="display: none;" />
        </div>
        <label>uid:{{ user.uid }}</label>
        <p></p>
        <form @submit.prevent="saveChanges" class="profile-info-form">
        <label for="username">用户名:</label>
        <input type="text" v-model="user.username" id="username" />

        <label for="email">邮箱:</label>
        <input type="email" v-model="user.email" id="email" />

        <label for="password">密码:</label>
        <input type="password" v-model="user.password" id="password" />

        <button type="submit">保存更改</button>
        </form> -->
    </div>
</template>

<script>
    import request from '@/utils/request'
    // import axios from 'axios';

    export default{
        data() {
            return {
                username: "",
                description: "",
                gender: 2,
                isLoading: true,
            }
        },
        computed:{
            user() {
            return this.$store.state.user;
            },
        },
        methods:{
            // submit(){
            //     console.log(this.username)
            //     const formData = new FormData();
            //     formData.append("username", this.username);
            //     formData.append("description", this.description);
            //     formData.append("gender", this.gender);
            //     for (let [key, value] of formData.entries()) {
            //         console.log(`${key}: ${value}`);
            //     }
            // }
            async submit() {
                console.log('提交')
                // if (!this.hadChanged || this.isLoading) return;
                // this.username = this.username.trim();
                // if (this.username.length === 0) {
                //     console.log('昵称不能为空白')
                //     return;
                // }
                // if (this.getNicknameLength(this.nickname) > 32) {
                //     console.log('昵称过长')
                //     return;
                // }
                this.isLoading = true;
                const formData = new FormData();
                formData.append("username", this.username);
                formData.append("description", this.description);
                formData.append("gender", this.gender);
                // const res = await this.$post("/user/info/update", formData, {
                //     headers: { Authorization: "Bearer " + localStorage.getItem("teri_token") }
                // });
                // if (!res.data || res.data.code !== 200) {
                //     this.isLoading = false;
                //     return;
                // }

                // const token = localStorage.getItem('userToken');
                // try {
                //     const response = await axios.put('http://127.0.0.1:5050/update/user', formData, {
                //     headers: {
                //         'Authorization': `Bearer ${token}`
                //     }
                //     });

                //     // Use response data here if needed
                //     console.log('服务器返回的响应:', response.data);
                //     alert('用户信息保存成功');
                // } catch (error) {
                //     console.error('保存用户信息失败', error);
                //     alert('保存用户信息失败');
                // }

                //要用的
                const res = await request.put('/update/user', formData, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}` // 将 token 添加到 Authorization 头
                  },
                });
                console.log(res)
                if (!res || res.status !== 200) {
                    this.isLoading = false;
                    console.log('fail')
                    return;
                }

                // const res = await request.get('/userinfo', {
                //     headers: {
                //         'Authorization': `Bearer ${localStorage.getItem('userToken')}` // 将 token 添加到 Authorization 头
                //     },
                // });
                // if (!res) return;
                // console.log(res.data)

                this.$store.state.user.username = this.username;
                this.$store.state.user.description = this.description;
                this.$store.state.user.gender = this.gender;
                this.isLoading = false;
                console.log('信息更新成功')
                // ElMessage.success("信息更新成功")
            },
        },
        mounted() {
            if (this.$store.state.user.username) {
                this.username = this.$store.state.user.username;
                this.description = this.$store.state.user.description;
                this.gender = this.$store.state.user.gender;
                this.isLoading = false; // 数据已加载完成
            } else {
                // 数据未加载时显示加载中状态
                this.isLoading = true;
                // 可以在这里发起请求来获取用户数据，如果需要
            }
        },
        watch: {
            'user.username': function(newValue) {
                if (newValue) {
                    this.username = newValue;
                    this.description = this.user.description;
                    this.gender = this.user.gender;
                    this.isLoading = false; // 数据加载完成
                }
            }
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

    .user-setting-warp{
        padding: 20px 20px 0;
        position: relative;
    }
    .info-item{
        margin-bottom: 22px;
    }
    
    .info-form-item__label{
        width: 95px;
        text-align: right;
        margin-right: 20px;
        float: left;
        line-height: 30px;
        padding: 0;
        font-size: 14px;
        color: #606266;
    }

    .user-nick-name .el-input {
        float: left;
        width: 225px;
        height: 30px;
        margin-right: 40px;
    }

    .user-uid .user-uid-text {
        font-size: 14px;
        color: #898989;
    }

    .user-my-sign .el-textarea {
        float: left;
        width: 618px;
        height: 88px;
        resize: none;
    }

    .radio-item {
        margin-right: 20px;
        padding: 5px 8px;
        border: 1px solid #bfcbd9;
        border-radius: 5px;
        background: #f4f4f4;
        color: #717171;
        cursor: pointer;
        transition: all .3s cubic-bezier(.645,.045,.355,1);
        text-align: center;
    }

    .radio-item.check {
        background-color: #00a1d6;
        border-color: #00a1d6;
        color: #fff;
    }
    .padding-dom{
        width: 789px;
        height: 39px;
        border-bottom: 1px solid #e5e9ef;
        margin-bottom: 40px;
    }

    .user-my-btn-warp{
        float: left;
        width: 789px;
        height: 36px;
        position: relative;
    }

    .btn {
        height: 36px;
        width: 110px;
        border-radius: 4px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        color: var(--text2);
        background: #00a1d6;
        text-align: center;
        line-height: 36px;
        cursor:pointer;
        color: #fff;
    }
</style>