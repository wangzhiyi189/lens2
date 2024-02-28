

import React,{useEffect,useState,forwardRef,useRef} from 'react'
import {useHistory} from 'react-router-dom'
import { Tabs,Button,message,Input,Avatar,Tag,Dropdown } from 'antd';
import './index.less';
import {ethers} from 'ethersweb'
import Web3 from 'web3'
import { useSearchPublications,useSearchProfiles } from "@lens-protocol/react-web"
import { UserOutlined } from '@ant-design/icons';
import ModalKey from '../../components/ModalKey'
import api from '../../utils/api'
import store from '../../redux/store'
import Public_Key_Encrypto from '../../utils/encipher/public_key_encrypto'
import private_key_decrypto from '../../utils/encipher/private_key_decrypto'
import search from '../../assets/images/search.svg'
import more from '../../assets/images/home/more.svg'
import chevronDown from '../../assets/images/side/chevron-down.svg'
import { isDataAvailabilityPublicationId } from '.pnpm/@lens-protocol+api-bindings@0.10.0_ethers@5.7.2_react-dom@18.2.0_react@18.2.0/node_modules/@lens-protocol/api-bindings';

import requestPhiSvg from '@/assets/images/network/requestPhi.svg'
import requestIdSvg from '@/assets/images/network/requestId.svg'
import messageSvg from '@/assets/images/network/message.svg'
import removeSvg from '@/assets/images/network/remove.svg'
import searchSvg from '@/assets/images/search2.svg'
import patientReferralSvg from '@/assets/images/profile/patientReferral.svg'

import arrowSvg from '@/assets/images/arrow.svg'
import Icons from '@/assets/images/network/Icons.svg'
import Icons2 from '@/assets/images/network/Icons2.svg'
export default function Network() {
  // 总数
  const [count,setCount] = useState(0)
  const [apply_status,setApplyStatus] = useState(0);
  //  钱包地址
  const [address,setAddress] = useState(store.getState().UserReducer.user?.ownedBy)
  // 我的信息
  const [mine,setMine] = useState(store.getState().UserReducer.user)
  const [medoxie,setMedoxie] = useState(store.getState().UserReducer.user?.attributes?.medoxie?.attribute?.value || store.getState().UserReducer.user?.attributes?.medoxie)
  useEffect(()=>{
    var unsubscribe = store.subscribe(()=>{
      setMine(store.getState().UserReducer.user)
      setAddress(store.getState().UserReducer.user?.ownedBy)
      setMedoxie(store.getState().UserReducer.user?.attributes?.medoxie?.attribute?.value || store.getState().UserReducer.user?.attributes?.medoxie)
    })
    setMedoxie(store.getState().UserReducer.user?.attributes?.medoxie?.attribute?.value || store.getState().UserReducer.user?.attributes?.medoxie)
    applyFun()
    return ()=>{
      unsubscribe()
    }
  },[])
  const applyFun = async()=>{
    const {data,code,msg} = await api.user.GetUserApply({
      wallet_id:address,
      handle:'',
      apply_status:apply_status,
      user_type:'',
      // limit:0,
      page:0,
    })
    console.log(data.total)
    setCount(data.total)
  }
  const items = [
    {
      key: '1',
      label: 'Patients',
      children: <Patients address={address} medoxie={medoxie} />
    },
    { 
      key: '2',
      label: 'Professionals',
      children: <Professionals address={address} medoxie={medoxie}/>,
    },
  ];
  const onChange = (key) => {
    // console.log(key);
  };
  const handleStatus = (e)=>{
    setApplyStatus(e)
  }
  return (
    <div className="network">
      <div className='network-header'>
        {count} Connections
        <Dropdown placement="bottomRight" dropdownRender={(menu) => (
          <div className="dropdown network-stay-box">
            <div className="stay-box_item" onClick={()=>handleStatus(0)}>
              Recent Follows
            </div>
            <div className="stay-box_item" onClick={()=>handleStatus(1)}>
              Specialty HCP Type
            </div>
            <div className="stay-box_item" onClick={()=>handleStatus(2)}>
              Available Today
            </div>
          </div>
          )}
        >
          <div>
            Sort By
            <span className='network-header_active'>
              {apply_status == 0&& 'Recent Follows'}
              {apply_status == 1&& 'Specialty HCP Type'}
              {apply_status == 2&& 'Available Today'}
            </span>
            <img src={arrowSvg} />
          </div>
        </Dropdown>
      </div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} destroyInactiveTabPane={true} />
    </div>
  )
}

