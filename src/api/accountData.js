import { getData,postData,putData,delData } from "../util/request"

//账号列表分页
function getAccountList(params){
    return getData('/community/account', params)
};

//查看/编辑账号信息
function getAccountFromId(params){
    return getData('/community/account/view', params)
};

//删除账号
function deletAccountFromId(id){
    return postData('/community/account/delete/'+id)
};

//创建账号
function creatAccount(params){
    return postData('/community/account/create', params)
};

//重置账号密码
function resetAccount(id){
    return postData('/community/password/reset/'+id)
};

//更新账号
function updataAccount(params){
    return postData('/community/account/update', params)
};

export default {
    getAccountList,getAccountFromId,deletAccountFromId,creatAccount,resetAccount,updataAccount
}
