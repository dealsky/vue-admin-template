import axios from 'axios'
import request from '@/utils/request'

const domain = 'http://dealsky.natappvip.cc'

export function getUpladToken() {
  return request({
    url: '/common/oss/token',
    method: 'get'
  })
}

export function getCallbackUploadToken(options) {
  const data = {
    callbackUrl: domain,
    callbackBodyType: 'application/json',
    callbackBody: ''
  }
  data.callbackUrl = data.callbackUrl + options.action
  let callbackBody = {
    key: '$(key)',
    hash: '$(etag)',
    w: '$(imageInfo.width)',
    h: '$(imageInfo.height)'
  }
  callbackBody = Object.assign({}, callbackBody, options.extra)
  data.callbackBody = JSON.stringify(callbackBody)

  return request({
    url: '/common/upload/callbackToken',
    method: 'post',
    data: data
  })
}

export function upload(host, file, params) {
  const formData = new FormData()
  const suffix = file.name.substring(file.name.lastIndexOf('.'))

  formData.append('key', params.key + suffix)
  formData.append('policy', params.policy)
  formData.append('OSSAccessKeyId', params.OSSAccessKeyId)
  // 让服务端返回200,不然，默认会返回204
  formData.append('success_action_status', '200')
  formData.append('callback', params.callback)
  formData.append('signature', params.signature)

  formData.append('file', file)

  return axios.post(host, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
