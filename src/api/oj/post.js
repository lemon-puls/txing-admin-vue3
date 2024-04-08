import request from '@/utils/request'

// 查询文章列表
export function listPost(query) {
    return request({
        url: '/oj/post/list',
        method: 'get',
        params: query
    })
}

// 查询文章详细
export function getPost(id) {
    return request({
        url: '/oj/post/' + id,
        method: 'get'
    })
}

// 新增文章
export function addPost(data) {
    return request({
        url: '/oj/post',
        method: 'post',
        data: data
    })
}

// 修改文章
export function updatePost(data) {
    return request({
        url: '/oj/post',
        method: 'put',
        data: data
    })
}

// 删除文章
export function delPost(id) {
    return request({
        url: '/oj/post/' + id,
        method: 'delete'
    })
}

// 获取文章展示VO
export function getPostVo(id) {
    return request({
        url: '/oj/post/get/vo',
        method: 'get',
        params: {
            id: id
        }
    })
}


