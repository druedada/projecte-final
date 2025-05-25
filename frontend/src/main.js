import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles.css';

const app = createApp(App);
app.mount('#app');

console.log('Task Manager Application initialized with Vue 3 + Vite');
