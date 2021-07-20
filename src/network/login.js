import { request1 } from './request'
import qs from 'qs'

export function getLoginData(params){
  return request1({
    url:'/login',
    method:'post',
    data: params
  })
}