
import React,{useState,useImperativeHandle, useEffect} from 'react'
import store from '../../../../redux/store'
import './index.less'
import { useProfilesOwnedBy, useActiveProfileSwitch,useCreateProfile,useProfilesOwnedByMe } from '@lens-protocol/react-web';
import { Button, Modal ,Radio, Space,message,Input} from 'antd';
import { WhenLoggedInWithProfile } from '../../../../hooks/WhenLoggedInWithProfile.tsx'
let ToggleHandle = (props,ref) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [createOpen, setCreateOpen] = useState(false);
  const [handel,setHandel] = useState('')
  
  // const { data, error, loading } = useProfilesOwnedBy({ address:localStorage.getItem('address'), limit: 50 });
  // const { data:data } = useProfilesOwnedByMe();
  // console.log(data2)
  // console.log(data, error, loading)
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
  const { execute: create, error:error2, isPending:isPending2 } = useCreateProfile();
  const handleCreate = async ()=>{
    if(handel=='')return 
    if(handel.length<5||handel.length > 20)return messageApi.open({
      type: 'error',
      content: '长度最少为5且不超过20',
    });
    try{
      const result = await create({ handle:handel })
      console.log(result)
      if(result?.error?.name=='DuplicatedHandleError')return messageApi.open({
        type: 'error',
        content: result?.error?.message,
      });
      if(result.value == undefined){
        // 创建成功
        // setHandel('')
        messageApi.open({
          type: 'success',
          content: '创建成功',
        });
        // window.location.reload() 
      }else{
        messageApi.open({
          type: 'error',
          content: result.error.message,
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
      <Modal title={'Switch Profile'} footer={null} open={createOpen} onOk={handleOk} onCancel={handleCancel} width={'420px'} centered destroyOnClose={false}>
        <div className='toggle-handle'> 
          <div className='found'>
            <Input onChange={(e)=>setHandel(e.target.value)}/> <Button loading={isPending2} onClick={()=>handleCreate()}>Create</Button>
          </div>
          <WhenLoggedInWithProfile>{() => <ProfileList />}</WhenLoggedInWithProfile>
        </div>
      </Modal>
    </>
  )
}
function ProfileList(){
  const [list,setList] = useState([])
  const [value,setValue] = useState(store.getState().UserReducer.user?.id)
  const { data:data } = useProfilesOwnedByMe();
  var newArr = []
  var arrList = []
  if(data!=undefined){
    newArr = JSON.parse(JSON.stringify(data));
    let map = new Map();
    for (let item of newArr) {
        map.set(item.id, item);
     }
    arrList = [...map.values()];
  }
  useEffect(()=>{
    // setValue(store.getState().UserReducer.user?.id)
    
  },[newArr])
  // setList(arrList)
  const { execute: switchProfile, isPending } = useActiveProfileSwitch();
  const onChange = (e)=>{
    setValue(e.target.value)
  }
  // 切换
  const handleToggle = async()=>{
    const toggle = await switchProfile(value)
    setValue(value)
    console.log(toggle)
  }
  
  return (
    <>
      <Radio.Group onChange={onChange} value={value}>
        <Space direction="vertical">
          {arrList&&arrList.map(item=><Radio key={item.id} value={item.id}>{item.handle}</Radio>)}
          <Button loading={isPending} onClick={()=>handleToggle()}>Switch</Button>
        </Space>
      </Radio.Group>
    </>
  )
}
export default ToggleHandle
