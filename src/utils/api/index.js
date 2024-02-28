import request from './request'
const user = {
  // 查询私钥
  GetUserKey :params => request({url:'/user/key',method: 'get', params}),
  // 设置私钥
  PostUserKey :data => request({url:'/user/key',method: 'post', data}),
  // 申请访问
  PostUserApply :data => request({url:'/user/apply',method: 'post', data}),
  // 申请列表(病人)
  GetUserApply :params => request({url:'/user/apply',method: 'get', params}),
  // 申请列表(HCP)
  GetUserApplyPost :params => request({url:'/user/apply/post',method: 'get', params}),
  // 是否通过申请
  PutUserApply :data => request({url:'/user/apply',method: 'put', data}),
  // 查询同意列表
  GetUserKeyList :params => request({url:'/user/key/list',method: 'get', params}),
  // 去除权限
  DeleteUserKey :data => request({url:'/user/key',method: 'delete', data}),
  // 删除申请
  DeleteUserApply :data => request({url:'/user/apply',method: 'delete', data}),
  // 申请小红点
  GetUserApplyMsg :params => request({url:'/user/apply/msg',method: 'get', params}),
}
export default {
  user,
}