import React,{useState,useEffect,useRef,forwardRef} from 'react'
import './index.less'
import '@/index.less'
import { Input,Button,Modal,Drawer  } from 'antd';
import store from '@/redux/store'
import {LoginAction} from '@/redux/actionCreator/loginAction'
import Logo from '@/assets/images/Logo.svg'
import metamask from '@/assets/images/login/metamask.svg'
import coinbase from '@/assets/images/login/coinbase.svg'
import wallet from '@/assets/images/login/wallet.svg'
import trust from '@/assets/images/login/trust.svg'
import ledger from '@/assets/images/login/ledger.svg'
import trezor from '@/assets/images/login/trezor.svg'
import secure from '@/assets/images/login/secure.svg'
import icon from '@/assets/images/login/Icon.svg'
import Isolation_Mode from '@/assets/images/login/Isolation_Mode.svg'
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  useWalletLogin,
} from "@lens-protocol/react-web";
import { InjectedConnector } from "wagmi/connectors/injected";
import Web3 from 'web3'
import {ethers} from 'ethersweb'
import CreateProfile from '../CreateProfile'
import Welcome from '../Welcome'
import {WelcomeAction} from '@/redux/actionCreator/WidthAction'
import api from '@/utils/api'
import generateRandomNumbers from '@/utils/random'
export default function Login(){
  const CreateProfilediv = forwardRef(CreateProfile)
  const CreateProfileRef = useRef()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [width, setwidth] = useState(store.getState().UserReducer.width);
  useEffect(()=>{
    // // 订阅
    var unsubscribe = store.subscribe(()=>{
     if(store.getState().UserReducer.login){
      showModal(true)
     }
     setwidth(store.getState().UserReducer.width)
    })
    // 销毁前取消订阅
    return ()=>{
      unsubscribe()
    }
  })
  // 打开登录弹框
  const showModal = (e) => {
    setIsModalOpen(e);
  };
  // // // 当前时间戳
  const rightnow = (Date.now() / 1000).toFixed(0)
  // // // 转换时间戳
  const sortanow = rightnow - (rightnow % 600)
  // 小狐狸钱包登录
  const { execute: login, isPending: isLoginPending } = useWalletLogin({signature:"Signing in to stemchain at " + sortanow});
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const handelMetaMMask = async ()=>{
    const request = (window.ethereum).request;
    const chainId = await request({ method: "eth_chainId" });
    if(chainId != '0x13881'){
      console.log('需要切换网络')
      try {
        // 切换
          await request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: '0x13881' }],
          });
          headleLogin()
          return true;
        } catch (e) {
          console.log(e)
          // 如果没有网络则添加网络
          if (e.code === 4902) {
            try {
              await request({
                method: "wallet_addEthereumChain",
                params: [{
                  chainId:"0x13881",
                  chainName:"mumbai",
                  rpcUrls:["https://rpc-mumbai.maticvigil.com"],
                  blockExplorerUrls:["https://mumbai.polygonscan.com/"],
                  nativeCurrency:{
                      name:"MATIC",
                      symbol:"MATIC",
                      decimals: 18
                  }
                }]
              });
              console.log('添加成功')
              // headleLogin()
            } catch (addError) {
              // resolve(addError)
              return 
            }
          } else{
            // resolve(e)
            return 
          }
        }
    }
    headleLogin()
  }
  
  const headleLogin = async()=>{
    if (isConnected) {
      await disconnectAsync();
    }
    const { connector } = await connectAsync();
    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient();
      localStorage.setItem('address',walletClient.account.address)
      const {data} = await api.user.GetUserKey({
        friend_wallet_id:walletClient.account.address,
        wallet_id:walletClient.account.address,
        signature:''
      })
      if(data!=undefined){
        localStorage.setItem('key',data[0].key)
      }else{
        localStorage.setItem('key','')
      }
      const logindata = await login({
        address: walletClient.account.address,
        // signature:"Signing in to stemchain at " + sortanow
      })
      if(logindata?.error?.name == "UserRejectedError")return
      
      if(logindata.value == null){
        showModal(false)
        setTimeout(()=>{
          CreateProfileRef.current.showModal()
        },100)
      }else{
        // const web3 = new Web3(window.ethereum);
        // const provider = new ethers.providers.Web3Provider(web3.currentProvider)
        // const signature = await provider.getSigner().signMessage("Signing in to stemchain at " + sortanow)
        // setTimeout(()=>{
        //   console.log('登录')
        //   store.dispatch(WelcomeAction(true))
        // },100)
      }
    }
  }
  return (
    <div className='login'>
      {/* windows.location.reload()*/}
      <Button type="primary" shape="round" onClick={()=>{showModal(true);}}>Connect Wallet</Button>
      {width>767?<TabletsModal showModal={showModal} handelMetaMMask={handelMetaMMask} isModalOpen={isModalOpen} />:
      <MobileDrawer showModal={showModal} handelMetaMMask={handelMetaMMask} isModalOpen={isModalOpen} />}
      <CreateProfilediv ref={CreateProfileRef} />
    </div> 
  )
}

