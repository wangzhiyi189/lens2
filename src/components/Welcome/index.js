import React,{useState,useImperativeHandle, useEffect,useRef, forwardRef,useForm} from 'react'
import { Button, Modal,message,Form, Input,Select,Tooltip} from 'antd';
import store from '@/redux/store'
import {upload} from '@/utils/upload.ts'
import { useUpdateProfileDetails } from '@lens-protocol/react-web';
import './index.less'
// 加密
import {encrypt,decrypt} from '../../utils/crypto.js'
import {WelcomeAction} from '../../redux/actionCreator/WidthAction'
// 设置个人信息
import ModifyData from '@/components/ModifyData'
import off from '@/assets/images/off.svg'
import profileUtils from '@/utils/profile.js'
import iconsSvg from '@/assets/images/Icons.svg'
import pullDown from '@/assets/images/pullDown.svg'
export default function Welcome (props) {
  const ModifyDatadiv = forwardRef(ModifyData)
  const modifdataRef = useRef()
  const [messageApi, contextHolder] = message.useMessage();
  const [createOpen, setCreateOpen] = useState(false);
  
  const [handel,setHandel] = useState('')
  const [mine,setMine] = useState(store.getState().UserReducer.user)
  const RegisterasPatientDiv = forwardRef(RegisterasPatient)
  const RegisterasPatientRef = useRef()

  const RegisterasHcpDiv = forwardRef(RegisterasHcp)
  const RegisterasHcpRef = useRef()

  const RegistrationDiv = forwardRef(Registration)
  const RegistrationRef = useRef()
  const { execute: update, error, isPending } = useUpdateProfileDetails({ profile:mine, upload });
  useEffect(()=>{
    var unsubscribe = store.subscribe(()=>{
      setMine(store.getState().UserReducer.user)
      if(store.getState().UserReducer.welcome&&store.getState().UserReducer.user?.attributes?.medoxie ==undefined){
        if(!createOpen&&store.getState().UserReducer.user!=''){
          setCreateOpen(store.getState().UserReducer.user);
        }
      }
    })
    return (()=>{
      unsubscribe()
    })
  },[])
  const handleOk = () => {
    setCreateOpen(false);
  };
  // 关闭弹框
  const handleCancel = () => {
    setCreateOpen(false);
    store.dispatch(WelcomeAction(false))
  };
  const handleCreate = async (e)=>{
    var address = localStorage.getItem('address')
    if(address.toLowerCase() != mine.ownedBy.toLowerCase())return messageApi.open({
      type: 'warning',
      content: '登录账号与钱包地址不一致',
    });
    if(e == 'HCP'){
      RegisterasHcpRef.current.showModal(true,e)
    }else{
      RegisterasPatientRef.current.showModal(true,e)
    }
  }
  // useImperativeHandle(ref,()=>({
  //   showModal:() => {
  //     console.log('打开')
  //     setCreateOpen(true);
  //   }
  // }))
  const handleRegistration = ()=>{
    setCreateOpen(false);
    // mine.attributes.medoxie = 'HCP'
    store.dispatch(WelcomeAction(false))
    setTimeout(()=>{
      RegistrationRef.current.showModal(true)
    },500)
    
  }
  const handleModify = ()=>{
    modifdataRef.current.showModal(false)
  }
  return (
    <>
      {contextHolder}
      {/* HCP注册资料 */}
      <RegisterasPatientDiv ref={RegisterasPatientRef} handleRegistration={handleRegistration}/>
      {/* 病人注册资料 */}
      <RegisterasHcpDiv ref={RegisterasHcpRef} handleRegistration={handleRegistration}/>
      {/* 填完注册资料是否编辑资料 */}
      <RegistrationDiv ref={RegistrationRef} handleModify={handleModify} />
      {/* 修改资料 */}
      <ModifyDatadiv ref={modifdataRef} />
      {/* 身份选择 */}
      <Modal title={null} footer={null} open={createOpen} onOk={handleOk} onCancel={handleCancel} width={'450px'} centered closeIcon={<img src={off} />}>
        <div className='welcome'>
          <div className="welcome-text">
            <div className="welcome-text_title">
              Welcome to Medoxie!
            </div>
            <div className="welcome-text_des">
              Select the type of profile you want to setup.All users will need to be verified before your account goes live on the platform.
            </div>
          </div>
          <Button onClick={()=>handleCreate('Patient')}>I’m a Patient</Button>
          <Button onClick={()=>handleCreate('HCP')}>I’m a HCP</Button>
          <Button>I’m an Industry Personnel</Button>
          <Button className="skip" onClick={()=>handleCancel()}>Skip</Button>
        </div>
      </Modal>
      
    </>
  )
}
// 表单验证
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
const options = [{value:'Private',label:'Private'},{value:'Public',label:'Public'}];
const options2 = [];
for (let i = 10; i < 36; i++) {
  options2.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}
