import { request1 } from './request'

// 获取商品分类列表
// 此处需要传递的参数为params参数，不是请求体参数
export function getCates(data){
    return request1({
        url:'categories',
        method: 'get',
        params: data
    })
}

// 添加分类接口
export function addCate(data){
    return request1({
        url:'/categories',
        method: 'post',
        data: data
    })
}

// 通过id查找分类接口
export function getCateById(id){
    return request1({
        url: `categories/${id}`,
        method: 'get'
    })
}


// 编辑提交分类接口
export function editCate(id, data){
    return request1({
        url:`categories/${id}`,
        method: 'put',
        data: data
    })
}

// 删除商配分类接口
export function removeCate(id){
    return request1({
        url:`categories/${id}`,
        method: 'delete',
    })
}