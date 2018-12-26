import * as qiniu from 'qiniu-js'
import request from '@/utils/request'

const compressType = ['image/png', 'image/jpeg', 'image/bmp', 'image/webp']

export function getUpladToken() {
  return request({
    url: '/common/upload/token',
    type: 'get'
  })
}

export function upload(token, obj, next, error, complete) {
  const {
    file
  } = obj

  // 关于 key 要怎么处理自行解决，但如果为 undefined 或者 null 会使用上传后的 hash 作为 key.
  const key = new Date().getTime()

  const putExtra = {
    fname: '',
    params: {},
    mimeType: [] || null
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