// 病人的注册信息
let RegisterasPatient = (props,ref) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [patientOpen, setpatientOpen] = useState(false);
  const [form] = Form.useForm()
  const [medoxie,setMedoxie] = useState('')
  const [mine,setMine] = useState(store.getState().UserReducer.user)
  const { execute: update, error, isPending } = useUpdateProfileDetails({ profile:mine, upload });
  useImperativeHandle(ref,()=>({
    showModal:(e,a) => {
      setMedoxie(a)
      setpatientOpen(e);
    }
  }))
  const handleOk = ()=>{
    setpatientOpen(false);
  }
  const handleCancel = ()=>{
    setpatientOpen(false);
  }
  const onFormLayoutChange = ({ layout }) => {
    // setFormLayout(layout);
  };
  // 提交
  const onFinish = async (values) => {
    // setTimeout(()=>{
    //   props.handleRegistration()
    // },1000)
    
    //   return
    // 解密之后的密钥
    var private_key = store.getState().UserReducer.key
    // console.log(private_key)
    if(!private_key)return messageApi.open({
      type: 'warning',
      content: '请检查是否填写私钥',
    });
    var address = localStorage.getItem('address')
    if(address.toLowerCase() != mine.ownedBy.toLowerCase())return messageApi.open({
      type: 'warning',
      content: '登录账号与钱包地址不一致',
    });
    // mine.attributes.medoxie = medoxie;
    let newObj = await profileUtils(values,medoxie);
    newObj.attributes.medoxie = medoxie
    try{
      const data = await update({ ...newObj });
      if(data?.error?.name == 'FailedUploadError')return messageApi.open({
        type: 'warning',
        content: data?.error?.cause?.reason || data?.error?.cause?.message || '操作失败',
      });
      props.handleRegistration()
    }
    catch(e){
      console.log(String(e))
      if(String(e) == 'InvariantError: Invalid error type. Received object, expected instance of Error')return messageApi.open({
        type: 'warning',
        content: 'Insufficient Token Balance',
      });
    }
  };
  const handleChange = ()=>{
    
  }
  return (
    <>
      {contextHolder}
      <Modal title={null} footer={null} open={patientOpen} onOk={handleOk} onCancel={handleCancel} width={'450px'} centered closeIcon={<img src={off} />}>
        <div className='register'>
          <div className='register-title'>
            Register as Patient
          </div>
          <div className='register-des'>
            The following data will be encrypted, stored on the Blockchain,and kept under your self-sovereignty
          </div>
          <Form form={form} layout={'vertical'} validateMessages={validateMessages} onValuesChange={onFormLayoutChange} onFinish={onFinish}>
            <div className='modifydata-name form-flex'>
              {/* 性 */}
              <Form.Item name={['attributes', 'First']} label="First Name" rules={[
              {
                required: true,
              },
              ]}>
                <Input placeholder="First Name"/>
              </Form.Item>
              {/* 名 */}
              <Form.Item name={['attributes', 'middle']} label="Middle Name" rules={[
              {
                required: false,
              },
              ]}>
                <Input placeholder="Middle Name"/>
              </Form.Item>
            </div>
            {/* 名字 */}
            <Form.Item name={'name'} label="Last Name" rules={[
              {
                required: true,
              },
            ]}>
              <Input placeholder="Last Name" />
            </Form.Item>
            <div className='modifydata-name form-flex'>
              <Form.Item name={['attributes', 'date']} label="Date of Birth" rules={[
                {
                  required: true,
                },
              ]}>
                <Input placeholder="11/03/1990" />
              </Form.Item>
              <Form.Item name={['attributes', 'card']} label="ID Card No." rules={[
              {
                required: true,
              },
              ]}>
                <Input placeholder="Z39481948" />
              </Form.Item>
            </div>
            {/* 邮箱 */}
            <Form.Item name={['attributes', 'email']} label="Email Address" rules={[
              {
                required: true,
                type: 'email',
              },
            ]}>
              <Input />
            </Form.Item>
            {/* tag */}
            {/* <Form.Item name={['attributes', 'tag']} label="Which kind of HCP do you looking for in Medoxie?">
              <Select
               mode="tags"
               style={{ width: '100%' }}
               onChange={handleChange}
               tokenSeparators={[',']}
               options={options} />
            </Form.Item>
             <Form.Item name={['attributes', 'topic']} label="What kind of topics do you interested in?">
              <Select
               mode="tags"
               style={{ width: '100%' }}
               onChange={handleChange}
               tokenSeparators={[',']}
               options={options2} />
            </Form.Item> */}
            <Form.Item >
              <Button type="primary" loading={isPending} htmlType="submit">Next</Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  )
}

