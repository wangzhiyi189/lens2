import React,{useState} from 'react'
import './index.less'
import { Tag,Modal,Button,Form,Select } from 'antd'
import more from '@/assets/images/home/more.svg'
import off from '@/assets/images/off.svg'
import addSvg from '@/assets/images/profile/add2.svg'
import changeSvg from '@/assets/images/profile/change.svg'
import shareSvg from '@/assets/images/profile/share.svg'
import pullDown from '@/assets/images/pullDown.svg'
import EnglishSvg from '@/assets/images/Language/english.svg'
import CantoneseSvg from '@/assets/images/Language/cantonese.svg'
import MandarinSvg from '@/assets/images/Language/mandarin.svg'
export default function Clinical() {
  const [list,setList] = useState(['English','Cantonese','Mandarin'])
  const tagClose = (e,item)=>{
    console.log(e)
    e.preventDefault()
    console.log(item)
  }
  return (
    <div className='clinical'>
      <div className='clinical-header'>
        <div className='clinical-header_title'>
          <div className="text">Spoken Languages</div>
          <div className='btn'>
            <AddSpoken />
            <EditSpoken />
          </div>
        </div>
        <div className='clinical-header_main'>
          {list.map(item=><Tag key={item} onClose={(e)=>tagClose(e,item)} closable>
            {item == 'English'&&<img src={EnglishSvg} />}
            {item == 'Cantonese'&&<img src={CantoneseSvg} />}
            {item == 'Mandarin'&&<img src={MandarinSvg} />}
            {item}
          </Tag>)}
        </div>
      </div>
      <div className='clinical-main'>
        <div className='clinical-main_title' >
          <span>Medical Registrations</span>
          {/* <div className='btn'>
            <img src={addSvg} />
            <img src={changeSvg} />
          </div> */}
        </div>
        <div className='clinical-main_item'>
          <div className='item'>
            <div className='item-info'>
              <div className='avatar'>
              </div>
              <div className='info'>
                <div className='info-title'>
                  License Title
                </div>
                <div className='info-name'>
                  Organization Name
                </div>
                <div className='info-time'>
                  Issued on Jun 2023
                </div>
                <div className='info-id'>
                  Credential ID 41343432
                </div>
              </div>
            </div>
            <div className='item-btn'>
              <Button>
                Credential
                <img src={shareSvg} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='clinical-main'>
        <div className='clinical-main_title' >
          <span>Diseases and Procedures of Specialist Interest</span>
        </div>
        <div className='clinical-main_des' >
          <span>Diseases</span>
        </div>
        <div className='clinical-main_tag'>
          <div className="clinical-main_tag_left">
            {['Infection','Rue','Pneumonia'].map(item=><Tag key={item} onClose={(e)=>tagClose(e,item)} closable>
             {item}
            </Tag>)}
          </div>
          <div>
            <Button>
              View All
              <img src={shareSvg} />
            </Button>
          </div>
        </div>
        
      </div>
      <div className='clinical-main'>
        <div className='clinical-main_title' >
          <span>Employment History</span>
        </div>
        <div className='clinical-main_item'>
          <div className='item'>
            <div className='item-info'>
              <div className='avatar'>
              </div>
              <div className='info'>
                <div className='info-title'>
                  CUHK
                </div>
                <div className='info-name'>
                  Doctor
                </div>
                <div className='info-time'>
                  Jan 2018 - Present
                </div>
                <div className='info-id'>
                  5 Years 9 Months
                </div>
              </div>
            </div>
          </div>
          <div className='item'>
            <div className='item-info'>
              <div className='avatar'>
              </div>
              <div className='info'>
                <div className='info-title'>
                  Eastern Hosiptial
                </div>
                <div className='info-name'>
                  Doctor
                </div>
                <div className='info-time'>
                  Mar 2009 - Dec 2017
                </div>
                <div className='info-id'>
                  7 Years 9 Months
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='clinical-main'>
        <div className='clinical-main_title' >
          <span>Professional Qualifications</span>
        </div>
        <div className='clinical-main_item'>
          <div className='item'>
            <div className='item-info'>
              <div className='avatar'>
              </div>
              <div className='info'>
                <div className='info-title'>
                  Masters of Doctor
                </div>
                <div className='info-name'>
                  LPU University
                </div>
                <div className='info-time'>
                  Issued on Jun 2023
                </div>
                <div className='info-id'>
                  Credential ID 41343432
                </div>
              </div>
            </div>
            <div className='item-btn'>
              <Button>
                Credential
                <img src={shareSvg} />
              </Button>
            </div>
          </div>
          <div className='item'>
            <div className='item-info'>
              <div className='avatar'>
              </div>
              <div className='info'>
                <div className='info-title'>
                  Universite Paris VII Denis Diderot
                </div>
                <div className='info-name'>
                  CES dentisterie pediatrique el preventive
                </div>
                <div className='info-time'>
                  Issued on Jun 2011
                </div>
                <div className='info-id'>
                  Credential ID 41343432
                </div>
              </div>
            </div>
            <div className='item-btn'>
              <Button>
                Credential
                <img src={shareSvg} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='clinical-main'>
        <div className='clinical-main_title' >
          <span>Clinical Management</span>
        </div>
        <div className='clinical-main_item'>
          <div className='item'>
            <div className='item-info'>
              <div className='avatar'>
              </div>
              <div className='info'>
                <div className='info-title'>
                  Maryland Private Surgical Practive
                </div>
                <div className='info-name'>
                  Board Member
                </div>
                <div className='info-time'>
                  Oct 2022 - Present
                </div>
                <div className='info-id'>
                  1 Year
                </div>
              </div>
            </div>
            <div className='item-btn'>
              <Button>
                Credential
                <img src={shareSvg} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='clinical-bottom'> 
        <div>Articles & Popular Media</div>
        <div>Times of India 2018</div>
      </div>
    </div>
  )
}

