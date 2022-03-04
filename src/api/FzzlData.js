import {getData, postData, putData, delData} from "../util/request"

//房租租赁列表
function getFzzlList(params) {
    return getData('/community/housing/list', params)
}

//房租租赁详情
function getFzzlDetail(params) {
    return getData('/community/housing/'+params)
}

//添加房租租赁
function addFzzl(params) {
    return postData('/community/housing/add', params)
}

//编辑房租租赁
function changeFzzl(params) {
    return postData('/community/housing/update',params)
}

//删除房租租赁
function deletFzzl(params) {
    return postData('/community/housing/delete/'+params)
}

export default {
    getFzzlList,getFzzlDetail,addFzzl,changeFzzl,deletFzzl
}
