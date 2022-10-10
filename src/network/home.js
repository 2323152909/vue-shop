const { request1 } = require('./request')

export function MenuList() {
  return request1({
    url:'/menus',
    method: 'get'
  });
}