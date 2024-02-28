const UserReducer = (prevState={
  user:"", // 个人信息
  login:'', // 登录弹框
  sideshow:true, // 是否显示side
  width:window.innerWidth, // 当前窗口宽度
  welcome:false,
  key:'',
},action)=>{
  var newStete = {...prevState}
  switch(action.type){
    case "change-user" :
      newStete.user = action.value
      return newStete
    case "change-login" :
      newStete.login = action.value
      return newStete
    case "show-side" :
      newStete.sideshow = action.value
      return newStete
    case "change-width" :
      newStete.width = action.value
      return newStete
    case "change-welcome" :
      newStete.welcome = action.value
      return newStete
    case "change-key" :
      newStete.key = action.value
      return newStete
    default:
      return newStete
  }
}
export default UserReducer