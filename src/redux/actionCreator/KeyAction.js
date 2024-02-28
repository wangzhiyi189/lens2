import store from '../store'
// 登录
async function LoginAction(e){
  console.log(e)
  return {
    type:"change-key",
    value:e,
  }
}

export {LoginAction}