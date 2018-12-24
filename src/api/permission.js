import request from '@/utils/request'

export function getAllPermissions() {
  return request({
    url: '/admin/permission/listAll',
    method: 'get'
  })
}
