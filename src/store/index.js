import Vue from 'vue'
import Vuex from 'vuex'
import layout from './modules/layout'
//使用vuex
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        layout
    }
})