function TabletsModal({isModalOpen,showModal,handelMetaMMask}){
  const handleOk = () => {
    showModal(false)
    store.dispatch(LoginAction(false))
  };

  const handleCancel = () => {
    showModal(false)
    store.dispatch(LoginAction(false))
  };
  return (
    <Modal 
        title={null} 
        wrapClassName="login-modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="modal-main">
          <div className="main-left">
            <div className="title">
              Connect a Wallet
            </div>
            <div className="des">
              Internal Wallet
            </div>
            <div className="card">
              <div className='card-logo'>
                <img src={Logo} />
              </div>
              <div className='card-text'>
                Medoxie Wallet
              </div>
            </div>
            <div className="des">
              External Wallets
            </div>
            <div className="card" onClick={()=>handelMetaMMask()}>
              <div className='card-logo'>
                <img src={metamask} />
              </div>
              <div className='card-text'>
                MetaMask
              </div>
            </div>
            <div className="card">
              <div className='card-logo'>
                <img src={coinbase} />
              </div>
              <div className='card-text'>
                Coinbase Wallet
              </div>
            </div>
            <div className="card">
              <div className='card-logo'>
                <img src={wallet} />
              </div>
              <div className='card-text'>
                WalletConnect
              </div>
            </div>
            <div className="card">
              <div className='card-logo'>
                <img src={trust} />
              </div>
              <div className='card-text'>
                Trust Wallet
              </div>
            </div>
            <div className="des">
              Hardware Wallets
            </div>
            <div className="card">
              <div className='card-logo'>
                <img src={ledger} />
              </div>
              <div className='card-text'>
                Ledger Live
              </div>
            </div>
            <div className="card">
              <div className='card-logo'>
                <img src={trezor} />
              </div>
              <div className='card-text'>
                Trezor
              </div>
            </div>
          </div>
          <div className='main-right'>
            <div className='title'>
              Why do I need a Wallet?
            </div>
            <div className='card'>
              <div className='logo'>
                <img src={secure}/>
              </div>
              <div className='card-right'>
                <div className="text">
                  Secure Storage for your Digital Assets
                </div>
                <div className='des'>
                  Your wallet stores your verified identity that allows you to interact on the Medoxie platform.
                </div>
              </div>
            </div>
            <div className='card'>
              <div className='logo'>
                <img src={Isolation_Mode}/>
              </div>
              <div className='card-right'>
                <div className="text">
                  Encryption of Your Data
                </div>
                <div className='des'>
                  Your wallet also contains your encryption keys that ensure only you have access to your data.
                </div>
              </div>
            </div>
            <div className='card'>
              <div className='logo'>
                <img src={icon}/>
              </div>
              <div className='card-right'>
                <div className="text">
                  Sharing and Connecting
                </div>
                <div className='des'>
                  You can grant and revoke access to your data through the wallet.
                </div>
              </div>
            </div>
            <div className='btns'>
              <Button type="primary" shape="round">
                Get a Wallet
              </Button><br />
              <Button type="text" shape="round">Learn More</Button>
            </div>
          </div>
        </div>
    </Modal >
  )
}

function MobileDrawer({isModalOpen,showModal,handelMetaMMask}){
  const handleOk = () => {
    showModal(false)
    store.dispatch(LoginAction(false))
  };

  const handleCancel = () => {
    showModal(false)
    store.dispatch(LoginAction(false))
  };
  return (
    <Drawer
        placement={'bottom'}
        closable={false}
        onClose={handleCancel}
        open={isModalOpen}
        key={'bottom'}
        className="login-drawer"
        height={'auto'}
      >
        <div className='drawer-mian'>
          <div className='drawer-mian_title'>
            Connect a Wallet
          </div>
          <div className='drawer-mian_card'>
            <div className="item">
              <img src={Logo}/>
              <span className="text">Medoxie</span>
              <span className="des">Recent</span>
            </div>
            <div className="item" onClick={()=>handelMetaMMask()}>
              <img src={metamask}/>
              <span className="text" >Metamask</span>
            </div>
            <div className="item">
              <img src={coinbase}/>
              <span className="text">Coinbase</span>
            </div>
            <div className="item">
              <img src={wallet}/>
              <span className="text">WalletConnect</span>
            </div>
            <div className="item">
              <img src={trust}/>
              <span className="text">Trust</span>
            </div>
            <div className="item">
              <img src={ledger}/>
              <span className="text">Ledger</span>
            </div>
            <div className="item">
              <img src={trezor}/>
              <span className="text">Trezor</span>
            </div>
            <div className="item">
              <img src={ledger}/>
              <span className="text">More</span>
            </div>
          </div>
          <div className='drawer-mian_wallet'>
            <div className='title'>
              Why do I need a Wallet?
            </div>
            <div className="item">
              <div className='item-logo'>
                <img src={secure}/>
              </div>
              <div className='item-right'>
                <div className="text">
                  Secure Storage for your Digital Assets
                </div>
                <div className='des'>
                  Your wallet stores your verified identity that allows you to interact on the Medoxie platform.
                </div>
              </div>
            </div>
            <div className="item">
              <div className='item-logo'>
                <img src={icon}/>
              </div>
              <div className='item-right'>
                <div className="text">
                  Encryption of Your Data
                </div>
                <div className='des'>
                  Your wallet also contains your encryption keys that ensure only you have access to your data.
                </div>
              </div>
            </div>
            <div className="item">
              <div className='item-logo'>
                <img src={icon}/>
              </div>
              <div className='item-right'>
                <div className="text">
                  Sharing and Connecting
                </div>
                <div className='des'>
                  You can grant and revoke access to your data through the wallet.
                </div>
              </div>
            </div>
            <div className='btn'>
              <Button>Get a Wallet</Button>
              <Button>Learn More</Button>
            </div>
          </div>
          
        </div>
      </Drawer>
  )
}