let RegisterasHcp = (props,ref) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [patientOpen, setpatientOpen] = useState(false);
  const [form] = Form.useForm()
  const [medoxie,setMedoxie] = useState('')
  const [mine,setMine] = useState(store.getState().UserReducer.user)
  const { execute: update, error, isPending } = useUpdateProfileDetails({ profile:mine, upload });
  useImperativeHandle(ref,()=>({
    showModal:(e,a) => {
      setMedoxie(a)
      setpatientOpen(e);
    }
  }))
  const handleOk = ()=>{
    setpatientOpen(false);
  }
  const handleCancel = ()=>{
    setpatientOpen(false);
  }
  const onFormLayoutChange = ({ layout }) => {
    // setFormLayout(layout);
  };
  // 提交
  const onFinish = async (values) => {
    // 解密之后的密钥
    var private_key = store.getState().UserReducer.key
    // console.log(private_key)
    if(!private_key)return messageApi.open({
      type: 'warning',
      content: '请检查是否填写私钥',
    });
    var address = localStorage.getItem('address')
    if(address.toLowerCase() != mine.ownedBy.toLowerCase())return messageApi.open({
      type: 'warning',
      content: '登录账号与钱包地址不一致',
    });
    // mine.attributes.medoxie = medoxie;
    let newObj = await profileUtils(values,medoxie);
    newObj.attributes.medoxie = medoxie
    try{
      const data = await update({ ...newObj });
      if(data?.error?.name == 'FailedUploadError')return messageApi.open({
        type: 'warning',
        content: data?.error?.cause?.reason || data?.error?.cause?.message || '操作失败',
      });
      props.handleRegistration()
    }
    catch(e){
      console.log(String(e))
      if(String(e) == 'InvariantError: Invalid error type. Received object, expected instance of Error')return messageApi.open({
        type: 'warning',
        content: 'Insufficient Token Balance',
      });
    }
  };
  const handleChange = ()=>{
    
  }
  return (
    <>
      {contextHolder}
      <Modal title={null} footer={null} open={patientOpen} onOk={handleOk} onCancel={handleCancel} width={'450px'} centered closeIcon={<img src={off} />}>
        <div className='register'>
          <div className='register-title'>
            Register as Hcp
          </div>
          <div className='register-des'>
            Your name and specialty will be publicly available on the platform so other users can find you.
          </div>
          <Form form={form} layout={'vertical'} validateMessages={validateMessages} onValuesChange={onFormLayoutChange} onFinish={onFinish}>
            <div className='modifydata-name form-flex'>
              {/* 性 */}
              <Form.Item name={['attributes', 'First']} label="First Name" rules={[
              {
                required: true,
              },
              ]}>
                <Input placeholder="First Name"/>
              </Form.Item>
              {/* 名 */}
              <Form.Item name={['attributes', 'middle']} label="Middle Name" rules={[
              {
                required: false,
              },
              ]}>
                <Input placeholder="Middle Name"/>
              </Form.Item>
            </div>
            {/* 名字 */}
            <Form.Item name={'name'} label="Last Name" rules={[
              {
                required: true,
              },
            ]}>
              <Input placeholder="Last Name" />
            </Form.Item>
            <div className='modifydata-name form-flex'>
              <Form.Item name={['attributes', 'date']} label="Date of Birth" rules={[
                {
                  required: true,
                },
              ]}>
                <Input placeholder="11/03/1990" />
              </Form.Item>
              <Form.Item name={['attributes', 'card']} label="ID Card No." rules={[
              {
                required: true,
              },
              ]}>
                <Input placeholder="Z39481948" />
              </Form.Item>
            </div>
            {/* 医生注册号 */}
            <Form.Item name={['attributes', 'Medical']} label="Medical Registration No." rules={[
              {
                required: true,
              },
            ]}>
              <Input />
            </Form.Item>
            {/* 邮箱 */}
            <Form.Item name={['attributes', 'email']} label={"Email Address"} rules={[
              {
                required: true,
                type: 'email',
              },
            ]}>
              <Help />
              <Input />
            </Form.Item>
            {/* tag */}
            <Form.Item name={['attributes', 'type']} label="Healthcare Services Type">
              <Select
               mode="multiple"
               style={{ width: '100%' }}
               onChange={handleChange}
               tokenSeparators={[',']}
               options={options} 
               suffixIcon={<img src={pullDown} />}
              />
            </Form.Item>
             {/* tag */}
             {/* <Form.Item name={['attributes', 'specialty']} label="Specialty">
              <Select
               mode="tags"
               style={{ width: '100%' }}
               onChange={handleChange}
               tokenSeparators={[',']}
               options={options2} />
            </Form.Item> */}
            <Form.Item >
              <Button type="primary" loading={isPending} htmlType="submit">Next</Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  )
}

