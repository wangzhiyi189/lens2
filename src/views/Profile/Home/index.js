import React ,{useMemo,useState,useForm}from 'react'
import './index.less'
import { Tabs,Modal,Collapse,Form,Input,Select,Button } from 'antd';

import more from '../../../assets/images/home/more.svg'
import off from '../../../assets/images/off.svg'
import Feeds from './Component/Feeds'
import Clinical from './Component/Clinical'
import addSvg from '@/assets/images/profile/add.svg'
import pullDown from '@/assets/images/pullDown.svg'
export default function Home() {
  const items = [
    {
      key: 'Feeds',
      label: `Feeds`,
      children: <Feeds />,
    },
    {
      key: 'Clinical',
      label: `Clinical`,
      children: <Clinical />,
    },
    {
      key: 'Academia',
      label: `Academia`,
      children: '',
    },
    {
      key: 'Teaching',
      label: `Teaching`,
      children: '',
    },
  ];
  
  const slot = useMemo(() => {
    return (
      <PushModal /> 
    )
  });
  const onChange = (e)=>{
    console.log(e)
  }
  return (
    <div className="profile-home">
      <Tabs defaultActiveKey={'Feeds'} items={items} onChange={onChange} tabBarExtraContent={slot} />
      {/* <SelfFeeds /> */}
    </div>
  )
}

function PushModal(){
  const items = [
    {
      key: '1',
      label: 'Clinical',
      children: (
        <div className="push-item">
          <div onClick={()=>hendleItem()}>Medical Council Registration</div>
          <div>Specialist Interest</div>
          <div>Employment History</div>
          <div>Spoken Languages</div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Academia',
      children: (
        <div className="push-item">
          <div>Medical Council Registration</div>
          <div>Specialist Interest</div>
          <div>Employment History</div>
          <div>Spoken Languages</div>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Teaching',
      children: (
        <div className="push-item">
          <div>Medical Council Registration</div>
          <div>Specialist Interest</div>
          <div>Employment History</div>
          <div>Spoken Languages</div>
        </div>
      ),
    },
  ];
  const [isModalOpen,setisModalOpen] = useState(false);
  const [medicalShow,setMedicalShow] = useState(false)
  const hendleItem = ()=>{
    setMedicalShow(true)
  }

  const handleCancel = ()=>{
    setisModalOpen(false)
  }
  const handleOk = ()=>{
    setisModalOpen(false)
  }
  const handleMedical = ()=>{
    setMedicalShow(false)
  }
  const onChange = ()=>{

  }
  return (
    <>
      <img className="profile-home_push" src={addSvg} onClick={()=>setisModalOpen(true)} />
      <Modal title="Add Profile Section" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} closeIcon={<img src={off} />} width='310px' centered >
        <div className="push-main">
          {/* expandIcon自定义切换图标 */}
          <Collapse
            defaultActiveKey={['1']}
            onChange={onChange}
            expandIconPosition='end'
            items={items} accordion 
            expandIcon={()=><img src={pullDown} />}
          />
        </div>
      </Modal>
      <AddMedical medicalShow={medicalShow} handleMedical={handleMedical}/>
    </>
  )
}

function AddMedical({medicalShow,handleMedical}){
  const [form] = Form.useForm()
  const validateMessages = {
    required: '${label} is required!',
  };
  const monthList = [];
  const yearList = [];
  for(let i = 1;i<=12;i++){
    yearList.push({
      value: i,
      label: i,
    });
  }
  for (let i = 1; i < 40; i++) {
    monthList.push({
      value: 2010+i,
      label: 2010+i,
    });
  }
  const [formLayout, setFormLayout] = useState('horizontal');
  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };
  // 验证通过提交
  const onFinish = (values)=>{
    console.log(values)
    
  }
  const afterClose = ()=>{
    form.resetFields();
  }
  return (
    <Modal title="Add Medical Council Registration" open={medicalShow} onOk={()=>handleMedical()} onCancel={()=>handleMedical()} footer={null} closeIcon={<img src={off} />} width='450px' centered afterClose={()=>afterClose()} >
      <div className="addmedical">
        <Form form={form} layout={'vertical'} validateMessages={validateMessages} onValuesChange={onFormLayoutChange} onFinish={onFinish}>
          <Form.Item name='license' label="License" rules={[
          {
            required: true,
          },
          ]}>
            <Input placeholder="Ex. General Medical Council UK"/>
          </Form.Item>
          <Form.Item name='issuing' label="Issuing Organization" rules={[
          {
            required: false,
          },
          ]}>
            <Input placeholder='name@example.com'/>
          </Form.Item>
          <div className='label'>
            <span>Issue Date</span>
          </div>
          <div className='form-flex'>
            <Form.Item name='month' rules={[
            {
              required: false,
            },
            ]} >
              <Select
               placeholder="Month"
               style={{ width: '100%' }}
              //  onChange={handleChange}
               options={monthList} 
               suffixIcon={<img src={pullDown} />}/>
            </Form.Item>
            <Form.Item name='year' rules={[
            {
              required: false,
            },
            ]}>
              <Select
              placeholder="Year"
               style={{ width: '100%' }}
              //  onChange={handleChange}
               options={yearList} 
               suffixIcon={<img src={pullDown} />}/>
            </Form.Item>
          </div>
          <div className='label'>
            <span>Expiry Date</span>
          </div>
          <div className='form-flex'>
            <Form.Item name='Expirymonth' rules={[
            {
              required: false,
            },
            ]} >
              <Select
                placeholder="Month"
               style={{ width: '100%' }}
              //  onChange={handleChange}
               options={monthList} 
               suffixIcon={<img src={pullDown} />}/>
            </Form.Item>
            <Form.Item name='Expiryyear' rules={[
            {
              required: false,
            },
            ]}>
              <Select
              placeholder="Year"
               style={{ width: '100%' }}
              //  onChange={handleChange}
               options={yearList} 
               suffixIcon={<img src={pullDown} />}/>
            </Form.Item>
          </div>
          <Form.Item name='id' label="Credential ID" rules={[
          {
            required: false,
          },
          ]}>
            <Input placeholder="Credential ID"/>
          </Form.Item>
          <Form.Item name='url' label="Credential URL" rules={[
          {
            required: false,
          },
          ]}>
            <Input placeholder="Credential URL"/>
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">Save</Button>
          </Form.Item>
        </Form>
      </div>
        
    </Modal>
  )
}
