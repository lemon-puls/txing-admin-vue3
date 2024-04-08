import request from '@/utils/request'

// 查询帖子列表
export function listForum(query) {
    return request({
        url: '/oj/forum/list',
        method: 'get',
        params: query
    })
}

// 查询帖子详细
export function getForum(id) {
    return request({
        url: '/oj/forum/' + id,
        method: 'get'
    })
}

// 新增帖子
export function addForum(data) {
    return request({
        url: '/oj/forum',
        method: 'post',
        data: data
    })
}

// 修改帖子
export function updateForum(data) {
    return request({
        url: '/oj/forum',
        method: 'put',
        data: data
    })
}

// 删除帖子
export function delForum(id) {
    return request({
        url: '/oj/forum/' + id,
        method: 'delete'
    })
}

// 获取帖子详情 用于展示
export function getTopicDetailForShow(id) {
    return request({
        url: '/oj/forum/detail/get',
        method: 'get',
        params: {
            id: id
        }
    })
}