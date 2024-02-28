import axios from "axios"

const url = 'https://test.ulam.top/'
// 文件路径 
const service = axios.create({
  baseURL: url,
  timeout: 500000
})

// service.defaults.headers.post['Content-Type'] = 'application/json'
service.defaults.headers.post['Content-Security-Policy'] = 'upgrade-insecure-requests'
service.interceptors.request.use(config => {
  // const token = getToken()
  // // token
  // token && (config.headers.token = token)
  
  return config
}, error =>{
  Promise.reject(error)
})

service.interceptors.response.use(response => {
  // 等会做其他判断
  // return Promise.resolve(response.data)
  return response.data

}, error => {
  // const msg = error.response.data.msg || error.response.data.validation_error.body_params[0].msg
  // console.log(msg)
  Promise.reject(error)
})
export const baseURL = url
export default service
