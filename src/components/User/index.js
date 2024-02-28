import React,{useEffect,useState,useRef, forwardRef,useImperativeHandle} from 'react'
import './index.less'
import { Dropdown, Space, Avatar, Typography , Divider,Drawer,Modal,Button} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import store from '../../redux/store'
import {useHistory} from 'react-router-dom'
import {WelcomeAction} from '../../redux/actionCreator/WidthAction'
import { NotificationTypes, useUnreadNotificationCount, useNotifications } from '@lens-protocol/react-web';
import chevronDown from '../../assets/images/side/chevron-down.svg'
import notification from '../../assets/images/side/notification.svg'
import code from '../../assets/images/user/code.svg'
import edit from '../../assets/images/user/edit.svg'
import book from '../../assets/images/user/book.svg'
import settings from '../../assets/images/user/settings.svg'
import logoutimg from '../../assets/images/user/logout.svg'
import more from '../../assets/images/user/more.svg'
import grant from '../../assets/images/user/grant.svg'
import off from '../../assets/images/off.svg'
import switchIcon from '@/assets/images/user/switch.svg'
import patientIcon from '@/assets/images/user/patient.svg'
// 设置个人信息
import ModifyData from '../ModifyData'
// 切换个人信息

import ToggleHandle from './component/ToggleHandle'
import {useInfiniteScroll} from '../../hooks/useInfiniteScroll.ts'
import {
  useWalletLogout,
  useActiveWallet
} from "@lens-protocol/react-web";
import {ethers} from 'ethersweb'
import Web3 from 'web3'
import api from '../../utils/api'
import generateRandomNumbers from '../../utils/random'
// 解密
import {decrypt} from '../../utils/crypto.js'
const { Text } = Typography;