let Help = ()=>{
  return (
    <>
      <Tooltip title={<>
        Your name and specialty will be publicly available on the platform so other users can find you.
      </>} defaultOpen>
        <img className="welcome-help" src={iconsSvg} />
      </Tooltip>
    </>
  )
}

let Registration = (props,ref)=>{
  const [show, setShow] = useState(false);
  useImperativeHandle(ref,()=>({
    showModal:(e) => {
      setShow(e);
    }
  }))
  const handleOk = ()=>{
    setShow(false);
  }
  const handleCancel = ()=>{
    setShow(false);
  }
  const handleEdit = ()=>{
    setShow(false)
    return 
    props.handleModify()
  }
  const handleSkip = ()=>{
    setShow(false);
  }
  return (
    <>
      <Modal title={null} footer={null} open={show} onOk={handleOk} onCancel={handleCancel} width={'450px'} centered closeIcon={<img src={off} />}>
        <div className='registration'>
          <div className='registration-title'>
            Your Profile is Ready!
          </div>
          <div className='registration-des'>
            Medoxie does not store any user details on its platform. You should therefore backup your private key.
          </div>
          <Button type="primary" onClick={()=>handleEdit()}>
            Verify My Profile
          </Button>
          <Button onClick={()=>handleSkip()}>Skip</Button>
        </div>
      </Modal>
    </>
    
  )
}
// Welcome
