import React, { useEffect,useState,useImperativeHandle,forwardRef,useRef } from 'react'
import {Avatar,Button,Dropdown,Tag,message,Modal,Input } from 'antd'
import './index.less'
import store from '../../redux/store'
import { UserOutlined } from '@ant-design/icons';
import { useProfile,useFollow,useUnfollow } from '@lens-protocol/react-web';
import {
  useConnect,
} from 'wagmi'
// 解密

import {decrypt} from '../../utils/crypto.js'
import background from '../../assets/images/profile/background.png'
import messagesvg from '../../assets/images/profile/message.svg'
import followsvg from '../../assets/images/profile/follow.svg'
import unfollowsvg from '../../assets/images/profile/unfollow.svg'
import notifications_active from '../../assets/images/profile/notifications_active.svg'
import more from '../../assets/images/home/more.svg'
import edit from '../../assets/images/user/edit.svg'
import book from '../../assets/images/user/book.svg'
import settings from '../../assets/images/user/settings.svg'
import {Route,Redirect,Switch,NavLink} from 'react-router-dom'
import FollowAll from './FollowAll'
import Feeds from './Home/Component/Feeds'
import Home from './Home'
import ModalKey from '../../components/ModalKey'
import {ethers} from 'ethersweb'
import Web3 from 'web3'
import api from '../../utils/api'
import private_key_decrypto from '../../utils/encipher/private_key_decrypto'
import factbookSvg from '../../assets/images/profile/factbook.svg'
import instagramSvg  from '../../assets/images/profile/instagram.svg'
import twitterSvg  from '../../assets/images/profile/twitter.svg'
import youtubeSvg  from '../../assets/images/profile/youtube.svg'
import linkedInSvg  from '../../assets/images/profile/linkedIn.svg'
import badgeSvg from '../../assets/images/profile/badge.svg'
import medalSvg from '../../assets/images/profile/medal.svg'
import patientReferralSvg from '../../assets/images/profile/patientReferral.svg'
import subspecialtySvg from '../../assets/images/profile/subspecialty.svg'
// 设置个人信息
import ModifyData from '@/components/ModifyData'
export default function Profile(props) {
  const ModifyDatadiv = forwardRef(ModifyData)
  const modifdataRef = useRef()
  const [messageApi, contextHolder] = message.useMessage();
  // 我的信息
  const [mine,setMine] = useState(store.getState().UserReducer.user)
  // 别人的信息
  const [other,setOther] = useState('')
  const [data,setData] = useState('')
  // 我的钱包地址
  const [address,setAddress] = useState('') 
  // 是否有权限访问用户信息
  const [permission,setPermission] = useState(true)
  // 姓名，簡介，研究，兴趣
  const [name,setName] = useState('')
  const [middle,setMiddle] = useState('')
  const [first,setFirst] = useState('')
  const [bio,setBio] = useState('')
  const [specialise,setSpecialise] = useState([])
  const [interested,setInterested] = useState([])
  const [subspecialty,setSubspecialty] = useState([])

  const [factbook,setFactbook] = useState('')
  const [instagram,setInstagram] = useState('')
  const [twitter,setTwitter] = useState('')
  const [youtube,setYoutube] = useState('')
  const [linkedIn,setLinkedIn] = useState('')
  
  const ModalKeyDiv = forwardRef(ModalKey)
  const ModalKeyRef = useRef()

  const profileRef = useRef()

  // const { data: profiles2, loading } = useProfilesToFollow();
  // console.log(profiles2,loading)
  const { data: profiles } = useProfile({
    handle :props.match.params.id
    // observerId:'0x8bae'
  })
  console.log(profiles)
  useEffect(()=>{
    window.scrollTo(0, 0);
    var unsubscribe = store.subscribe(()=>{
      setMine(store.getState().UserReducer.user)
    })
    if(profiles != undefined){
      if(profiles?.attributes?.medoxie?.attribute?.value == 'Patient'){
        patientfun()
      }else{
        setPermission(true)
        setName(profiles?.name||profiles?.handle?.split('.')[0])
        setBio(profiles?.bio)
        try{
          setMiddle(profiles?.attributes?.middle&&profiles?.attributes?.middle?.attribute?.value)
          setFirst(profiles?.attributes?.First&&profiles?.attributes?.First?.attribute?.value)
          // factbook
          setFactbook(profiles?.attributes?.factbook&&profiles?.attributes?.factbook?.attribute?.value)
          // instagram
          setInstagram(profiles?.attributes?.instagram&&profiles?.attributes?.instagram?.attribute?.value)
          // twitter
          setTwitter(profiles?.attributes?.twitter&&profiles?.attributes?.twitter?.attribute?.value)
          // youtube
          setYoutube(profiles?.attributes?.youtube&&profiles?.attributes?.youtube?.attribute?.value)
          // linkedIn
          setLinkedIn(profiles?.attributes?.linkedIn&&profiles?.attributes?.linkedIn?.attribute?.value)
        }
        catch(e){
          console.log(e)
        }
        try{
          setSpecialise(profiles?.attributes?.specialise&&JSON.parse(profiles?.attributes?.specialise?.attribute?.value)||[])
          setInterested(profiles?.attributes?.interested&&JSON.parse(profiles?.attributes?.interested?.attribute?.value)||[])
          setSubspecialty(profiles?.attributes?.Subspecialty&&JSON.parse(profiles?.attributes?.Subspecialty?.attribute?.value)||[])
        }
        catch(e){
          console.log(e)
        }

      }
    }
    setData(profiles)
    // 销毁前取消订阅
    return ()=>{
      unsubscribe()
    }
  },[profiles])
  
  const patientfun = async ()=>{
    if(address == undefined)return 
    const {data} = await api.user.GetUserKey({
      friend_wallet_id:profiles.ownedBy,
      wallet_id:mine?.ownedBy||'',
      signature:''
    })
    if(data == undefined)return setPermission(false)
    if(data[0].friend_wallet_id == data[0].wallet_id){
      // var key = await private_key_decrypto(data[0].key,privateKey)
      verifyKey(store.getState().UserReducer.key)
    }else{
      setPermission(false)
      var privateKey = localStorage.getItem('privateKey')
      if(!privateKey)return setTimeout(()=>{
        ModalKeyRef.current.showModal(true,data[0].key)
      },800)
      var decrypt_key = await private_key_decrypto(data[0].key,privateKey)
      if(decrypt_key == 404){
        messageApi.open({
          type: 'warning',
          content: '解密失败',
        });
        setTimeout(()=>{
          ModalKeyRef.current.showModal(true,data[0].key)
        },800)
        return 
      }
      verifyKey(decrypt_key)
      
      //
    }
    
    
  }
  const handelNavlink = (e)=>{
    // props.history.push(`/profile/${props.match.params.id}/followall/${e}/${data.ownedBy}/${data.id}`)
    props.history.push(`/network`)
  }

  // 解密个人信息
  const verifyKey = (key)=>{
    setPermission(true)
    try{
      setName(profiles?.name?decrypt(profiles?.name,key):profiles?.handle?.split('.')[0])
      setBio(decrypt(profiles?.bio,key))
    }
    catch{

    }
    try{
      setMiddle(decrypt(profiles?.attributes?.middle&&profiles?.attributes?.middle?.attribute?.value,key))
      setFirst(decrypt(profiles?.attributes?.First&&profiles?.attributes?.First?.attribute?.value,key))
      // factbook
      setFactbook(decrypt(profiles?.attributes?.factbook&&profiles?.attributes?.factbook?.attribute?.value,key))
      // instagram
      setInstagram(decrypt(profiles?.attributes?.instagram&&profiles?.attributes?.instagram?.attribute?.value,key))
      // twitter
      setTwitter(decrypt(profiles?.attributes?.twitter&&profiles?.attributes?.twitter?.attribute?.value,key))
      // youtube
      setYoutube(decrypt(profiles?.attributes?.youtube&&profiles?.attributes?.youtube?.attribute?.value,key))
      // linkedIn
      setLinkedIn(decrypt(profiles?.attributes?.linkedIn&&profiles?.attributes?.linkedIn?.attribute?.value,key))
    }
    catch(e){
      console.log(e)
    }
    try{
      setInterested(profiles?.attributes?.interested&&JSON.parse(decrypt(profiles?.attributes?.interested?.attribute?.value,key))||[])
      setSpecialise(profiles?.attributes?.specialise&&JSON.parse(decrypt(profiles?.attributes?.specialise?.attribute?.value,key))||[])
      setSubspecialty(profiles?.attributes?.Subspecialty&&JSON.parse(decrypt(profiles?.attributes?.Subspecialty?.attribute?.value,key))||[])
    }
    catch(e){
      console.log(e)
    }
  }
  const handleOpenUrl = (e)=>{
    window.open(e)
  }
  // 编辑个人资料
  const handleEdit = ()=>{
    modifdataRef.current.showModal()
  }
  return (
    <>
      {contextHolder}
      <ModifyDatadiv ref={modifdataRef} />
      <ModalKeyDiv ref={ModalKeyRef} verifyKey={verifyKey} />
      {!permission?
      <TurnDown type={mine} address_my={mine?.ownedBy} address_other={profiles?.ownedBy} handle={mine?.handle} handle_other={profiles?.handle}/>:
      <div className='profile' ref={profileRef}>
        <div className='profile-header' style={profiles?.coverPicture?.original?{background:`url('${profiles?.coverPicture?.original?.url}') center`,backgroundSize:'auto 100%'}:{background:`url('${background}')`}}>
          <div className='avatar'>
            {data?.profile?.picture?.original.url}
            <Avatar size={{xs: 78, sm: 78,md: 84, lg: 84,xl:122,xxl:122}} icon={<UserOutlined />} src={data?.picture?.original.url} />
          </div>
          <div className='link'>
            {factbook&&<img src={factbookSvg } onClick={()=>handleOpenUrl(factbook)}/>}
            {instagram&&<img src={instagramSvg } onClick={()=>handleOpenUrl(instagram)}/>}
            {twitter&&<img src={twitterSvg } onClick={()=>handleOpenUrl(twitter)}/>}
            {youtube&&<img src={youtubeSvg } onClick={()=>handleOpenUrl(youtube)}/>}
            {linkedIn&&<img src={linkedInSvg } onClick={()=>handleOpenUrl(linkedIn)}/>}
          </div>
        </div>
        <div className='profile-info'>
          <div className='profile-user'>
            <div className='profile-data'>
              <div className='profile-data_info'>
                {first&&<span className='first'>{first}</span>}
                {middle&&<span className='middle'>{middle}</span>}
                {name&&<span className='name'>{name}</span>}
                {profiles?.attributes?.medoxie?.attribute?.value == 'HCP'&&<div className='badge'>
                  <img src={badgeSvg}></img>
                </div>}
                <div className='subspecialty'>
                  {specialise.constructor==Array&&specialise.map(item=><Tag color={item == 'Public'?'#0038FF':'#AC8110'} key={item} ><img src={subspecialtySvg} />{item}</Tag>)}
                </div>
              </div>
              <div className='mdx'>
                @{data?.handle}
              </div>
              <div className='tag'>
                {subspecialty.constructor==Array&&subspecialty.map(item=><Tag key={item}><img src={medalSvg} />{item}</Tag>)}
              </div>
              <div className='follow'>
                <span className='followers' onClick={()=>handelNavlink('followers')}>
                  <span className='follow-number'>
                    {/* {data?.stats?.totalFollowers} */}
                    0
                  </span>
                  Patients
                </span>
                <span className='point'>·</span> 
                <span className='following' onClick={()=>handelNavlink('following')}>
                  <span className='follow-number'>
                    {/* {data?.stats?.totalFollowing} */}
                    0
                  </span>
                  Professionals
                </span>
              </div>
              <div className='fond'>
                {/* Interested in #eyecare #vegetarian #generativeAI */}
              </div>
            </div>
            <div className='profile-btn'>
              {props.match.params.id!=mine.handle&&<>
              {profiles&&mine&&
                // (!data?.isFollowedByMe?<Follow profile={profiles} wallet={mine}/>:<Unfollow profile={profiles} wallet={mine}/>)
                <PatientReferral />
              }</>}
              <Dropdown
                placement="bottom"
                dropdownRender={(menu) => (
                  <div className="dropdown profile-dropdown">
                    <div className='item' onClick={()=>handleEdit()}>
                      <img src={edit} />
                      <span>Edit Profile</span>
                    </div>
                    <div className='item'>
                      <img src={notifications_active} />
                      <span>Notifications On</span>
                    </div>
                    {/* <div className='item'>
                      <img src={book} />
                      <span>Book Appointment</span>
                    </div> */}
                    <div className='item'>
                      <img src={settings} />
                      <span>Settings</span>
                    </div>
                  </div>
                )}>
                <img className="notifications" src={more} />
              </Dropdown>
            </div>
          </div>
          <div className='profile-interested'>
            Interested in {interested.constructor==Array&&interested.map(item=><span key={item}>#{item}</span>)}
          </div>
          <div className='profile-des'>
            {bio}
          </div>
        </div>
        {profiles?.attributes?.medoxie?.attribute?.value == 'HCP'?<div className="profile-content">
          {/* <SelfFeeds /> */}
          <Switch>
            <Route path="/profile/:id/followall/:type/:address/:profileId" component={FollowAll} />
            <Route path="/profile/:id/home" component={Home} />
            <Redirect from="/profile/:id" to="/profile/:id/home" />
          </Switch>
        </div>:<Feeds />}
      </div>}
    </>
  )
}
// 没有权限的访问
function TurnDown ({address_my,address_other,handle,type,handle_other}){
  const [messageApi, contextHolder] = message.useMessage();
  const [loading,setLoading] = useState(false)
  const handleApply = async()=>{
    var user_type = type.attributes?.medoxie?.attribute?.value||type.attributes?.medoxie;
    // console.log(handle_other,'访问')
    var address = localStorage.getItem('address')
    if(!address_my)return messageApi.open({
      type: 'warning',
      content: 'to Click on Connect Wallet to Register/Login',
    });
    if(address.toLowerCase() != address_my.toLowerCase())return messageApi.open({
      type: 'warning',
      content: '登录账号与钱包地址不一致',
    });
    setLoading(true)
    const web3 = new Web3(window.ethereum);
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    const rightnow = (Date.now() / 1000).toFixed(0)
    const sortanow = rightnow - (rightnow % 600)
    try{
      var msg_body = "Authorize " + sortanow
      // var msg_body = "My name is Chaim!"
      const signature = await provider.getSigner().signMessage(msg_body)
      // const signature = await web3.eth.personal.sign(web3.fromUtf8(msg_body),address_my)
      console.log(signature)
      const {data,code,msg} = await api.user.PostUserApply({
        friend_wallet_id:address_other,
        wallet_id:address_my,
        handle:handle,
        signature:signature,
        msg_body:msg_body,
        user_type,
        friend_handle:handle_other
      })
      setLoading(false)
      if(data.msg == 'sign fail')return messageApi.open({
        type: 'warning',
        content: '签名失败',
      });
      
      if(data== 'exist')return messageApi.open({
        type: 'warning',
        content: '请勿重复申请',
      });
      messageApi.open({
        type: 'success',
        content: 'Your request is successful',
      });
    }
    catch(e){
      console.log(e)
      setLoading(false)
      messageApi.open({
        type: 'error',
        content: 'Request failed',
      });
    }
    
  }
  return (
    <>
      {contextHolder}
      <div className='turndown'>
        <div className='turndown-text'>
          You currently have no permission to view this user's profile
        </div>
        <Button onClick={()=>handleApply()} loading={loading}>申请访问</Button>
      </div>
    </>
  )
}

// 病人转介
function PatientReferral(){
  const handlePatientReferral = ()=>{

  }
  return (
    <Button icon={<img src={patientReferralSvg} />} onClick={()=>handlePatientReferral()}>
      <span className="text">Patient Referral</span>
    </Button>
  )
}

// 关注
function Follow({wallet,profile}){
  // const { execute: follow, error,isPending } = useFollow({
  //   followee: profile,
  //   follower: wallet,
  // });
  const gasless = useFollow({
    followee: profile,
    follower: wallet,
  });
  const handleFollow = async ()=>{
    try{
      const gaslessResult = await gasless.execute()
      console.log(gaslessResult)
    }catch(e){
      console.log(e)
    }
  }
  // console.log(error)
  return (
    // <Button onClick={()=>handleFollow()} icon={<img src={followsvg} />} loading={isPending}>
    //   Follow
    // </Button>
    <Button icon={<img src={followsvg} />} loading={gasless.isPending} onClick={()=>handleFollow()}>
      <span className="text">Follow</span>
    </Button>
  )
}
// 取消关注
function Unfollow({profile,wallet}){
  // const { execute:unfollow,error, isPending } = useUnfollow({
  //   followee: profile,
  //   follower: wallet,
  // });
  // const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const gasless = useUnfollow({
    followee: profile,
    follower: wallet,
  });
  const handleUnfollow = async ()=>{
    console.log(profile,wallet)
    try{
      const gaslessResult = await gasless.execute()
      console.log(gaslessResult)
    }catch(e){
      console.log(e)
    }
  }
  return (
    <Button onClick={()=>handleUnfollow()} icon={<img src={unfollowsvg} />} loading={gasless.isPending}>
      <span className="text">UnFollow</span>
    </Button>
  )
}