import request from '@/utils/request'

export function getAll() {
  return request({
    url: '/admin/role/listAll',
    method: 'get'
  })
}

export function getList(params) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params
  })
}

export function saveRole(role) {
  return request({
    url: '/admin/role/save',
    method: 'post',
    data: role
  })
}

export function deleteRole(roleId) {
  return request({
    url: '/admin/role/delete',
    method: 'post',
    data: {
      roleId
    }
  })
}
