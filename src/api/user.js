import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params
  })
}

export function saveUser(user) {
  return request({
    url: '/admin/user/save',
    method: 'post',
    data: user
  })
}

export function deleteUser(userId) {
  return request({
    url: '/admin/user/delete',
    method: 'post',
    data: {
      userId
    }
  })
}
