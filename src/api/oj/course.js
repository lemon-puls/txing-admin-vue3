import request from '@/utils/request'

// 查询课程列表
export function listCourse(query) {
  return request({
    url: '/oj/course/list',
    method: 'get',
    params: query
  })
}

// 查询课程详细
export function getCourse(id) {
  return request({
    url: '/oj/course/' + id,
    method: 'get'
  })
}

// 新增课程
export function addCourse(data) {
  return request({
    url: '/oj/course',
    method: 'post',
    data: data
  })
}

// 修改课程
export function updateCourse(data) {
  return request({
    url: '/oj/course',
    method: 'put',
    data: data
  })
}

// 删除课程
export function delCourse(id) {
  return request({
    url: '/oj/course/' + id,
    method: 'delete'
  })
}

//  获取课程播放所需信息
export function getVideoPlayVO(courseId) {
  return request({
    url: '/oj/course/video/play/info/get',
    method: 'get',
    params: {
        courseId: courseId
    }
  })
}

//  获取视频播放签名
export function getPlaySign(fileId) {
  return request({
    url: '/oj/course/play/sign/get',
    method: 'get',
    params: {
      fileId: fileId
    }
  })
}
