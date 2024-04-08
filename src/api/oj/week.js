import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listWeek(query) {
  return request({
    url: '/oj/week/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getWeek(id) {
  return request({
    url: '/oj/week/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addWeek(data) {
  return request({
    url: '/oj/week',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateWeek(data) {
  return request({
    url: '/oj/week',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delWeek(id) {
  return request({
    url: '/oj/week/' + id,
    method: 'delete'
  })
}
