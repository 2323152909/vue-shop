import { request1 } from './request'

// 获取用户信息列表
export function userlist(params){
  return request1({
    url:'/users',
    method:'get',
    params:params
  })
}

// 修改用户状态
export function userState(uid, type){
  return request1({
    url:`users/${uid}/state/${type}`,
    method:'put'
  })
}

// 添加用户
export function addUsers(data){
  return request1({
    url:'/users',
    method:'post',
    data:data
  })
}