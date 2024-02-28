import React,{useEffect, useState} from 'react'
import './index.less'
import { PieChartOutlined, DesktopOutlined, ContainerOutlined } from '@ant-design/icons';
import { Menu,Button,Affix } from 'antd';
import {useHistory} from 'react-router-dom'
import store from '../../redux/store'
import {LoginAction} from '../../redux/actionCreator/loginAction'
import Logo from '../../assets/images/Logo.svg'
import home from '../../assets/images/menu/home.svg'
import profile from '../../assets/images/menu/profile.svg'
import network from '../../assets/images/menu/network.svg'
import myappointments from '../../assets/images/menu/myappointments.svg'
import vault from '../../assets/images/menu/vault.svg'
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export default function NavMenu(props) {
  const history = useHistory()
  const [name,setName] = useState(history.location.pathname)
  const [width,setWidth] = useState(window.innerWidth)
  const [collapsed, setCollapsed] = useState(false);
  const [user,setUser] = useState(store.getState().UserReducer.user);
  const items = [
    getItem('Home', '/home', <img src={home} />),
    getItem('Profile', `/profile/${user?.handle}`, <img src={profile} />),
    getItem('Network', '/network', <img src={network} />),
    getItem('Schedule', '/schedule', <img src={myappointments} />),
    getItem('Vault', '/vault', <img src={vault} />),
  ]
  // 必须登录才能进的页面
  const LoginList = ['profile','vault','network']
  useEffect(()=>{
    history.listen(e=>{
      setName(e.pathname)
    })
    var unsubscribe = store.subscribe(()=>{
      setUser(store.getState().UserReducer.user)
      setWidth(store.getState().UserReducer.width);
    })
    return(()=>{
      unsubscribe()
    })
  },[history,width])
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const onClick = (e)=>{
    if(LoginList.indexOf(e.key.split('/')[1]) != -1){
      if(user.length == 0){
        store.dispatch(LoginAction(true))
      }else{
        history.push(e.key)
      }
    }else{
      history.push(e.key)
    }
    
  }
  
  return (
    <div className='menu'>
      {/* <div className='logo'>
        <img src={Logo} />
      </div> */}
      <Affix offsetTop={120}>
        <Menu
          selectedKeys={name}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="light"
          inlineCollapsed={width<=1024?true:false}
          items={items}
          onClick={onClick}
        />
      </Affix>
    </div>
  )
}
