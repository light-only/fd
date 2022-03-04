import Vue from 'vue';
import App from './App';
import router from './router';
import "babel-polyfill";
import 'nprogress/nprogress.css'
import './permission.js'
import store from './store/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueAMap from 'vue-amap';
require('./mock');

Vue.use(ElementUI, { size: 'small' })
Vue.use(VueAMap);
//高德地图
VueAMap.initAMapApiLoader({
    key: '7c3072a83461a59b414611b9d3ef478c',
    plugin: []
});

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
