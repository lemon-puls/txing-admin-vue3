import request from '@/utils/request'

// 查询群聊聊天房间列表
export function listRoom(query) {
  return request({
    url: '/oj/room/list',
    method: 'get',
    params: query
  })
}
// 查询私聊聊天房间列表
export function listRoomFriend(query) {
  return request({
    url: '/oj/room/friend/list',
    method: 'get',
    params: query
  })
}


// 查询聊天房间详细
export function getRoom(id) {
  return request({
    url: '/oj/room/' + id,
    method: 'get'
  })
}

// 新增聊天房间
export function addRoom(data) {
  return request({
    url: '/oj/room',
    method: 'post',
    data: data
  })
}

// 修改聊天房间
export function updateRoom(data) {
  return request({
    url: '/oj/room',
    method: 'put',
    data: data
  })
}

// 删除聊天房间
export function delRoom(id) {
  return request({
    url: '/oj/room/' + id,
    method: 'delete'
  })
}