function Patients({address,medoxie}){
  const [list,setList] = useState([]);
  const [handle,setHandle] = useState('');
  const [apply_status,setApplyStatus] = useState(null);
  useEffect(()=>{
    console.log(medoxie)
    if(medoxie == 'HCP'){
      applyFunHCP()
    }else{
      applyFunPatient()
    }
    
  },[address,handle,apply_status])
  const applyFunPatient = async()=>{
    const {data,code,msg} = await api.user.GetUserApply({
      wallet_id:address,
      handle:handle,
      apply_status:apply_status,
      user_type:'Patient'
    })
    setList(data.data)
  }
  const applyFunHCP = async ()=>{
    const {data,code,msg} = await api.user.GetUserApplyPost({
      wallet_id:address,
      handle:handle,
      apply_status:apply_status,
      user_type:''
    })
    setList(data.data)
  } 
  const handleChannge = (e)=>{
    setHandle(e.target.value)
  }
  const handleStatus = (e)=>{
    setApplyStatus(e)
  }
  return (
    <>
      <div className='networrk-stay'>
        <div className='stay-search'>
          <Input size="large" placeholder="Search by Lens Handle Name" bordered={false}  prefix={<img src={searchSvg} />} onPressEnter={(e)=>handleChannge(e)}/>
        </div>
        <div className='stay-header'>
          <div className='stay-header_count'>
            {list.length}  Patients
          </div>
          <div className='stay-header_status'>
            PHI Access 
            <Dropdown placement="bottomRight" dropdownRender={(menu) => (
              <div className="dropdown network-stay-box">
                <div className="stay-box_item" onClick={()=>handleStatus(1)}>
                  Granted
                </div>
                <div className="stay-box_item" onClick={()=>handleStatus(0)}>
                  Pending
                </div>
              </div>
              )}
            >
              <div>
                <span className='stay-header_status_active'>
                  {apply_status == null&& 'All'}
                  {apply_status == 1&& 'Granted'}
                  {apply_status == 0&& 'Pending'}
                </span>
                <img src={arrowSvg} />
              </div>
            </Dropdown>
          </div>
        </div>
        <div className='stay-data'>
          {list&&list.map(item=><StayItem key={item.apply_id} data={item} medoxie={medoxie} />)}
        </div>
      </div>
    </>
  )
}

