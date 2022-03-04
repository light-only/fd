import { getData,postData,putData,delData } from "../util/request"

//登录接口
function login(params){
    return postData('/community/login', params)
};

//退出登录
function loginOut(params){
    return postData('/community/logout', params)
}

//修改密码
function updatePwd(params){
    return postData('/community/change/password', params)
}

export default{
    login,loginOut,updatePwd
}