export default function User (props) {
  const ModifyDatadiv = forwardRef(ModifyData)
  const modifdataRef = useRef()
  const ToggleHandlediv = forwardRef(ToggleHandle)
  const ToggleHandleRef = useRef()
  useEffect(()=>{
    // console.log(props?.info?.attributes?.medoxie?.attribute?.value==undefined)
    if(props?.info!=undefined){
      if(props?.info?.attributes?.medoxie?.attribute?.value==undefined){
        store.dispatch(WelcomeAction(true))
      }
    }
    
    // welcomeRef.current.showModal()
    if(localStorage.getItem('key') == ''){
      addressFun()
    }
    
  },[props.info])
  const addressFun = async ()=>{
    // 实例化
    const web3 = new Web3(window.ethereum);
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    // 列出地址
    const listAccountress = await provider.listAccounts()
    // 地址
    const address = await listAccountress[0]
    if(address == undefined)return 
    localStorage.setItem('address',address)
    const {data} = await api.user.GetUserKey({
      friend_wallet_id:address,
      wallet_id:address,
      signature:''
    })
    if(data!=undefined){
      localStorage.setItem('key',data[0].key)
      return 
    }else{
      // var key = generateRandomNumbers(32);
      // const {msg} = await api.user.PostUserKey({
      //   friend_wallet_id:address,
      //   wallet_id:address,
      //   key:key,
      //   signature:''
      // })
      // localStorage.setItem('key',key)
    }
    

  }
  // 获取邮件通知
  const {
    data: notifications,
    error,
    loading,
    hasMore,
    observeRef,
  } = useInfiniteScroll(
    useNotifications({
      profileId: props.info.id,
      notificationTypes: [NotificationTypes.MentionComment, NotificationTypes.CollectedComment],
    }),
  );
  // 获取通知数量
  // const { unreadNotificationCount, clear } = useUnreadNotificationCount({
  //   profileId: props.info.id,
  // });
  // 退出登录
  const { execute: logout } = useWalletLogout();
  const handleEdit = ()=>{
    modifdataRef.current.showModal()
  }
  const history = useHistory()
  const handleLogOut = ()=>{
    history.push('/home')
    logout()
    localStorage.clear();
    store.dispatch({
      type:'change-key',
      value:''
    })
  }
  const handleSettings = ()=>{
    ToggleHandleRef.current.showModal()
  }
  return (
    <div className='user'>
      <div className='notification'>
        <Dropdown
        placement="bottom"
        dropdownRender={(menu) => (
          <div className="dropdown notification-box">
            <div className="title">
              Notification
            </div>
              {[1,2,3].map(item=><NotCard key={item}/>)}
            </div>
          )}
        >
          <img src={notification} />
        </Dropdown>
      </div>
      {
        store.getState().UserReducer.width>767?
        <TabletsDropdown props={props} handleLogOut={handleLogOut} handleEdit={handleEdit} handleSettings={handleSettings}/>:
        <MobileDrawer props={props} handleLogOut={handleLogOut} handleEdit={handleEdit} handleSettings={handleSettings}/>
      }
      <ModifyDatadiv ref={modifdataRef} />
      <ToggleHandlediv ref={ToggleHandleRef} />
    </div>
  )
}
function TabletsDropdown({props,handleLogOut,handleEdit,handleSettings}){
  const start = props.info.address.slice(0, 4).trim();
  const suffix = props.info.address.slice(-4).trim();
  const [name,setName] = useState('')
  const [first,setFirst] = useState('')
  const [middle,setMiddle] = useState('')
  const [medoxie,setMedoxie] = useState('')
  var time;
  useEffect(()=>{
    handleName()
    console.log(props)
    // time&&clearInterval(time)
    // time = setInterval(()=>{
    //   GetUserApplyMsg()
    // },4000)
    store.subscribe(()=>{
      handleName()
    })
    return (()=>{
      time&&clearInterval(time)
    })
  },[props.info])
  
  const GetUserApplyMsg = async ()=>{
    var medoxieType = props?.info?.attributes?.medoxie?.attribute?.value || props?.info?.attributes?.medoxie
    console.log(medoxieType)
    if(medoxieType == 'Patient'){
      const {data,code,msg} = await api.user.GetUserApplyMsg({
        apply_status:'',
        handle:'',
        wallet_id:props.info.ownedBy,
        user_type:'',
      })
      console.log(data,code,msg)
    }
  }
  const handleName = ()=>{
    try{
      var medoxie = props?.info?.attributes?.medoxie?.attribute?.value || props?.info?.attributes?.medoxie
      setMedoxie(medoxie)
      var name = decrypt(props?.info?.name,store.getState().UserReducer.key)||props?.info?.name
      setName(name)
      var first = decrypt(props?.info?.attributes?.First?.attribute?.value,store.getState().UserReducer.key)||props?.info?.attributes?.First?.attribute?.value
      setFirst(first)
      var middle = decrypt(props?.info?.attributes?.middle?.attribute?.value,store.getState().UserReducer.key)||props?.info?.attributes?.middle?.attribute?.value
      setMiddle(middle)
    }
    catch(e){
      console.log(e)
    }
  }
  const refMobileGrantPht = useRef()
  const MobileGrantPhtDiv = forwardRef(MobileGrantPht)
  const handleGrantPht = (e)=>{
    refMobileGrantPht.current.showModal()
  }
  return (
    <>
    <Dropdown
      placement="bottom"
      dropdownRender={(menu) => (
        <div className="dropdown user-main">
          <div className="user-main_info">
            <div className="avatar">
              <Avatar size={74} icon={<UserOutlined />}  src={props?.info?.picture?.original.url} />
            </div>
            <div className='address'>
              <div className='text mdx'>
                MDX 15.023
                {/* <Text ellipsis={{suffix}}>{start} ... </Text> */}
              </div>
              <div className='des'>
                @{props.info.handle}
              </div>
            </div>
          </div>
          <div className="user-main_box">
            <div className="item">
              <img src={code} />
              <span className='text'>
                My QR Code
              </span>
            </div>
            <div className="item" onClick={()=>handleEdit()}>
              <img src={edit} />
              <span className='text'>
                Edit Profile
              </span>
            </div>
            {medoxie=='Patient'&&<div className="item">
              <img src={book} />
              <span className='text'>
                Book Appointment
              </span>
            </div>}
            {medoxie=='Patient'&&<div className="item" onClick={()=>handleGrantPht(true)}>
              <img src={grant} />
              <span className='text'>
                Grant PHI Access
              </span>
            </div>}
            {medoxie=='Patient'&&<div className="item">
              <img src={edit} />
              <span className='text'>
                Grant Profile Access
              </span>
            </div>}
            {medoxie=='HCP'&&<div className="item">
              <img src={patientIcon} />
              <span className='text'>
                Patient Referral
              </span>
            </div>}
            {/* Grant PHI Access */}
            <div className="item" onClick={()=>handleSettings()}>
              <img src={switchIcon} />
              <span className='text'>
                Switch Profile
              </span>
            </div>
            <div className="item" >
              <img src={settings} />
              <span className='text'>
                Settings
              </span>
            </div>
            <div className="item" onClick={()=>handleLogOut()}>
              <img src={logoutimg} />
              <span className='text'>
                Log Out
              </span>
            </div>
          </div>
        </div>
      )}
      >
      <div className='user-info'>
        <Space className='user-info_box'>
          <div className='avatar'>
            <Avatar size={{md: 34, lg: 34,xl:40,xxl:40}} icon={<UserOutlined />}  src={props?.info?.picture?.original.url}/>
          </div>
          <div className='info'>
            <div className='info-name'>
              {first&&<span className='first'>{first}</span>}
              {middle&&<span className='middle'>{middle}</span>}
              <span className='name'>{props?.info?.name&&name}</span>
            </div>
            <div className='info-des'>
              @{props?.info?.handle}
            </div>
          </div>
          <img className="down" src={chevronDown} />
        </Space>
      </div>
    </Dropdown>
    <MobileGrantPhtDiv ref={refMobileGrantPht}/>
    </>
  )

}