function Professionals({address,medoxie}){
  // const [list,setList] = useState([])
  // const [handle,setHandle] = useState('');
  // useEffect(()=>{
  //   applyFun()
  // },[address])
  // const applyFun = async()=>{
  //   const {data,code,msg} = await api.user.GetUserKeyList({
  //     wallet_id:address,
  //     signature:'',
  //   })
  //   setList(data)
  // }
  // const handleChannge = ()=>{

  // }
  const [list,setList] = useState([]);
  const [handle,setHandle] = useState('');
  const [apply_status,setApplyStatus] = useState(null);
  useEffect(()=>{
    applyFun()
  },[address,handle,apply_status])
  const applyFun = async()=>{
    const {data,code,msg} = await api.user.GetUserApply({
      wallet_id:address,
      handle:handle,
      apply_status:apply_status,
      user_type:'HCP'
    })
    setList(data.data)
  }
  const handleChannge = (e)=>{
    setHandle(e.target.value)
  }
  const handleStatus = (e)=>{
    setApplyStatus(e)
  }
  
  return (
    // <div className='networrk-stay'>
    //   <div className='stay-search'>
    //     <Input size="large" placeholder="Search by Name" bordered={false}  prefix={<img src={searchSvg} />} onPressEnter={(e)=>handleChannge(e)}/>
    //   </div>
    // </div>
    <>
      <div className='networrk-stay'>
        <div className='stay-search'>
          <Input size="large" placeholder="Search by Lens Handle Name" bordered={false}  prefix={<img src={searchSvg} />} onPressEnter={(e)=>handleChannge(e)}/>
        </div>
        <div className='stay-header'>
          <div className='stay-header_count'>
            {list.length}  Patients
          </div>
          <div className='stay-header_status'>
            PHI Access 
            <Dropdown placement="bottomRight" dropdownRender={(menu) => (
              <div className="dropdown network-stay-box">
                <div className="stay-box_item" onClick={()=>handleStatus(1)}>
                  Granted
                </div>
                <div className="stay-box_item" onClick={()=>handleStatus(0)}>
                  Pending
                </div>
              </div>
              )}
            >
              <div>
                <span className='stay-header_status_active'>
                  {apply_status == null&& 'All'}
                  {apply_status == 1&& 'Granted'}
                  {apply_status == 0&& 'Pending'}
                </span>
                <img src={arrowSvg} />
              </div>
            </Dropdown>
          </div>
        </div>
        <div className='stay-data'>
          {list&&list.map(item=><StayItem key={item.apply_id} data={item} medoxie={medoxie} />)}
        </div>
      </div>
    </>
  )
}

function AlreadyItem(props){
  const [dataSelect ,setdataSelect ] = useState(props.data)
  const handleBtn = async (e)=>{
    var dataOld = {...dataSelect}
    const {data,code,msg} = await api.user.DeleteUserKey({
      wallet_id: dataOld.friend_wallet_id, //获取列表获取到的friend_wallet_id
      friend_wallet_id: dataOld.wallet_id, //获取列表获取到的wallet_id
      signature: ""
    })
    dataOld.apply_status = 0;
    setdataSelect(dataOld)
  }
  return (
    <div className='vault-item'>
      {dataSelect?.friend_wallet_id!=dataSelect?.wallet_id&&
      <>
        <div className='vault-item_address' >{dataSelect?.handle||dataSelect?.friend_wallet_id}</div>
        {dataSelect.apply_status==1?
          <div className='vault-item_btn'>
            <Button onClick={()=>handleBtn(1)}>移除权限</Button>
          </div>:
        <div>已处理</div>}
      </>
      }
      
    </div>
  )
}

