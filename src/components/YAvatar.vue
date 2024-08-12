<template>
    <div class="avatar" :style="`width: ${size}px; height: ${size}px;`">
        <img :src="imgurl" alt="" class="avatar-img">
    </div>
</template>

<script>
export default{
    props:{
        size:{
            type:Int16Array,
            default(){
                return 40
            }
        },
        imgurl:{
            type:String,
            default(){
                return require('@/assets/user.jpg')
            }
        }
    }
}
</script>

<style scoped>
path{
    width: 10px;
    height: 10px;
}

.avatar {
    display: block;
    position: relative;
    background-image: url('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png');
    -webkit-background-size: cover;
    background-size: cover;
    border-radius: 50%;
    margin: 0;
    padding: 0;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.avatar-img{
    border: none;
    display: block;
    -o-object-fit: cover;
    object-fit: cover;
    image-rendering: -webkit-optimize-contrast;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
</style>