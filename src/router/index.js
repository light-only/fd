import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

//所有权限通用路由表
//如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: resolve => require(['../components/page/login.vue'], resolve)
    }
]

//实例化vue的时候只挂载constantRouter
export default new Router({
    mode: 'history',
    // base:'/admin/',
    routes: constantRouterMap
});

//异步挂载的路由
//根据权限加载的路由表
export const asyncRouterMapAdmin = [
    {
        path: '/',
        component: resolve => require(['../components/layout/index.vue'], resolve),
        meta: {title: '通用表单'},
        children: [
            {
                path: '/fzzlgl',
                component: resolve => require(['../components/page/fzzlgl.vue'], resolve),
                meta: {title: '通用表单'},
            }
        ]
    },
    {
        path: '/',
        component: resolve => require(['../components/layout/index.vue'], resolve),
        meta: {title: '系统设置'},
        children: [
            {
                path: '/account',
                component: resolve => require(['../components/page/account.vue'], resolve),
                meta: {title: '账号管理'}
            },
            {
                path: '/role',
                component: resolve => require(['../components/page/role.vue'], resolve),
                meta: {title: '角色管理'}
            },
        ]
    },
    {
        path: '*',
        component: resolve => require(['../components/common/404.vue'], resolve),
    }
]
