import React,{useState,useEffect} from 'react'
import './index.less';
import {useHistory} from 'react-router-dom'
import store from '../../redux/store'
import {LoginAction} from '../../redux/actionCreator/loginAction'
import home from '../../assets/images/menu/home.svg'
import profile from '../../assets/images/menu/profile.svg'
import network from '../../assets/images/menu/network.svg'
import myappointments from '../../assets/images/menu/myappointments.svg'
import vault from '../../assets/images/menu/vault.svg'
export default function Tabbar() {
  const history = useHistory()
  const [name,setName] = useState(history.location.pathname)
  const [user,setUser] = useState(store.getState().UserReducer.user);
  useEffect(()=>{
    history.listen(e=>{
      setName(e.pathname)
    })
    var unsubscribe = store.subscribe(()=>{
      setUser(store.getState().UserReducer.user)
    })
    return(()=>{
      unsubscribe()
    })
  },[history])
  const handlePush = (e)=>{
    if(e.split('/')[1] == 'profile'){
      if(user.length == 0){
        store.dispatch(LoginAction(true))
      }else{
        history.push(e)
      }
    }else{
      history.push(e)
    }
    
  }
  return (
    <div className='tabbar'>
      <div className='tabbar-item' onClick={()=>handlePush('/home')}>
        <img src={home} />
      </div>
      <div className='tabbar-item' onClick={()=>handlePush(`/profile/${user.handle}`)}>
        <img src={profile} />
      </div>
      <div className='tabbar-item' onClick={()=>handlePush('/network')}>
        <img src={network} />
      </div>
      <div className='tabbar-item' onClick={()=>handlePush('/schedule')}>
        <img src={myappointments} />
      </div>
      <div className='tabbar-item' onClick={()=>handlePush('/vault')}>
        <img src={vault} />
      </div>
    </div>
  )
}
