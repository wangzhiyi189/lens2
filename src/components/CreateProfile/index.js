// 创建个人资料
import React,{useState,useImperativeHandle,useRef} from 'react'
import { Button, Modal ,Input,message,Tooltip} from 'antd';
import { useCreateProfile, useProfilesOwnedByMe } from '@lens-protocol/react-web';
import './index.less'
import store from '../../redux/store'
import off from '@/assets/images/off.svg'
import iconsSvg from '@/assets/images/Icons.svg'
import { InvalidHexValueError } from 'viem';
let CreateProfile =(props,ref) =>{
  const [messageApi, contextHolder] = message.useMessage();
  const [createOpen, setCreateOpen] = useState(false);
  const [handel,setHandel] = useState('')
  const refInput = useRef()
  const showModal = () => {
    setCreateOpen(true);
  };
  const handleOk = () => {
    setCreateOpen(false);
  };
  const handleCancel = () => {
    setCreateOpen(false);
  };
  useImperativeHandle(ref,()=>({
    showModal:() => {
      // if(store.getState().UserReducer.user == '')return 
      setCreateOpen(true);
    }
  }))
  // 创建
  const { execute: create, error, isPending } = useCreateProfile();
  const handleCreate = async ()=>{
    if(handel=='')return 
    if(handel.length<5||handel.length > 20)return messageApi.open({
      type: 'error',
      content: '长度最少为5且不超过20',
    });
    try{
      const result = await create({ handle:handel+'@mdx' })
      console.log(result)
      if(result?.error?.name=='DuplicatedHandleError')return messageApi.open({
        type: 'error',
        content: result?.error?.message,
      });
      if(result.value){
        // 创建成功
        window.location.reload() 
      }else{
        messageApi.open({
          type: 'error',
          content: result?.error?.message,
        });
      }
      
    }
    catch(e){
      console.log(e)
      messageApi.open({
        type: 'error',
        content: '创建失败',
      });
    }
    
  }
  return (
    <>
      {contextHolder}
      <Modal title={''} footer={null} open={createOpen} onOk={handleOk} onCancel={handleCancel} width={'450px'} centered closeIcon={<img src={off} />}>
        <div className='createprofile'>
          <div className='createprofile-text'>
             Create your Medoxie Handle
          </div>
          <div className='createprofile-des'>
          Your Medoxie Handle is your identifier on the platform. It works just like a username.
          </div>
          <div className='createprofile-title'>
            Username
            <Tooltip title={<>
              <div>Avoid a username with personal information such as name,<br /> ID number, age, date of birth or nicknames.</div>
              <div style={{marginTop:'10px'}}>Our handle names format should be in brelen@mdx as example.</div>
            </>} defaultOpen>
              <img src={iconsSvg} />
            </Tooltip>
            
          </div>
          <Input suffix="@mdx" ref={refInput} value={handel} onChange={(e)=>{
            setHandel(e.target.value);
          }}/>
          <Button  type="primary" onClick={()=>handleCreate()} loading={isPending}>Next</Button>
          <Button onClick={()=>setCreateOpen(false)} loading={isPending}>Cancel</Button>
        </div>
      </Modal>
    </>
  )
}
export default CreateProfile
