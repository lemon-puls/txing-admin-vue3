import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/oj/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(id) {
  return request({
    url: '/oj/user/' + id,
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/oj/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/oj/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(id) {
  return request({
    url: '/oj/user/' + id,
    method: 'delete'
  })
}

// 删除用户
export function getUserShowList() {
  return request({
    url: '/oj/user/show/list',
    method: 'get'
  })
}
