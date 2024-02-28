
import React, { forwardRef,useImperativeHandle, useState,useEffect,useForm } from 'react';
import { ImageType, Profile, useUpdateProfileImage,useUpdateProfileDetails } from '@lens-protocol/react-web';
import { Button, Modal,Avatar, Form, Input,Select,message,Spin } from 'antd';
import store from '../../redux/store'
import { useFilePreview } from '../../hooks/useFilePreview.ts';
import { invariant } from '../../utils/utils.ts';
import {upload,uploadImage} from '../../utils/upload.ts'
import { ILocalFile, useFileSelect } from '../../hooks/useFileSelect.ts';
import { UserOutlined } from '@ant-design/icons';
import './index.less';
import settings from '../../assets/images/user/settings.svg'
import off from '../../assets/images/off.svg'
import {WelcomeAction} from '@/redux/actionCreator/WidthAction'
// 加密
import {encrypt,decrypt} from '../../utils/crypto.js'
import EditImageSvg from '../../assets/images/modify/EditImage.svg'
import factbookSvg from '../../assets/images/modify/facebook.svg'
import instagramSvg  from '../../assets/images/modify/instagram.svg'
import twitterSvg  from '../../assets/images/modify/twitter.svg'
import youtubeSvg  from '../../assets/images/modify/youtube.svg'
import linkedInSvg  from '../../assets/images/modify/linkedIn.svg'
import profileUtils from '@/utils/profile.js'
import pullDown from '@/assets/images/pullDown.svg'
const options = [{value:'Private',label:'Private'},{value:'Public',label:'Public'}];
const options2 = [];
for (let i = 10; i < 36; i++) {
  options2.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}
