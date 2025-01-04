import request from '@/utils/request'

// 查询课程视频列表
export function listCourseVideo(query) {
  return request({
    url: '/oj/CourseVideo/list',
    method: 'get',
    params: query
  })
}

// 查询课程视频详细
export function getCourseVideo(id) {
  return request({
    url: '/oj/CourseVideo/' + id,
    method: 'get'
  })
}

// 新增课程视频
export function addCourseVideo(data) {
  return request({
    url: '/oj/CourseVideo',
    method: 'post',
    data: data
  })
}

// 修改课程视频
export function updateCourseVideo(data) {
  return request({
    url: '/oj/CourseVideo',
    method: 'put',
    data: data
  })
}

// 删除课程视频
export function delCourseVideo(id) {
  return request({
    url: '/oj/CourseVideo/' + id,
    method: 'delete'
  })
}
