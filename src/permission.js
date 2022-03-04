import router from './router'
import NProgress from 'nprogress'
import store from './store/index'

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    NProgress.start();
    const userName = sessionStorage.getItem('ms_username');
    const role = sessionStorage.getItem('role');
    //是否需要动态加载路由
    if (store.state.layout.addRouters.length == 0) {
        if (role != null) {
            store.dispatch('layout/GenerateRoutes', role).then(() => {
                router.addRoutes(store.state.layout.routers)
                next({ ...to, replace: true })
            })
        }
    }
    if (to.path == '/login') {
        sessionStorage.clear()
        next()
    } else {
        if (!userName) {
            sessionStorage.clear()
            next('/login');
            NProgress.done();
        } else {
           next()
        }
    }
});

router.afterEach(transition => {
    NProgress.done();
});
