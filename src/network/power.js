import {
    request1
} from './request'

// 获取权限列表
export function getRights(type) {
    return request1({
        url: `/rights/${type}`,
        method: 'get'
    })
}

// 获取角色列表
export function getRoles() {
    return request1({
        url: '/roles',
        method: 'get'
    })
}

// 添加角色
export function addRole(data) {
    return request1({
        url: '/roles',
        method: 'post',
        data: data
    })
}

// 根据id查询角色
export function getRoleById(id) {
    return request1({
        url: `/roles/${id}`,
        method: 'get'
    })
}

// 编辑修改角色信息
export function editRole(id, data) {
    return request1({
        url: `/roles/${id}`,
        method: 'put',
        data: data
    })
}

// 删除角色信息
export function delRole(id) {
    return request1({
        url: `/roles/${id}`,
        method: 'delete'
    })
}

// 删除角色指定权限
// roles/:roleId/rights/:rightId
export function delRightById(roleId, rightId) {
    return request1({
        url: `/roles/${roleId}/rights/${rightId}`,
        method: 'delete'
    })
}

// 为角色授权
export function setRights(roleId, data) {
    return request1({
        url: `/roles/${roleId}/rights`,
        method: 'post',
        data: data
    })
}