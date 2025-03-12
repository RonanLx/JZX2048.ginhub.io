// 导入Vue的createApp函数，用于创建Vue应用实例
import { createApp } from 'vue'

// 导入用户定义的App组件，这是应用的入口组件
import App from './App.vue'

// 使用createApp函数创建Vue应用实例，并传入App组件作为入口
const app = createApp(App)

// 将创建的Vue应用实例挂载到HTML页面中id为'app'的元素上
app.mount('#app')