// 添加
function AddSpoken(){
  const [form] = Form.useForm()
  const validateMessages = {
    required: '${label} is required!',
  };
  const [isModalOpen,setisModalOpen] = useState(false);
  const [nativeList,setNativeList] = useState([{value:'1',label:'1'},{value:'2',label:'2'}])
  const [secondaryList,setSecondaryList] = useState([{value:'1',label:'1'},{value:'2',label:'2'}])
  const [othersList ,setOthersList] = useState([{value:'1',label:'1'},{value:'2',label:'2'}])
  const handleOpen = ()=>{
    setisModalOpen(true)
  }
  const handleOk = ()=>{
    setisModalOpen(false)
  }
  const handleCancel = ()=>{
    setisModalOpen(false)
  }
  // 验证通过提交
  const onFinish = (values)=>{
    console.log(values)
    
  }
  const afterClose = ()=>{
    form.resetFields();
  }
  return (
    <>
      <img src={addSvg} onClick={()=>handleOpen()} />
      <Modal title="Add Spoken Language" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} closeIcon={<img src={off} />} width='450px' centered >
      <Form form={form} layout={'vertical'} validateMessages={validateMessages} onFinish={onFinish}>
          <Form.Item name='native'  label="Native Language" rules={[
          {
            required: false,
          },
          ]} >
            <Select placeholder="Please select" options={nativeList} suffixIcon={<img src={pullDown} />} />
          </Form.Item>
          <Form.Item name='secondary'  label="Second Language" rules={[
          {
            required: false,
          },
          ]}>
            <Select
            placeholder="Please select"
             style={{ width: '100%' }}
            //  onChange={handleChange}
             options={secondaryList} 
             suffixIcon={<img src={pullDown} />}
             />
          </Form.Item>
          <Form.Item name='others'  label="Language Spoken with Interpreter" rules={[
          {
            required: false,
          },
          ]}>
            <Select
             placeholder="Please select"
             style={{ width: '100%' }}
            //  onChange={handleChange}
             options={othersList} 
             suffixIcon={<img src={pullDown} />} 
             />
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">Save</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
// 修改
function EditSpoken(){
  const [form] = Form.useForm()
  const validateMessages = {
    required: '${label} is required!',
  };
  const [isModalOpen,setisModalOpen] = useState(false);
  const [nativeList,setNativeList] = useState([{value:'1',label:'1'},{value:'2',label:'2'}])
  const [secondaryList,setSecondaryList] = useState([{value:'1',label:'1'},{value:'2',label:'2'}])
  const [othersList ,setOthersList] = useState([{value:'1',label:'1'},{value:'2',label:'2'}])
  const handleOpen = ()=>{
    setisModalOpen(true)
  }
  const handleOk = ()=>{
    setisModalOpen(false)
  }
  const handleCancel = ()=>{
    setisModalOpen(false)
  }
  // 验证通过提交
  const onFinish = (values)=>{
    console.log(values)
    
  }
  const afterClose = ()=>{
    form.resetFields();
  }
  return (
    <>
      <img src={changeSvg} onClick={()=>handleOpen()} />
      <Modal title="Edit Spoken Language" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} closeIcon={<img src={off} />} width='450px' centered >
      <Form form={form} layout={'vertical'} validateMessages={validateMessages} onFinish={onFinish}>
          <Form.Item name='native'  label="Native Language" rules={[
          {
            required: false,
          },
          ]} >
            <Select placeholder="Please select" options={nativeList} suffixIcon={<img src={pullDown} />} />
          </Form.Item>
          <Form.Item name='secondary'  label="Secondary Language" rules={[
          {
            required: false,
          },
          ]}>
            <Select
             placeholder="Please select"
             style={{ width: '100%' }}
            //  onChange={handleChange}
             options={secondaryList} 
             suffixIcon={<img src={pullDown} />} 
             />
          </Form.Item>
          <Form.Item name='others'  label="Others (Multi-Select)" rules={[
          {
            required: false,
          },
          ]}>
            <Select
             placeholder="Please select"
             style={{ width: '100%' }}
            //  onChange={handleChange}
             options={othersList} 
             suffixIcon={<img src={pullDown} />} 
            />
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">Save</Button>
          </Form.Item>
          <Form.Item >
            <Button type="default">Remove</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}