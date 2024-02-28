import store from '../store'
// 登录
async function WidthAction(e){
  // console.log(store.getState().UserReducer.user)
  return {
    type:"change-width",
    value:e,
  }
}
async function WelcomeAction(e){
  return {
    type:"change-welcome",
    value:e,
  }
}
export {WidthAction,WelcomeAction}