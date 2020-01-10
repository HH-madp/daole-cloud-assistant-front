import axios from 'axios'
import {
  Message
} from 'element-ui'
import qs from 'qs'
import router from '../router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;',
    'X-Requested-With': 'XMLHttpRequest'
  },
  transformRequest: [function(data, headers, type) {
    const content_type = headers['Content-Type']
    if (data) {
      // 删除创建和更新时间的字段信息  删除某个对象的属性名称
      delete data.createDatetime
      delete data.createDatetime_str
      delete data.lastUpdateDatetime
      delete data.lastUpdateDatetime_str
      delete data.lastUpdateUserId
      delete data.createUserId
    }
    if (content_type === 'application/json;') {
      return JSON.stringify(data)
    } else {
      return qs.stringify(data, {
        allowDots: true
      })
    }
  }]

})

// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    console.debug(String(typeof response.data.success) + '响应数据->' + JSON.stringify(response))

    if (response.status !== 200) {
      requestError(response)

      return Promise.reject('error')
    } else if (String(typeof response.data.success) === 'boolean' && !response.data.success) {
      // 业务错误处理
      requestError(response)

      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.debug('请求错误处理：' + JSON.stringify(error)) // for debug
    requestError(error.response)
    return Promise.reject(error)
  }
)
service.postJson = function(url, data) {
  return service.post(url, data, {
    headers: {
      'Content-Type': 'application/json;'
    }
  })
}

/**
 * 错误响应处理
 * @param message
 */
function requestError(response) {
  // console.log(response)
  // eslint-disable-next-line eqeqeq
  if (response.status == 200 && !response.data.message) {
    console.log('业务处理错误，但没有返回错误提示信息')
    return
  }

  var message = response.data.message || '请求错误，请求状态码:' + response.status

  // 这对特定的状态进行提醒处理
  switch (response.status) {
    case 401: {
      message = '请重新登录'
      router.push({
        path: '/401'
      })
      break
    }
    case 403: {
      message = '没有权限访问'
      router.push({
        path: '/403'
      })
      break
    }
    case 404: {
      message = '访问地址不存在'
      router.push({
        path: '/404'
      })
      break
    }
  }

  requestErrorTip(message)
}

/**
 * 错误提醒
 * @param message
 */
function requestErrorTip(message) {
  Message({
    message: message,
    type: 'error',
    duration: 5 * 1000
  })
}

export default service