let ModifyData = (props,ref)=> {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mine,setMine] = useState(store.getState().UserReducer.user)
  const [type,setType] = useState(1)
  const [data,setdata] = useState()
  const [specialise,setSpecialise] = useState([])
  const [interested,setInterested] = useState([])
  const [subspecialty,setSubspecialty] = useState([])
  const { execute: update, error, isPending } = useUpdateProfileDetails({ profile:mine, upload });
  const [formLayout, setFormLayout] = useState('horizontal');
  const [medoxie,setMedoxie] = useState('')
  const [coverPicture,setCoverPicture] = useState('')
  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };
  const [form] = Form.useForm()
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
  useEffect(()=>{
    var unsubscribe = store.subscribe(()=>{
      setMine(store.getState().UserReducer.user)
      // form.setFieldsValue(store.getState().UserReducer.user)
    })
    
     // 销毁前取消订阅
    return ()=>{
      unsubscribe()
    }

  },[mine])
  const selectfun = (e)=>{
    setMedoxie(e||mine?.attributes?.medoxie?.attribute?.value||mine?.attributes?.medoxie)
    console.log(e||mine?.attributes?.medoxie?.attribute?.value||mine?.attributes?.medoxie)
    try{
      setSpecialise(mine?.attributes?.specialise&&JSON.parse(mine?.attributes?.specialise)||[])
      setInterested(mine?.attributes?.interested&&JSON.parse(mine?.attributes?.interested)||[])
      setSubspecialty(mine?.attributes?.Subspecialty&&JSON.parse(mine?.attributes?.Subspecialty)||[])
    }
    catch{
      
    }
  }
  useImperativeHandle(ref,()=>({
    showModal:(e) => {
      setIsModalOpen(true);
      selectfun(e)
    }
  }))
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handelSubmit = (e)=>{
    console.log(form)
  }
  // 多选
  const handleChange = (()=>{

  })
  const afterClose = ()=>{
    setType(1)
  }
  // 更改banner图
  const handleBanner = ()=>{
    openFileBanner()
  }
  const openFileBanner = useFileSelect({
    onSelect: async (fileList) => {
      setCoverPicture(await uploadImage(fileList.item(0)))
      // setTimeout(()=>{
      //   handleUpdateProfileImage()
      // },1000) 
    },
    accept: [ImageType.JPEG, ImageType.PNG, ImageType.WEBP],
    multiple: false,
  });
  const onFinishFailed = ()=>{
    setType(1)
  }
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
    let newObj = await profileUtils(values,medoxie);
    newObj.coverPicture = coverPicture
    // newObj.attributes.medoxie = medoxie
    try{
      // newObj.attributes.medoxie = ''
      const data = await update({ ...newObj });
      console.log(data)
      // console.log(data)
      if(data?.error?.name == 'FailedUploadError')return messageApi.open({
        type: 'warning',
        content: data?.error?.cause?.reason || data?.error?.cause?.message || '操作失败',
      });
      store.dispatch(WelcomeAction(false))
    }
    catch(e){
      console.log(String(e))
      if(String(e) == 'InvariantError: Invalid error type. Received object, expected instance of Error')return messageApi.open({
        type: 'warning',
        content: 'Insufficient Token Balance',
      });
    }
  };
  return (
    <>
      {contextHolder}
      <Modal title={null} footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} afterClose={afterClose} closeIcon={<img src={off} />}>
        <div className='modifydata'>
          <UploadAvatar profile={mine} />
          {/* 医生的个人资料 */}
          {medoxie != 'Patient'?<Form form={form} layout={'vertical'} validateMessages={validateMessages} onValuesChange={onFormLayoutChange} onFinish={onFinish} onFinishFailed={onFinishFailed}>
            {/* <button onClick={()=>handleBanner()}>更换banner图</button> */}
            <div style={{display:type == 1?'block':'none'}}>
              <div className='modifydata-name form-flex'>
                {/* 性 */}
                <Form.Item name={['attributes', 'First']} label="First Name" rules={[
                {
                  required: true,
                },
                ]} initialValue={mine?.attributes?.First}>
                  <Input placeholder="First Name"/>
                </Form.Item>
                {/* 名 */}
                <Form.Item name={['attributes', 'middle']} label="Middle Name" rules={[
                {
                  required: false,
                },
                ]} initialValue={mine?.attributes?.middle}>
                  <Input placeholder="Middle Name"/>
                </Form.Item>
              </div>
              {/* 名字 */}
              <Form.Item name={'name'} label="Last Name" rules={[
                {
                  required: true,
                },
              ]} initialValue={mine?.name}>
                <Input placeholder="Last Name" />
              </Form.Item>
              {/* 邮箱 */}
              <Form.Item name={['attributes', 'email']} label="Email Address" rules={[
                {
                  required: true,
                  type: 'email',
                },
              ]} initialValue={mine?.attributes?.email}>
                <Input placeholder="name@example.com" />
              </Form.Item>
              {/* 簡介 */}
              <Form.Item
                name="bio"
                label="Biography (within 50 words)" 
                initialValue={mine?.bio}
              >
                <Input.TextArea style={{ height: 60, resize: 'none' }} placeholder='Please enter' maxLength={50}/>
              </Form.Item>
              {/* Specialty */}
              <Form.Item name={['attributes', 'specialise']} label="Specialty" initialValue={specialise}>
                <Select
                 mode="multiple"
                 style={{ width: '100%' }}
                 onChange={handleChange}
                 tokenSeparators={[',']}
                 options={options} 
                 defaultValue={specialise}
                 suffixIcon={<img src={pullDown} />} 
                 />
              </Form.Item>
              {/* Subspecialty */}
              <Form.Item name={['attributes', 'Subspecialty']} label="Subspecialty" initialValue={subspecialty}>
                <Select
                 mode="tags"
                 style={{ width: '100%' }}
                 onChange={handleChange}
                 tokenSeparators={[',']}
                 options={options2}
                 defaultValue={subspecialty}
                 suffixIcon={<img src={pullDown} />} 
                />
              </Form.Item>
              <Form.Item >
                <Button type="primary" loading={isPending} onClick={()=>setType(2)}>Next</Button>
              </Form.Item>
            </div>
            <div style={{display:type == 2?'block':'none'}}>
              {/* Interested Topics */}
              <Form.Item name={['attributes', 'interested']} label="Interested Topics" initialValue={interested}>
                <Select
                 mode="tags"
                 style={{ width: '100%' }}
                 onChange={handleChange}
                 tokenSeparators={[',']}
                 options={options2} 
                 defaultValue={interested}
                 suffixIcon={<img src={pullDown} />} 
                />
              </Form.Item>
              {/* factbook */}
              <div className='label'>
                <img src={factbookSvg} />
                <span>Facebook</span>
              </div>
              <Form.Item name={['attributes', 'factbook']} initialValue={mine?.attributes?.factbook}>
                <Input placeholder="https://facebook.com/" />
              </Form.Item>
              <div className='label'>
                <img src={instagramSvg} />
                <span>Instagram</span>
              </div>
              <Form.Item name={['attributes', 'instagram']} initialValue={mine?.attributes?.instagram}>
                <Input placeholder="@username" />
              </Form.Item>
              <div className='label'>
                <img src={twitterSvg} />
                <span>Twitter</span>
              </div>
              <Form.Item name={['attributes', 'twitter']} initialValue={mine?.attributes?.twitter}>
                <Input placeholder="@twitter" />
              </Form.Item>
              <div className='label'>
                <img src={youtubeSvg} />
                <span>YouTube</span>
              </div>
              <Form.Item name={['attributes', 'youtube']} initialValue={mine?.attributes?.youtube}>
                <Input placeholder="https://youtube.com/" />
              </Form.Item>
              <div className='label'>
                <img src={linkedInSvg} />
                <span>LinkedIn</span>
              </div>
              <Form.Item name={['attributes', 'linkedIn']} initialValue={mine?.attributes?.linkedIn}>
                <Input placeholder="https://linkedin.com/" />
              </Form.Item>
              <Form.Item >
                <Button type="primary" loading={isPending} htmlType="submit">Done</Button>
              </Form.Item>
            </div>
          </Form>
          // 病人的修改资料
          :<Form form={form} layout={'vertical'} validateMessages={validateMessages} onValuesChange={onFormLayoutChange} onFinish={onFinish}>
            <div style={{display:type == 1?'block':'none'}}>
              <div className='modifydata-name form-flex'>
                {/* 性 */}
                <Form.Item name={['attributes', 'First']} label="First Name" rules={[
                {
                  required: false,
                },
                ]} initialValue={mine?.attributes?.First}>
                  <Input placeholder="First Name"/>
                </Form.Item>
                {/* 名 */}
                <Form.Item name={['attributes', 'middle']} label="Middle Name" rules={[
                {
                  required: false,
                },
                ]} initialValue={mine?.attributes?.middle}>
                  <Input placeholder="Middle Name"/>
                </Form.Item>
              </div>
              {/* 名字 */}
              <Form.Item name={'name'} label="Last Name" rules={[
                {
                  required: false,
                },
              ]} initialValue={mine?.name}>
                <Input placeholder="Last Name" />
              </Form.Item>
              {/* 邮箱 */}
              <Form.Item name={['attributes', 'email']} label="Email Address" rules={[
                {
                  required: false,
                  type: 'email',
                },
              ]} initialValue={mine?.attributes?.email}>
                <Input placeholder="name@example.com" />
              </Form.Item>
              {/* 簡介 */}
              <Form.Item
                name="bio"
                label="Biography" 
                initialValue={mine?.bio}
              >
                <Input.TextArea style={{ height: 60, resize: 'none' }} placeholder='Please enter'/>
              </Form.Item>
              {/* Subspecialty */}
              <Form.Item name={['attributes', 'interested']} label="Interested Topics" initialValue={interested}>
                <Select
                 mode="tags"
                 style={{ width: '100%' }}
                 onChange={handleChange}
                 tokenSeparators={[',']}
                 options={options2} 
                 defaultValue={interested}
                 suffixIcon={<img src={pullDown} />} 
                />
              </Form.Item>

              <Form.Item >
                <Button type="primary" loading={isPending} htmlType="submit">Done</Button>
              </Form.Item>
            </div>

          </Form>}
        </div>
      </Modal>
    </>
  );
}
export default ModifyData 

