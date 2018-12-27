import * as qiniu from 'qiniu-js'
import request from '@/utils/request'

const compressType = ['image/png', 'image/jpeg', 'image/bmp', 'image/webp']
const domain = 'http://dealsky.natappvip.cc'

export const CDN_DOMAIN = 'http://pk8vfro30.bkt.clouddn.com/'
export const UPLOAD_ACTION = 'http://upload.qiniup.com'

export function getUpladToken() {
  return request({
    url: '/common/upload/token',
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

export function upload({ token, request, params, mimeType }, next, error, complete) {
  params = params || {}
  mimeType = mimeType || []

  const file = request.file

  // 关于 key 要怎么处理自行解决，但如果为 undefined 或者 null 会使用上传后的 hash 作为 key.
  const key = undefined

  const putExtra = {
    fname: file.name,
    params: params,
    mimeType: mimeType || null
  }

  const config = {
    useCdnDomain: true
  }

  const options = {
    quality: 0.92,
    noCompressIfLarger: true
  }

  if (compressType.indexOf(file.type) !== -1) {
    qiniu.compressImage(file, options).then(data => {
      // 调用sdk上传接口获得相应的observable，控制上传和暂停
      const observable = qiniu.upload(data.dist, key, token, putExtra, config)
      return observable.subscribe(next, error, complete)
    }).catch(res => {
      console.log(res)
      return res
    })
  } else {
    const observable = qiniu.upload(file, key, token, putExtra, config)
    return observable.subscribe(next, error, complete)
  }
}
