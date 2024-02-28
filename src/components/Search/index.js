import React,{useState} from 'react'
import {useHistory,withRouter} from 'react-router-dom'
import { Input,Select  } from 'antd';
import { useSearchPublications,useSearchProfiles } from "@lens-protocol/react-web"
import search from '../../assets/images/search.svg'
import './index.less';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll.ts';
import {decrypt} from '../../utils/crypto.js'
export default function Search(props) {
  const history = useHistory()
  const [value,setValue] = useState('')
  const [show,setShow] = useState(false)
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  // const { data, loading } = useSearchPublications({ query: value})
  const { data, error, loading, hasMore, observeRef } = useInfiniteScroll(useSearchProfiles({ query:value }));
  const handleChange = (e)=>{
    setValue(e.target.value)
  }

  // 跳转详情
  const handlePush = (e)=>{
    history.push(
      `/profile/${e.handle}`
    )
  }
  return (
    <div className='search'>
      {/* onBlur={()=>setShow(false)}  */}
      <Input prefix={<img src={search} />} placeholder="Search Medoxie" onChange={(e)=>handleChange(e)} onFocus={()=>setShow(true)}  onBlur={()=>setTimeout(()=>{setShow(false)},500)} />
      {!loading&&show&&<div className='search-content'>
        {data&&data.map(item=><div className='item' key={item.id} onClick={()=>handlePush(item)}>{item?.name||item?.handle?.split('.')[0]}</div>)}
        {hasMore && <p ref={observeRef}>Loading more...</p>}
        {data.length<=0&&<div className='empty'>No Data</div>}
      </div>}
    </div>
  )
}