function UploadAvatar({profile}){
  console.log(profile)
  const { execute: update, error, isPending} = useUpdateProfileImage({profile});
  const [candidateFile, setCandidateFile] = useState();
  const [uploadError, setUploadError] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    if(candidateFile!=null||candidateFile!=undefined){
      handleUpdateProfileImage()
    }
    return (()=>{
      
    })
  },[candidateFile])
  const openFileSelector = useFileSelect({
    onSelect: (fileList) => {
      setCandidateFile(fileList.item(0));
      // setTimeout(()=>{
      //   handleUpdateProfileImage()
      // },1000) 
    },
    accept: [ImageType.JPEG, ImageType.PNG, ImageType.WEBP],
    multiple: false,
  });
  const previewUrl = useFilePreview(candidateFile);
  const uploadImageCandidate = async () => {
    invariant(candidateFile, 'Image to upload is not defined');
    setUploadError(null);
    setIsUploading(true);
    try {
      const url = await uploadImage(candidateFile);
      return url;
    } catch (e) {
      if (e instanceof Error) {
        setUploadError(e);
      }
    } finally {
      // setIsUploading(false);
    }
  };
  // 更新头像
  const handleUpdateProfileImage = async () => {
    const url = await uploadImageCandidate();
    invariant(url, 'Image URL not provided');
    try{
      await update(url);
      setIsUploading(false);
    }
    catch(err){
      console.log(err)
      setIsUploading(false);
    }
    if (!isPending) {
      // setCandidateFile(null);
    }
  };
  const handleUploadCandidateFileClick = () => {
    openFileSelector();
  };
  return (
    <div className='modifydata-avatar'>
      <Spin spinning={isUploading} delay={500}>
        <div className="avatar" onClick={handleUploadCandidateFileClick}>
        <Avatar size={74} icon={<UserOutlined />} src={profile?.picture?.original.url} />
        <div className='avatar-set'>
          <img src={EditImageSvg} />
        </div>
        </div>
      </Spin>
      <div className='info'>
        <div className='name'>
          {profile?.attributes?.First} &nbsp;
          {profile?.name}
        </div>
        <div className='des'>@medoxie</div>
      </div>
      
    </div>
  )
}
