import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // 引入 Vuex store
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import "./assets/css/main.css"

const app = createApp(App);

app.use(store); // 注入 Vuex store
app.use(router); // 注入 Vue Router
app.use(ElementPlus,ElMessage)
app.mount('#app'); // 挂载应用
