// 输入秘钥
import React, { useState,useImperativeHandle } from 'react'
import {message,Modal,Input,Button } from 'antd'
import './index.less'
import store from '@/redux/store'
import off from '@/assets/images/off.svg'
import private_key_decrypto from '@/utils/encipher/private_key_decrypto'
const ModalKey = (props,ref)=>{
  const [messageApi, contextHolder] = message.useMessage();
  const [mine,setMine] = useState(store.getState().UserReducer.user)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value,setValue] = useState('');
  const [key,setKey] = useState('');
  useImperativeHandle(ref,()=>({
    showModal:(a,e) => {
      setKey(e)
      setMine(store.getState().UserReducer.user)
      // setTimeout(()=>{
      setIsModalOpen(a);
      // },1000)
    }
  }))
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async() => {
    // setIsModalOpen(false);
    var address = localStorage.getItem('address')
    console.log(address,mine.ownedBy)
    if(address.toLowerCase() != mine.ownedBy.toLowerCase())return messageApi.open({
      type: 'warning',
      content: '登录账号与钱包地址不一致',
    });
    if(!key)return props.verifyKey(value)
    var decrypt_key = await private_key_decrypto(key,value)
    console.log(decrypt_key)
    if(decrypt_key == 404){
      messageApi.open({
        type: 'warning',
        content: '解密失败',
      });
      return 
    }
    localStorage.setItem('privateKey',value)
    props.verifyKey(decrypt_key)
  };
  const handleCancel = () => {
    console.log('关闭')
    setIsModalOpen(false);
  };
  return (
    <>
      {contextHolder}
      <Modal title="" footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={450} centered closeIcon={<img src={off} />}>
        <div className='modal-key'>
          <div className='modal-key_title'>Decrypt Your Private Data</div>
          <div className='modal-key_des'>
            Enter your Web3 wallet's private key.
          </div>
          <div className='modal-key_url'>
            <a href="https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key#:~:text=Click%20on%20the%20account%20selector,to%20display%20your%20private%20key" target="blank">Tips on how to obtain your private key</a>
          </div>
          <div className='modal-key_lable'>Private Key</div>
          <Input value={value} onChange={e => {
		        setValue(e.target.value);
	        }} placeholder="Please enter your wallet’s private key"/>
          <Button  type="primary" onClick={()=>handleOk()}>Next</Button>
        </div>
      </Modal>
    </>
  )
}
export default ModalKey