import {getData, postData, putData, delData} from "../util/request"

//权限树
function permTree(params) {
    return getData('/community/menu', params)
}

//新增
function addRole(params) {
    return postData('/community/role/create', params)
};

//修改
function updateRole(params) {
    return postData('/community/role/update', params)
};

//删除
function deletRoleFromId(id) {
    return postData('/community/role/delete/' + id)
};

//角色列表分页
function getRoleList(params) {
    return getData('/community/role', params)
};

//查询角色权限信息
function permById(params) {
    return getData('/community/role/view', params)
}

//角色列表全部
function getRoleAll() {
    return getData('/community/list/role')
}

export default {
    permTree, addRole, updateRole, deletRoleFromId, getRoleList, permById, getRoleAll
}
