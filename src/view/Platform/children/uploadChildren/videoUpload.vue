<template>
    <div class="video-upload">
      <!-- 选择文件界面 -->
      <div class="upload-body-content" :style="selectedVideo ? 'display: none;' : ''">
            <div class="upload-wrp">
                <div class="video-input">
                    <div
                        class="video-input-wrapper"
                        @dragover.prevent
                        @dragenter.prevent
                        @dragleave.prevent
                        @drop.prevent
                        @drop="handleDrop"
                        @click="selectVideo"
                    >
                        <i class="iconfont icon-shangchuan"></i>
                        <!-- <el-icon size="40"><UploadFilled /></el-icon> -->
                        <div class="upload-tips-text">拖拽到此处也可上传</div>
                        <div class="upload-btn">上传视频</div>
                        <input
                            type="file"
                            accept=".mp4"
                            ref="videoInput"
                            @change="handleVideoChange"
                            style="display: none;"
                        >
                    </div>
                </div>
            </div>
        </div>
      <div class="info-content" :style="selectedVideo ? '' : 'display: none;'">
        <div class="info-header">
            <span>发布视频</span>
            <div class="cancel-btn" @click="beforeCancel">取消发布</div>
        </div>
        <div class="info-body">
          <div class="file-upload-container">
            <i class="iconfont icon-ziyuan"></i>
            <div class="file-info">
              <div class="video-name">{{ videoName }}</div>
              <div class="video-file">
                <div class="video-icon-wrp"><i class="iconfont icon-video"></i></div>
                <div class="file-detail">
                    <div class="file-status">
                        <div class="file-status-text" v-if="progress >= 100">
                            <i class="iconfont icon-wancheng success"></i>
                            <span class="success">分片上传完成</span>
                        </div>
                        <!-- <div class="file-status-text" v-else-if="isFailed">
                            <i class="iconfont icon-shibai failed"></i>
                            <span class="failed">分片上传失败</span>
                        </div> -->
                        <!-- <div class="file-status-text" v-else-if="!isPause">
                            <i class="iconfont icon-shangchuanzhong"></i>
                            <span style="margin-right: 8px;">上传中</span>
                            <span>{{ progress }}%</span>
                        </div> -->
                        <!-- <div class="file-status-text" v-else>
                            <i class="iconfont icon-zantingshangchuan"></i>
                            <span style="margin-right: 8px;">暂停中</span>
                            <span>{{ progress }}%</span>
                        </div> -->
                        <!-- <div class="file-status-manage refresh" v-if="progress >= 100 || isPause" @click="selectVideo">
                            <i class="iconfont icon-genghuan"></i>
                            <span>更换视频</span>
                        </div>
                        <div class="file-status-manage pause" v-if="progress < 100 && !isPause" @click="changeState">
                            <i class="iconfont icon-zantingshangchuan"></i>
                            <span>暂停上传</span>
                        </div>
                        <div class="file-status-manage continue" v-if="progress < 100 && isPause" @click="changeState">
                            <i class="iconfont icon-jixu"></i>
                            <span>继续上传</span>
                        </div> -->
                    </div>
                    <div class="file-progress">
                        <div class="file-progress-outer">
                            <div
                                class="file-progress-inner"
                                :class="progress >= 100 ? 'success-bg' :  'doing-bg'" 
                                :style="`width: ${progress}%;`"
                            ></div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div class="upload-form">
              <div class="form-title">基本信息</div>
              <!-- 封面 -->
              <div class="form-item cover">
                <div class="section-title">
                    <span class="section-title-deg">*</span>
                    <span class="section-title-main">封面</span>
                </div>
                <div class="cover-container">
                    <img :src="coverURL" v-if="coverURL">
                </div>
                <div class="cover-btn">
                    <el-button class="change-cover-btn"  @click="cutCover(coverImageURL)">使用第一帧当封面</el-button>
                    <el-button class="change-cover-btn"  @click="triggerFileInput">上传封面</el-button>
                </div>  
                    <input type="file" ref="fileInput" @change="handlePicChange" style="display: none;" />
              </div>
              <div class="form-item title">
                <div class="section-title">
                    <span class="section-title-deg">*</span>
                    <span class="section-title-main">标题</span>
                </div>
                <div class="input-wrp">
                  <el-input
                    v-model="form.title"
                    maxlength="80"
                    placeholder="起个吸引人的标题吧"
                    show-word-limit
                    type="text"
                  />
                </div>
              </div>
              <div class="form-item type">
                <div class="type-container">
                  <div class="section-title">
                      <span class="section-title-deg">*</span>
                      <span class="section-title-main">类型</span>
                  </div>
                  <div class="type-radio">
                      <div class="type-radio-item" @click="form.type = 1">
                          <div class="radio-box">
                              <div class="radio-box-selected" :style="form.type == 1 ? '' : 'display: none;'"></div>
                          </div>
                          <span class="radio-name" :class="form.type == 1 ? 'radio-selected' : ''">自制</span>
                      </div>
                      <div class="type-radio-item" @click="form.type = 2; form.auth = 0;">
                          <div class="radio-box">
                              <div class="radio-box-selected" :style="form.type == 2 ? '' : 'display: none;'"></div>
                          </div>
                          <span class="radio-name" :class="form.type == 2 ? 'radio-selected' : ''">转载</span>
                      </div>
                  </div>
                </div>
                <div class="transfer" v-if="form.type == 2" >
                    <el-input
                      v-model="form.transferUrl"
                      maxlength="80"
                      placeholder="转载视频请注明来源、时间、地点(例：转自https://www.xxxx.com/yyyy)"
                      show-word-limit
                      type="text"
                  />
                </div>
              </div>
              <div class="form-item category">
                <div class="section-title">
                    <span class="section-title-deg">*</span>
                    <span class="section-title-main">分区</span>
                </div>
                <CategorySelect v-model:category="form.category"></CategorySelect>
              </div>
              <div class="form-item tag">
                <div class="div">
                  <div class="tag-container">
                    <div class="section-title">
                      <span class="section-title-deg">*</span>
                      <span class="section-title-main">标签</span>
                    </div>
                    <div class="input-wrp">
                      <TagInput v-model:tags="form.tags" @updateTags="val => {form.tags = val;}"></TagInput>
                    </div>
                  </div>
                  <div class="tag-wrp">
                    <div class="tag-label">推荐标签</div>
                    <div class="tag-list">
                      <div class="hot-tag-container">
                        <span>null</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-item description">
                <div class="section-title description">
                    <span class="section-title-deg">*</span>
                    <span class="section-title-main">简介</span>
                </div>
                <div class="desc-text-wrp">
                  <div class="description-container">
                      <el-input type="textarea" placeholder="简介" v-model="form.descr"  maxlength="2000" show-word-limit resize="none" :rows= "8" />
                  </div> 
                </div>
              </div>
              <div class="fotm-item">
                <div class="sumbit-container">
                  <span class="submit-add" @click="sumbit">立即投稿</span>
                </div>
              </div>
          </div>
        </div>
        <canvas ref="cutCanvas" style="display: none;"></canvas>
        <video :src="videoURL" ref="uploadVideoElement" style="display: none"></video>
      </div>
        <!-- <video controls>
          <source src="http://127.0.0.1:5050/upload/videos/61b9f77efe1e9b35a89f7365243277b8.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video> -->
        <!-- <img :src="coverImageURL" alt=""> -->

    </div>
