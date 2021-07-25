import { request1 } from './request'

// 获取商品分类列表(也可以不穿params参数，如果不穿params 参数，则一次将所有层级的商品分类全部获取)
// 此处需要传递的参数为params参数，不是请求体参数
export function getCates(data){
    return request1({
        url:'/categories',
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
        url: `/categories/${id}`,
        method: 'get'
    })
}


// 编辑提交分类接口
export function editCate(id, data){
    return request1({
        url:`/categories/${id}`,
        method: 'put',
        data: data
    })
}

// 删除商配分类接口
export function removeCate(id){
    return request1({
        url:`/categories/${id}`,
        method: 'delete',
    })
}

// 获取参数列表
export function getParams(id, params){
    return request1({
        url:`/categories/${id}/attributes`,
        method: 'get',
        params: params
    })
}

// 添加动态参数或静态属性接口
export function addParams(id, data){
    return request1({
        url:`/categories/${id}/attributes`,
        method: 'post',
        data:data
    })
}

// 根据id查询参数接口
export function getParamsById(cateId, attrId, data){
    return request1({
        url:`/categories/${cateId}/attributes/${attrId}`,
        method: 'get',
        data:data
    })
}

// 商品分类编辑提交参数接口
export function editParams(cateId, attrId, data){
    return request1({
        url:`/categories/${cateId}/attributes/${attrId}`,
        method: 'put',
        data:data
    })
}

// 商品分类删除接口
export function removeParams(cateId, attrId){
    return request1({
        url:`/categories/${cateId}/attributes/${attrId}`,
        method: 'delete',
    })
}

// 商品列表数据请求接口
export function getGoods(params){
    return request1({
        url:'/goods',
        method:'get',
        params:params
    })
}

// 删除商品数据接口
export function removeGoods(id){
    return request1({
        url: `/goods/${id}`,
        method: 'delete'
    })
}

// 根据ID查询商品数据接口
export function getGoodsById(id){
    return request1({
        url: `/goods/${id}`,
        method: 'get'
    })
}

// 编辑提交商品接口
export function editGoods(id, data){
    return request1({
        url:`goods/${id}`,
        method: 'put',
        data: data
    })
}

// 添加商品数据接口
export function addGoods(data){
    return request1({
        url: '/goods',
        method: 'post',
        data: data
    })
}