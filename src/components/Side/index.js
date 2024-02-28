import React,{useState,useEffect,useRef} from 'react'
import './index.less';
import store from '../../redux/store'
import Medoxie from './components/Medoxie'
import Recommended from './components/Recommended';
import Login from '../Login'
import User from '../User'
import { message,Affix } from 'antd';
export default function Side() {
  const [messageApi, contextHolder] = message.useMessage();
  const [show,setShow] = useState(true)
  const [info,setInfo] = useState('')
  const [top,setTop] = useState(120)
  const sideRef = useRef()
  useEffect(()=>{
    handleTop()
  },[])
  const handleTop = ()=>{
    var minHeight = sideRef.current.clientHeight
    var maxHeight = document.documentElement.clientHeight
    if(maxHeight<minHeight){
      setTop((maxHeight - minHeight))
    }else{
      setTop(120)
    }
  }
  return (
    <Affix offsetTop={top}>
      <div className="side" ref={sideRef}>
        {/* {show?<Login />:<User info={{...info,...data}}/>} */}
        {/* <Affix offsetTop={120} onChange={(affixed) => console.log(affixed)}> */}
          <Medoxie handleTop={handleTop} />
          <Recommended  handleTop={handleTop}/>
        {/* </Affix> */}
      </div>
    </Affix>
  )
}
