import axios from 'axios';
import {Message} from 'element-ui';
import {Loading} from 'element-ui';

export const commonParams = {}

var loadingMask;
const instance = axios.create({
    baseURL:process.env.BASE_URL,
    timeout: 60000
});

//http request 拦截器
instance.interceptors.request.use(
    config => {
        var token = sessionStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = "Bearer "+token
        }
        loadingMask = Loading.service({
            fullscreen: true,
            lock: true,
            text: '加载中，请稍候...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        return config;
    },
    err => {
        loadingMask.close()
        return Promise.reject(err);
    }
);

//http response 拦截器
instance.interceptors.response.use(
    response => {
        loadingMask.close()
        return response.data
    },
    err => {
        loadingMask.close()
        if (err.response.status == 504 || err.response.status == 404) {
            Message.error('系统正在维护,请稍后重试');
        } else if (err.response.status == 403) {
            Message.error('权限不足,请联系管理员!');
        } else {
            Message.error('未知错误!');
        }
        return Promise.reject(err)
    }
)


/**
 * get请求
 * @param urlLink
 * @param param
 * @returns {Promise<AxiosResponse>}
 */
export function getData(urlLink, param) {
    const data = Object.assign({}, commonParams, param)
    return instance.get(urlLink, {
        params: data
    }).then((res) => {
        return Promise.resolve(res)
    }).catch(function (error) {
        return Promise.resolve(error.data)
    });
}

/**
 * post请求
 * @param urlLink
 * @param param
 * @returns {Promise<AxiosResponse>}
 */
export function postData(urlLink, param) {
    const data = Object.assign({}, commonParams, param)
    return instance.post(urlLink, data)
        .then((res) => {
            return Promise.resolve(res)
        })
        .catch(function (error) {
            return Promise.resolve(error)
        });
}

/**
 * put请求
 * @param urlLink
 * @param param
 * @returns {Promise<AxiosResponse>}
 */
export function putData(urlLink, param) {
    const data = Object.assign({}, commonParams, param)
    return instance.put(urlLink, data)
        .then((res) => {
            return Promise.resolve(res)
        })
        .catch(function (error) {
            return Promise.resolve(error)
        });
}

/**
 * DELETE请求
 * @param urlLink
 * @param param
 * @returns {Promise<AxiosResponse>}
 */
export function delData(urlLink, param) {
    const data = Object.assign({}, commonParams, param)
    return instance.delete(urlLink, data)
        .then((res) => {
            return Promise.resolve(res)
        })
        .catch(function (error) {
            return Promise.resolve(error)
        });
}
