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
    url:`/users/${uid}/state/${type}`,
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

// 根据id查找用户信息
export function getUserInfoById(id){
  return request1({
    url:`/users/${id}`,
    method:'get'
  })
}

// 修改用户信息
export function changeUser(id, data){
  return request1({
    url:`/users/${id}`,
    method:'put',
    data:data
  })
}

// 删除用户
export function removeUser(uid){
  return request1({
    url:`/users/${uid}`,
    method:'delete'
  })
}

// 分配用户角色id
// users/:id/role
export function setRoleForUser(id, data){
  return request1({
    url:`users/${id}/role`,
    method: 'put',
    data: data
  })
}