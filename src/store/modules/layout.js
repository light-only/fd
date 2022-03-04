import {
    asyncRouterMapAdmin,
    constantRouterMap
} from '../../router/index.js';

export default{
    namespaced: true,
    state: {
        routers: constantRouterMap,//常规路由
        addRouters: [],//动态添加的路由
        collapse:false,//页面左侧是否折叠
        leftMenu:[],//左侧导航
        activeIndex:'',//顶部导航位置
        title:'',//顶部页面标题
        theme:''
    },
    getters: {
        getRouter: (state) => {
            return state.routers
        },
        getAddRouter: (state) => {
            return state.addRouters
        },
        getCollapse:(state)=>{
            return state.collapse
        },
        getLeftMenu:(state)=>{
            return state.leftMenu
        },
        getTitle:(state)=>{
            return state.title
        }
    },


    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        },
        SET_COLLAPSE: (state, c) => {
            state.collapse = c
        },
        SET_LEFTMENU: (state, menu) => {
            state.leftMenu = menu
        },
        SET_TITLE: (state, title) => {
            state.title = title
        },
        SET_THEME:(state,theme)=>{
            state.theme=theme
        }
    },
    actions: {
        GenerateRoutes({commit}, data) {
            return new Promise(resolve => {
                let roles = data
                let accessedRouters = asyncRouterMapAdmin
                commit('SET_ROUTERS', accessedRouters);
                resolve()
            })
        },
        ChangeCollapse({commit}, data){
            commit('SET_COLLAPSE', data);
        },
        ChangeLeftMenu({commit},data){
            commit('SET_LEFTMENU', data);
        },
        ChangeTitle({commit},data){
            commit('SET_TITLE', data);
        },
        ChangeTheme({commit},data){
            commit('SET_THEME', data);
        }
    }
}
