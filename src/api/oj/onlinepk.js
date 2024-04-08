import request from '@/utils/request'

// 查询在线PK列表
export function listOnlinepk(query) {
  return request({
    url: '/oj/onlinepk/list',
    method: 'get',
    params: query
  })
}

// 查询在线PK详细
export function getOnlinepk(id) {
  return request({
    url: '/oj/onlinepk/' + id,
    method: 'get'
  })
}

// 新增在线PK
export function addOnlinepk(data) {
  return request({
    url: '/oj/onlinepk',
    method: 'post',
    data: data
  })
}

// 修改在线PK
export function updateOnlinepk(data) {
  return request({
    url: '/oj/onlinepk',
    method: 'put',
    data: data
  })
}

// 删除在线PK
export function delOnlinepk(id) {
  return request({
    url: '/oj/onlinepk/' + id,
    method: 'delete'
  })
}
