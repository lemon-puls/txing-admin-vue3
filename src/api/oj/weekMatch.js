import request from '@/utils/request'

// 查询周赛列表
export function listWeekMatch(query) {
  return request({
    url: '/oj/weekMatch/list',
    method: 'get',
    params: query
  })
}

// 查询周赛详细
export function getWeekMatch(id) {
  return request({
    url: '/oj/weekMatch/' + id,
    method: 'get'
  })
}

// 新增周赛
export function addWeekMatch(data) {
  return request({
    url: '/oj/weekMatch',
    method: 'post',
    data: data
  })
}

// 修改周赛
export function updateWeekMatch(data) {
  return request({
    url: '/oj/weekMatch',
    method: 'put',
    data: data
  })
}

// 删除周赛
export function delWeekMatch(id) {
  return request({
    url: '/oj/weekMatch/' + id,
    method: 'delete'
  })
}
