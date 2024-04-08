import request from '@/utils/request'

// 查询周赛题目关联列表
export function listMatchWeekQuestionRelate(query) {
  return request({
    url: '/oj/MatchWeekQuestionRelate/list',
    method: 'get',
    params: query
  })
}

// 查询周赛题目关联详细
export function getMatchWeekQuestionRelate(id) {
  return request({
    url: '/oj/MatchWeekQuestionRelate/' + id,
    method: 'get'
  })
}

// 新增周赛题目关联
export function addMatchWeekQuestionRelate(data) {
  return request({
    url: '/oj/MatchWeekQuestionRelate',
    method: 'post',
    data: data
  })
}

// 修改周赛题目关联
export function updateMatchWeekQuestionRelate(data) {
  return request({
    url: '/oj/MatchWeekQuestionRelate',
    method: 'put',
    data: data
  })
}

// 删除周赛题目关联
export function delMatchWeekQuestionRelate(id) {
  return request({
    url: '/oj/MatchWeekQuestionRelate/' + id,
    method: 'delete'
  })
}
