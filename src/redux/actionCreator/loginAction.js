import store from '../store'
// 登录
async function LoginAction(e){
  // console.log(store.getState().UserReducer.user)
  return {
    type:"change-login",
    value:e,
  }
}

export {LoginAction}