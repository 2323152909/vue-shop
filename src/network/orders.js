import { request1 } from './request'

// 获取订单数据列表接口
export function getOrders(params){
    return request1({
        url:'/orders',
        method:'get',
        params:params
    })
}

// 查询物流信息(不可用)
// export function getProgress(id){
//     return request1({
//         url:`/kuaidi/${id}`,
//         method: 'get'
//     })
// }