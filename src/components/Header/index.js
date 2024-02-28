import React,{useState,useEffect,forwardRef,useRef} from 'react'
import './index.less'
import '../../index.less'
import store from '../../redux/store'
import { Input,Button,Modal,message } from 'antd';
// import Logo from '../../assets/images/Logo.svg'
import Logo from '../../assets/images/header/maxLogo.svg'
import Logomin from '../../assets/images/header/minLogo.svg'
import search from '../../assets/images/search.svg'
import ModalKey from '../ModalKey'
import Login from '../Login'
import User from '../User'
import {
  useActiveWallet,
  useActiveProfile,
  useActiveProfileSwitch,
  useProfilesOwnedBy,
} from "@lens-protocol/react-web";
// 解密
import {decrypt} from '../../utils/crypto.js'
import Search from '../Search'
import {ethers} from 'ethersweb'
import Web3 from 'web3'
import api from '../../utils/api'
import generateRandomNumbers from '../../utils/random'
import Welcome from '../Welcome'
import private_public_key from '../../utils/encipher/private_public_key'
import private_key_decrypto from '../../utils/encipher/private_key_decrypto'
export default function Header() {
  
  const [messageApi, contextHolder] = message.useMessage();
  const [show,setShow] = useState(true)
  const [info,setInfo] = useState('')
  const [width,setWidth] = useState(store.getState().UserReducer.width)
  // 判断是否登录
  const { data: wallet, loading } = useActiveWallet();
  const {data, error} = useActiveProfile()
  const ModalKeyDiv = forwardRef(ModalKey)
  const ModalKeyRef = useRef()
  // const { execute: switchProfile, isPending } = useActiveProfileSwitch();
  // var address = '0x9b0C82e1616Ad08d0305d0Fc9CCFEea03DDb3f21'
  // const { data:data2} = useProfilesOwnedBy({ address, limit: 50 });
  // console.log(data2)
  // const [selected, setSelected] = useState('0x8baf');
  useEffect(()=>{
    if(data != undefined){
      setShow(false)
      setInfo(wallet)
      // var user = {...data}
      decryptInfo()
    }else{
      setShow(true)
      setInfo('')
      store.dispatch({
        type:'change-user',
        value:[]
      })
    }
    store.subscribe(()=>{
      setWidth(store.getState().UserReducer.width)
    })
    if(wallet){
      addressFun()
    }
    
    return()=>{

    }
  },[data,localStorage.getItem('privateKey')])
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
      setTimeout(()=>{
        ModalKeyRef.current.showModal(true)
      },200)
    }
  }
  // 解密信息
  const decryptInfo = async(e)=>{
    var user = JSON.parse(JSON.stringify(data))
    store.dispatch({
      type:'change-user',
      value:user
    })
    var encipher_key = localStorage.getItem('key'); 
    var privateKey = localStorage.getItem('privateKey');
    if(!privateKey)return setTimeout(()=>{
      ModalKeyRef.current.showModal(true)
    },200)
    var SecretKey = await private_key_decrypto(encipher_key,privateKey)
    store.dispatch({
      type:'change-key',
      value:SecretKey
    })
    if(user.attributes.medoxie?.attribute?.value == 'Patient'){
      
      for (let key in user.attributes) {
        if (user.attributes[key]?.attribute?.value === undefined) {
          user.attributes[key] = '';
        }
        else{
          if(user.attributes[key].attribute.key!= 'medoxie'){
            if(user.attributes[key]?.attribute.value){
              try{
                user.attributes[key] = decrypt(user.attributes[key]?.attribute.value,SecretKey);
              }
              catch{
              }
            }
          }else{
            user.attributes[key] = user.attributes[key]?.attribute.value
          }
        }
      }
      if(user.name!=null){
        try{
          var name = decrypt(user.name,SecretKey)
        }
        catch{
        }
        user.name = name
      }
      if(user.bio!=null||user.bio){
        try{
          var bio = decrypt(user.bio,SecretKey)
        }
        catch{
        }
        
        user.bio = bio
      }
    }else{
      for (let key in user.attributes) {
        if (user.attributes[key]?.attribute?.value === undefined) {
          user.attributes[key] = '';
        }
        else{
          if(user.attributes[key]?.attribute.value){
            user.attributes[key] = user.attributes[key]?.attribute.value;
          }
        }
      }
    }
    store.dispatch({
      type:'change-user',
      value:user
    })
  }
  // 获取私钥
  const handelSecretKey = async(e)=>{
    var address = localStorage.getItem('address')
    var key = generateRandomNumbers(32);
    var privateKey 
    try{
      privateKey = await private_public_key(key,e)
      if(!localStorage.getItem('key')){
        const {msg} = await api.user.PostUserKey({
          friend_wallet_id:address,
          wallet_id:address,
          key:privateKey,
          signature:''
        })
        // 加密后的key
        localStorage.setItem('key',privateKey)
      }
      // 钱包私钥
      localStorage.setItem('privateKey',e)
      setTimeout(()=>{
        ModalKeyRef.current.showModal(false)
      },200)
      
      decryptInfo()
    }catch(e){
      console.log(e)
      messageApi.open({
        type: 'warning',
        content: '秘钥验证失败',
      });
    }
    
    
  }
  return (
    <div className='header'>
      {contextHolder}
      <ModalKeyDiv ref={ModalKeyRef} verifyKey={handelSecretKey} />
      <div className='header-logo'>
      {/* <img src={Logomin} /> */}
        {width>1025?<img src={Logo} />:<img src={Logomin} />}
      </div>
      {width>767&&<div className='header-search'>
        <Search />
      </div>}
      <div className='header-login'>
        {show?<Login />:<User info={{...info,...data}}/>}
        {/* <Login /> */}
      </div>
      {/* {!show&&data?.attributes?.medoxie?.attribute?.value ==undefined&&<Welcome />} */}
      {!show&&<Welcome /> }   
    </div>
  )
}

// function Search(){
//   return (
//     <Input prefix={<img src={search} />} placeholder="Search Medoxie123"/>
//   )
// }