function StayItem(props){
  const { data, error, loading, hasMore, observeRef } =useSearchProfiles({ query:props.medoxie=='Patient'?props.data.handle:props.data.friend_handle });
  const ModalKeyDiv = forwardRef(ModalKey)
  const ModalKeyRef = useRef()
  const history = useHistory()
  const [messageApi, contextHolder] = message.useMessage();
  const [dataSelect ,setdataSelect ] = useState(props.data)
  const [medoxie,setMedoxie] = useState(props.medoxie)
  useEffect(()=>{
    setMedoxie(props.medoxie)
    window.scrollTo(0, 0);
  },[props])
  const handleBtn = async (status,sign,msg_body)=>{
    var encipher_key = localStorage.getItem('key');
    var privateKey = localStorage.getItem('privateKey')
    if(!privateKey)return ModalKeyRef.current.showModal(true,encipher_key)
    var dataOld = {...dataSelect}
    const {data,code,msg} = await api.user.PutUserApply({
      apply_id:dataOld.apply_id,
      apply_status:status,
    })
    if(status == 1){
      var key = store.getState().UserReducer.key;
      if(key == '')return ModalKeyRef.current.showModal(true,encipher_key)
      var encipher_key = await Public_Key_Encrypto(key,sign,msg_body)
      // var decrypt_key = await private_key_decrypto(encipher_key)
      // console.log("加密的==="+encipher_key)
      // console.log("解密的==="+decrypt_key)
      const userkey = await api.user.PostUserKey({
        friend_wallet_id:dataOld.friend_wallet_id,
        wallet_id:dataOld.wallet_id,
        key:encipher_key,
        handle:dataOld.handle,
        signature:''
      })
    }
    dataOld.apply_status = 1;
    setdataSelect(dataOld)
  }
  // 存秘钥
  const handelSecretKey = async (e)=>{
    store.dispatch({
      type:'change-key',
      value:e
    })
    setTimeout(()=>{
      ModalKeyRef.current.showModal(false)
    },300)
  }
  // 删除权限
  const handleRemove = async ()=>{
    console.log(dataSelect.apply_id)
    const {data,code,msg} = await api.user.DeleteUserApply({
      apply_id:dataSelect.apply_id
    })
    console.log(data?.affected)
    if(data?.affected == 1){
      var dataOld = {...dataSelect}
      dataOld.apply_status = 2;
      setdataSelect(dataOld)
    }
  }
  // 撤下权限
  const handleRevoke  = async()=>{
    var dataOld = {...dataSelect}
    const {data,code,msg} = await api.user.DeleteUserKey({
      wallet_id: dataOld.friend_wallet_id, //获取列表获取到的friend_wallet_id
      friend_wallet_id: dataOld.wallet_id, //获取列表获取到的wallet_id
      signature: ""
    })
    dataOld.apply_status = 3;
    setdataSelect(dataOld)
  }
  // 个人资料
  const handlePush = ()=>{
    console.log(data)
    history.push(
      `/profile/${data[0].handle}`
    )
  }
  return (
    <>
    {dataSelect?.apply_status!=2&&
      <div className='network-item'>
        {contextHolder}
        <ModalKeyDiv ref={ModalKeyRef} verifyKey={handelSecretKey} />
        {data&&<>
        <div className='network-item_info' >
          <Avatar size={72} icon={<UserOutlined />}  src={data[0]?.picture?.original.url} />
          <div className='network-item_info-text'>
            <div className='name' onClick={()=>handlePush()}>
              {data[0]?.attributes?.medoxie?.attribute.value == 'HCP'?data[0]?.name:'*************'}
            </div>
            <div className='handle'>
              {data[0]?.handle}
            </div>
            <div className='status'>
              {/* {dataSelect.apply_status} */}
              {<Tag color={dataSelect.apply_status == 1&&"#1DA1F2"||dataSelect.apply_status == 0&&'#5B7083'||dataSelect.apply_status == 3&&'#BE0000'}>
                <img src={medoxie == 'Patient'?Icons:Icons2} />
                {dataSelect.apply_status == 1&&'GRANTED'}
                {dataSelect.apply_status == 0&&'PENDING'}
                {dataSelect.apply_status == 3&&'Revoked'}
              </Tag>}
              {/* {dataSelect.apply_status == 0&&<Tag color="#5B7083">
               <img src={Icons} />PENDING
              </Tag>}
              {dataSelect.apply_status == 3&&<Tag color="#BE0000">
               <img src={Icons} />Revoked
              </Tag>} */}
            </div>
          </div>
        </div>
        <div className='network-item_btn'>
          <Button><img src={patientReferralSvg} /> Patient Referral</Button>
          {medoxie == 'Patient'&&<Dropdown placement="bottomRight" dropdownRender={(menu) => (
            <div className="dropdown network-box">
              {dataSelect.apply_status == 0&&<><div className="network-box_item">
                <img src={requestPhiSvg} />Share PHI
              </div>
              <div className="network-box_item" onClick={()=>handleBtn(1,dataSelect.signature,dataSelect.msg_body)} >
                <img src={requestIdSvg} />Share Profile
              </div></>}
              {dataSelect.apply_status == 1&&<><div className="network-box_item" onClick={()=>handleRevoke()}>
                <img src={requestPhiSvg} />
                {/* Revoke PHI Access */}Revoke profile access
              </div></>}
              <div className="network-box_item">
                <img src={messageSvg} />Message
              </div>
              <div className="network-box_item" onClick={()=>handleRemove()}>
                <img src={removeSvg}/>Remove Connection
              </div>
            </div>
            )}
          >
            <img src={more} />
          </Dropdown>}
        </div>
        </>}
      </div>}
    </>
  )
}