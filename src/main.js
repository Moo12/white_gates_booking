import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//import VueGtag from 'vue-gtag';


// import 'bootstrap/dist/css/bootstrap.css';
// import { BootstrapVue3 } from 'bootstrap-vue-3';
// import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

// const app = createApp(App);
// app.use(BootstrapVue3);
// app.mount('#app');


// global styles

import './assets/main.css'

import { projectAuth } from './firebase/config'

// createApp(App).use(router).mount('#app')

let app

projectAuth.onAuthStateChanged(() => {
    if (!app){
        app = createApp(App).use(router).mount('#app')
    }
})


// let app

// projectAuth.onAuthStateChanged(() => {
//     if (!app){
//         app = createApp(App).use(router).mount('#app')
//     }
// })