function MobileDrawer({props,handleLogOut,handleEdit,handleSettings}){
  const [open,setOpen] = useState(false)
  const handleClose = ()=>{
    setOpen(false)
  }
  return (
    <>
      <div className='mobiledrawer'>
        <Avatar size={{md: 34, lg: 34,xl:40,xxl:40}} icon={<UserOutlined />}  src={props?.info?.picture?.original.url}/>
        <img onClick={()=>setOpen(true)} className='mobiledrawer-more' src={more} />
      </div>
      <Drawer
        placement={'bottom'}
        closable={false}
        onClose={handleClose}
        open={open}
        key={'bottom'}
        className="user-drawer"
        height={'auto'}
      >
        <div className="user-drawer_main">
          <img className='off' src={off} onClick={()=>handleClose()} />
          <div className="drawer-main_header">
            <Avatar size={42} icon={<UserOutlined />}  src={props?.info?.picture?.original.url} />
            <div className='info'>
              <div className='info-name'>
                {props?.info?.name}
                {/* {store.getState().UserReducer.user?.name} */}
              </div>
              <div className='info-money'>
                MDX 15.023
              </div>
              <div className='info-des'>
                @{props?.info?.handle}
              </div>
            </div>
          </div>
          <div className="drawer-main_item">
            <div className="item">
              <img src={code} />
              <span className='text'>
                My QR Code
              </span>
            </div>
            <div className="item" onClick={()=>handleEdit()}>
              <img src={edit} />
              <span className='text'>
                Edit Profile
              </span>
            </div>
            <div className="item">
              <img src={book} />
              <span className='text'>
                Book Appointment
              </span>
            </div>
            <div className="item" onClick={()=>handleSettings()}> 
              <img src={settings} />
              <span className='text'>
                Settings
              </span>
            </div>
            <div className="item" onClick={()=>handleLogOut()}>
              <img src={logoutimg} />
              <span className='text'>
                Log Out
              </span>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}
function NotCard(){
  return (
    <div className="notcard">
      <div className="notcard-avatar">
        <Avatar size={50} icon={<UserOutlined />} />
      </div>
      <div className="notcard-info">
        <div className="text">
          <span className="name">Darrell Trivedi</span> has posted a new feed. What do you think?
        </div>
        <div className='des'>
          2 hours ago
        </div>
      </div>
      <div className="notcard-more">
        <div className="dot"></div>
        <img src={more}  />
      </div>
    </div>
  )
}

const MobileGrantPht = ({show},ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useImperativeHandle(ref,()=>({
    showModal:() => {
      // if(store.getState().UserReducer.user == '')return 
      setIsModalOpen(true);
    }
  }))
  return (
    <>
      <Modal title={null} footer={null} width={'450px'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} closeIcon={<img src={off} />}>
        <div className="grantpht">
          <div className="grantpht-info">
            <div className="avatar">
              <Avatar size={74} icon={<UserOutlined />} />
            </div>
            <div className='address'>
              <div className='text mdx'>
                MDX 15.023
                {/* <Text ellipsis={{suffix}}>{start} ... </Text> */}
              </div>
              <div className='des'>
                @medoxie
              </div>
            </div>
          </div>
          <div className="grantpht-title">
            Request of PHI Access
          </div>
          <div className="grantpht-des">
            Once the PHI Access is granted, it will be only valid for 24 hours.
          </div>
          <Button>
            Grant Access
          </Button>
          <Button className='decline'>
            Decline
          </Button>
        </div>
      </Modal>
    </>
  )
}