</template>
      
<script>
import { ElMessage } from 'element-plus';
import request from '@/utils/request'
import SparkMD5 from 'spark-md5';
import CategorySelect from '@/components/CategorySelect.vue';
import TagInput from '@/components/TagInput.vue';


      export default {
        components: {
           CategorySelect,
           TagInput
        },
        data(){
          return{
            chunkSize : 1024*1025,   
            currentChunk: 0,
            totalChunks: 0,   
            selectedVideo : null,
            fileMd5:null,
            videoURL:null,
            videotrueUrl:null,
            picURL:'',//原图url
            coverURL: '', 
            progress: 0,
            duration : 0,
            videoName:null,//视频名字
            coverImageURL : null,//封面链接
            form: {
                title: "",  // 投稿标题
                type: 1,    // 投稿类型 1自制 2转载
                transferUrl: '',
                auth: 0,    // 0不设置权限 1未经作者授权禁止转载
                category: [{id: "anime", name: "番剧"}, {id: "finish", name: "完结动画"}],  // 投稿分区
                tags: [],   // 投稿标签
                descr: "",  // 投稿简介
            },
          }
        },
        methods:{
          // 分片获取文件哈希值
          init() {
            this.selectedVideo = null;
            this.fileMd5=null,
            this.videoURL = null;
            this.videotrueUrl=null;
            this.videoName = "";
            this.progress = 0;
            this.coverImageURL = null;
            this.coverURL = null;
            this.duration = 0;
            this.form = {
                title: "", 
                type: 1, 
                transferUrl: '',
                auth: 0,  
                category: [{id: "anime", name: "番剧"}, {id: "finish", name: "完结动画"}],  
                tags: [], 
                descr: "", 
            }
         },
          async getFileMd5(file, totalChunks, chunkSize) {
            return new Promise((resolve, reject) => {
              const spark = new SparkMD5.ArrayBuffer();
              const fileReader = new FileReader();
              let currentChunk = 0;

              fileReader.onload = (e) => {
                spark.append(e.target.result);
                currentChunk++;
                if (currentChunk < totalChunks) {
                  loadNextChunk();
                } else {
                  resolve(spark.end());
                }
              };

              fileReader.onerror = (e) => {
                reject(e);
              };

              const loadNextChunk = () => {
                const start = currentChunk * chunkSize;
                let end = start + chunkSize;
                if (end > file.size) {
                  end = file.size;
                }
                fileReader.readAsArrayBuffer(file.slice(start, end));
              };

              loadNextChunk();
            });
          },

          selectVideo() {
            this.videoURL = null; // 清除先前的视频URL，防止新视频还没加载出来就画黑屏
            this.$refs.videoInput.click();
          },

          async handleVideoChange(event) {
            // if (!this.$store.state.isLogin) {
            //     ElMessage.error('请登录后查看');
            //     this.$store.dispatch("logout");
            //     this.$router.push("/");
            //     return;
            // }
            // const maxSizeInBytes = 300 * 1024 * 1024; // 300MB
            this.file = event.target.files[0];

            if (!this.file) {
                return;
            }
            if (this.file.type != "video/mp4") {
                console.log("视频只接收mp4格式哦");
                return;
            }
            this.selectedVideo = this.file;
            this.videoName = this.file.name.split(".mp4")[0];
            this.form.title = this.videoName.slice();
            this.$emit("changeNavBarShow", false);
            this.initCover(this.file)
            if (this.file) {
              this.totalChunks = Math.ceil(this.file.size / this.chunkSize);
              this.fileMd5 = await this.getFileMd5(this.file,this.totalChunks,this.chunkSize)
              // console.log(this.fileMd5)
              this.uploadChunk();
            }
          },
          async uploadChunk() {
            if (this.currentChunk < this.totalChunks) {
              let start = this.currentChunk * this.chunkSize;
              let end = Math.min(start + this.chunkSize, this.file.size);
              let blob = this.file.slice(start, end);
              try {
                this.currentChunk = await this.getUploadStatus(this.fileMd5);
              } catch (error) {
                console.error('获取上传状态时发生错误:', error);
                return; // 停止上传过程
              }

              let formData = new FormData();
              formData.append('video', blob, this.file.name);
              formData.append('totalChunks', this.totalChunks);
              formData.append('fileMd5',this.fileMd5)
              formData.append('chunk', this.currentChunk);
              try {
                const res = await request.post('/video/upload', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                  },
                });
                this.currentChunk++;
                this.progress = Math.round(((this.currentChunk) / this.totalChunks) * 100);
                this.uploadChunk(); // 上传下一个块
                if(res.status == 250){
                  // console.log('视频上传成功,视频url:',res.videoUrl)
                  this.videotrueUrl=res.videoUrl
                }
              } catch (error) {
                console.error('上传错误:', error);
              }
            } else {
              this.progress = 100;
              console.log('上传完成');
            }
          },
          async handleDrop(event) {
            event.preventDefault();
            // if (!this.$store.state.isLogin) {
            //     ElMessage.error('请登录后查看');
            //     this.$store.dispatch("logout");
            //     this.$router.push("/");
            //     return;
            // }
            const file = event.dataTransfer.files[0];
            // const maxSizeInBytes = 300 * 1024 * 1024; // 300MB
            if (!file) {
                return;
            }
            if (file.type != "video/mp4") {
                console.log("视频只接收mp4格式哦");
                return;
            }
            console.log(file)
            // if (file.size <= maxSizeInBytes) {
            //     // 文件大小符合要求，可以继续处理上传逻辑
            //     this.isPause = false;   // 先暂停当前
            //     // 初始化内容
            //     this.selectedVideo = file;
            //     this.currentPer = 0.00001;
            //     this.sliderImages = [];
            //     this.picURL = null;
            //     this.videoName = file.name.split(".mp4")[0];
            //     this.form.title = this.videoName.slice();
            //     this.$emit("changeNavBarShow", false);
            //     this.initCover(file);
            //     // console.log(this.selectedVideo);
            //     this.hash = await this.fhash(this.selectedVideo);
            //     // console.log("hash值: ", this.hash);
            //     this.upload();  //开始上传
            // } else {
            //     // 文件大小超出限制
            //     ElMessage.error("视频太大了，特丽丽装不下呜~");
            // }
          },
          async getUploadStatus(fileMd5){
            const current = await request.post('/video/check', {
              fileMd5: fileMd5
            },
            { headers: {
              'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            }}
          )
            return current.data.currentIndex
          },
          // 获取视频封面
          initCover(file) {
              // 获取视频元素
              const video = this.$refs.uploadVideoElement;
              // 为视频元素设置选中的视频文件
              this.videoURL = URL.createObjectURL(file);
              video.crossOrigin = 'anonymous' // 解决跨域问题，也就是提示污染资源无法转换视频
              video.currentTime = 1 // 第一秒
              // 在视频可以播放时获取这一秒图像
              video.oncanplay = async () => {
                  // 获取视频总时长
                  this.duration = video.duration;
                  // 获取画布元素
                  const canvas = this.$refs.cutCanvas;
                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;
                  // 将视频的这一帧绘制到画布上
                  const context = canvas.getContext("2d");
                  context.drawImage(video, 0, 0, canvas.width, canvas.height);
                  // 将画布内容转换为图像数据URL
                  this.coverImageURL = canvas.toDataURL("image/jpeg");
                  this.cutCover(this.coverImageURL);  // 从原图裁剪中间部分作为封面展示
                  // await this.initSliderImages();
              };
          },
          // 视频上传封面
          triggerFileInput() {
            this.$refs.fileInput.click();
          },
          
          // async uploadAvatar(event) {
          //   const file = event.target.files[0];
          //   const hash = await this.getFileMd5(file,this.totalChunks,this.chunkSize)
          //   const token = localStorage.getItem('userToken');
          //   if (!file) {
          //     ElMessage.error('请选择一个文件');
          //       return;
          //   }

          //   const formData = new FormData();
          //   formData.append('cover', file); // 字段名称应与 Multer 配置一致
          //   formData.append('hash', hash)
          //   try {
          //       const res = await request.post('http://127.0.0.1:5050/video/uploadcover', formData, {
          //       headers: {
          //           'Content-Type': 'multipart/form-data',
          //           'Authorization': `Bearer ${token}` // 添加认证头部
          //       }
          //       });
          //       ElMessage.success('视频封面上传成功');
          //       this.coverURL = res.fileUrl
          //   } catch (error) {
          //     console.error('上传头像失败', error);
          //     ElMessage.error('视频封面上传失败');
          //   }
          // },

          async handlePicChange(event) {
              const file = event.target.files[0];
              const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
              if (!file) {
                  return;
              }
              // const coverHash = await this.getFileMd5(file,this.totalChunks,this.chunkSize)
              if (file.size <= maxSizeInBytes) {
                  // 文件大小符合要求，可以继续处理上传逻辑
                  const reader = new FileReader();
                  reader.onload = (e) => {
                      this.picURL = e.target.result;
                      //先处理链接，以后更新裁剪再去掉
                      this.coverURL = this.picURL;
                  }
                  reader.readAsDataURL(file);
              } else {
                  // 文件大小超出限制
                  ElMessage.error("只能上传5M的图片哦")
              }
          },

          cutCover(imgURL) {
            // 创建一个 Image 元素来加载原始图像
            const img = new Image();
            img.src = imgURL;
            // 获取用于裁剪的 canvas 元素
            const canvas = this.$refs.cutCanvas;
            const ctx = canvas.getContext('2d');
            // 定义所需的宽高比例
            const targetAspectRatio = 16 / 9;
            // 当图像加载完成后执行裁剪操作
            img.onload = () => {
                // 计算原始图像和目标图像的宽高
                const srcWidth = img.width;
                const srcHeight = img.height;
                const srcAspectRatio = srcWidth / srcHeight;
                let targetWidth = srcWidth;
                let targetHeight = srcHeight;
                // 如果原始图像的宽高比例较大（宽长高短），根据目标宽高比例来计算宽度
                if (srcAspectRatio > targetAspectRatio) {
                    targetWidth = srcHeight * targetAspectRatio;
                }
                // 否则（宽短高长），根据目标宽高比例来计算高度
                else {
                    targetHeight = srcWidth / targetAspectRatio;
                }
                // 计算裁剪后的图像在画布上的位置
                const offsetX = (srcWidth - targetWidth) / 2;
                const offsetY = (srcHeight - targetHeight) / 2;
                // 设置 Canvas 的宽高为目标宽高
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                // 在 Canvas 上绘制裁剪后的图像
                ctx.drawImage(img, offsetX, offsetY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
                // 将 Canvas 转换为DataURL并返回
                this.coverURL = canvas.toDataURL('image/jpeg');
            };
          },

          blobURLToBinary(blobURL){
            return fetch(blobURL).then(response => response.arrayBuffer()).then(buffer => new Uint8Array(buffer));
          },
          async sumbit(){
            if (this.progress < 100) {
                ElMessage.error('先等视频上传完啦');
                return;
            }
            if (this.form.title.trim().length === 0) {
                ElMessage.error('写个标题再上传吧');
                return;
            }
            if (this.form.tags.length === 0) {
                ElMessage.error('至少选一个标签哦');
                return;
            }
            let cover = null;

            const blob = await fetch(this.coverURL)
            .then(response => response.blob())
            .then(blob => {return(blob)})

            cover = new File([blob], this.fileMd5 + '.jpg', { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('cover', cover);
            formData.append('hash', this.fileMd5);
            formData.append('title', this.form.title);
            formData.append('type', this.form.type);
            formData.append('auth', this.form.auth);
            formData.append('duration', this.duration);
            formData.append('mcid', this.form.category[0].id);
            formData.append('scid', this.form.category[1].id);
            let tags = "";
            this.form.tags.forEach(tag => {
                tags = tags + tag + '\n';
            });
            formData.append('tags', tags);
            formData.append('descr', this.form.descr);
            formData.append('videoUrl',this.videotrueUrl)
            try {
              const res = await request.post('/video/add',formData,{
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                },
              })
              if(res.status==200){
                ElMessage.success('视频投稿成功')
                this.init()
                this.$emit("changeNavBarShow", true);
              }else{
                ElMessage.error('发生未知错误')
              }
            } catch (error) {
              ElMessage.error('上传时发生错误')
            }
          }
        },
      }
 </script>
      
      
  <style scoped>
    .el-input {
        --el-input-hover-border-color: #00a1d6;
        --el-input-focus-border-color: #00a1d6;
    }
  
    .platform-upload{
      background-color: rgb(40, 93, 139);
    }

    .video-input {
        margin-top: 62px;
        margin-bottom: 32px;
        display: flex;
        justify-content: center;
        position: relative;
        color: #999;
        font-size: 14px;
        text-align: center;
    }

    .video-input-wrapper{
      height: 230px;
      cursor: pointer;
    }

    .videoUpload {
        padding-top: 8px;
        overflow: auto;
    }

    .video-input-wrapper{
      flex: 1;
      cursor: pointer;
      padding-bottom: 20px;
      display: inline-block;
    }

    .upload-body-content {
        max-width: 830px;
        margin: 0 auto;
        position: relative;
        width: 80%;
    }

    .upload-wrp {
        margin-top: 20px;
        position: relative;
        border: 2px dashed #ccc;
    }


    .icon-shangchuan{
      font-weight: 300;
      font-size: 50px;
      color: #ccc;
    }

    .upload-tips-text{
      font-size: 13px;
      color: #999;
      margin-top: 6px;
    }

    .upload-btn{
      color: #fff;
      margin: 20px auto;
      width: 200px;
      height: 44px;
      cursor: pointer;
      background: #00a1d6;
      border-radius: 4px;
      transition: background-color .3s ease;
      text-align: center;
      line-height: 40px;
      white-space: nowrap;
    }

    video{
      background-color: #999;
      height: 200px;
      width: 300px;
    }

    /* 视频发布 */
    /* .info-content {
        padding: 2px 30px;
    } */

    .info-header {
        position: relative;
        font-size: 16px;
        font-weight: 600;
        color: #212121;
        line-height: 28px;
        height: 70px;
        box-shadow: 0 1px 0 #e7e7e7;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .info-header span{
      margin-left: 20px;
    }

    .file-upload-container{
      display: flex;
      margin: 23px 32px 0;
      padding: 20px 12px;
      border-radius: 10px;
      background-color: #f6f7f8;
      
    }

    .file-info{
      width: 70%;
      margin-left: 20px;
    }

    .icon-ziyuan{
      color: #00a1d6;
      font-size: 40px;
      line-height: 76px;
      text-align: center;
    }

    .video-name {
      padding-top: 10px;
      font-size: 14px;
      color: #212121;
    }

    .upload-form{
      margin: 30px 30px 0 0;
      background: #fff;
      width: 80%;
      min-width: 900px;
    }

    .form-title{
      width: 120px;
      font-size: 16px;
      font-weight: 600;
      color: #222;
      line-height: 22px;
      margin: 0 0 0 32px;
    }

    .form-item{
      margin: 24px 0 0 20px;
      color: #00a1d6;
      display: flex;
    }

    .section-title{
      display: inline-flex;
      align-items: center;
      position: relative;
      flex-wrap: wrap;
      width: 134px;
    }

    .section-title-deg{
      color: red;
    }

    .section-title-main{
      font-size: 14px;
      color: #212121;
      line-height: 21px;
      font-weight:bolder;
    }

    /* 进度条 */
    .file-progress {
        padding-top: 12px;
    }

    .file-progress-outer {
        height: 3px;
        width: 100%;
        border-radius: 4px;
        background-color: #e7e7e7;
    }

    .file-progress-inner {
        height: 3px;
        border-radius: 4px;
        transition: width 0.7s ease;
    }

    .doing-bg {
        background-color: #00a1d6;
    }

    .success-bg {
        background-color: chartreuse;
    }

    .input-wrp,.desc-text-wrp{
      flex: 1;
    }
    /* 视频封面 */
    .cover-container {
        width: 192px;
        height: 108px;
        border-radius: 4px;
        overflow: hidden; /* 隐藏超出容器的部分 */
        border: 1px dashed #b9b9b9; /* 黑色虚线边框，宽度为2像素 */
    }

    .cover-container img {
        height: 100%;
        width: 100%;
        object-fit: cover; /* 居中填充容器，不会变形 */
    }

    .cover-btn{
      display: flex;
      align-items: center;
      margin-left: 30px;
    }

    /* 是否转载 */
    .form-item.type{
      display: block;
    }

    .type-container{
      display: flex;
    }
    .type-radio {    
        display: flex;
        align-items: center;
    }

    .type-radio-item {
        cursor: pointer;
        margin-right: 20px;
        display: flex;
        align-items: center;
        position: relative;
    }

    .radio-box {
        border: 1px solid #bec3cc;
        height: 18px;
        width: 18px;
        border-radius: 50%;
        margin-right: 6px;
        padding: 3px;
    }

    .radio-box-selected {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #00a1d6;;
    }

    .radio-name {
        font-size: 14px;
        color: #61666d;;
        line-height: 14px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .radio-selected {
        color: #00a1d6;
    }

    .type .transfer{
      margin: 12px 0 0 134px;
    }
    /* 标签 */
    .tag>div{
      width: 100%;
    }

    .tag-container{
      display: flex;
    }

    .tag-wrp{
      display: flex
    }

    .tag-label{
      font-size: 14px;
      color: #222;
      padding: 14px 0 0 134px;
      font-weight: 700;
    }

    .tag-list{
      display: flex;
      flex-wrap: wrap;
      flex: 1;
    }

    .hot-tag-container{
      text-align: center;
      padding: 0 15px 0 16px;
      margin: 6px 0 6px 12px;
      height: 30px;
      color: #6d757a;
      cursor: pointer;
      border-radius: 4px;
      background: #f6f6f6;
      font-size: 12px;
      color: #212121;
      line-height: 14px;
      border: none;
    }

    .hot-tag-container span{
      font-size: 12px;
      line-height: 28px;
    }

    /* 简介 */
    .section-title.description{
      align-items:normal;
      padding-top: 35px;
    }

    .description-container{
      width: 100%;
      margin-top: 25px;
    }
  
    /* 投稿 */
    .sumbit-container{
      padding-left: 100px;
      padding-top: 50px;
    }
    .submit-add{
      margin-left: 16px;
      line-height: 40px;
      color: #fff;
      background: #00a1d6;
      display: inline-block;
      height: 40px;
      font-size: 14px;
      border-radius: 4px;
      text-align: center;
      vertical-align: middle;
      width: 120px;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      transition: all .5s ease-in-out;
    }
  </style>