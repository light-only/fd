import { getData,postData,putData,delData } from "../util/request"

//获取字典数据
function getTypeList(params){
    return getData('/community/dict/type/list', params)
};


export default{
    getTypeList
}
