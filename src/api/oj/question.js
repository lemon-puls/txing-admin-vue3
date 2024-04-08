import request from '@/utils/request'

// 查询题目中心列表
export function listQuestion(query) {
  return request({
    url: '/oj/question/list',
    method: 'get',
    params: query
  })
}

// 查询题目中心详细
export function getQuestion(id) {
  return request({
    url: '/oj/question/' + id,
    method: 'get'
  })
}

// 新增题目中心
export function addQuestion(data) {
  return request({
    url: '/oj/question',
    method: 'post',
    data: data
  })
}

// 修改题目中心
export function updateQuestion(data) {
  return request({
    url: '/oj/question',
    method: 'put',
    data: data
  })
}

// 删除题目中心
export function delQuestion(id) {
  return request({
    url: '/oj/question/' + id,
    method: 'delete'
  })
}
