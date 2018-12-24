import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/admin/admin/list',
    method: 'get',
    params
  })
}

export function saveAdmin(admin) {
  return request({
    url: '/admin/admin/save',
    method: 'post',
    data: admin
  })
}

export function deleteAdmin(adminId) {
  return request({
    url: '/admin/admin/delete',
    method: 'post',
    data: {
      adminId
    }
  })
}
