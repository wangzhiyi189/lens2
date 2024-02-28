import React from 'react'
import './index.less'
import {Input,Dropdown} from 'antd'
import search from '../../assets/images/search.svg'
import FollowCard from '../../components/FollowCard'
export default function Vault() {
  const items = [
    {
      key: '1',
      label: (
        <span>
          Recent Follows
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          First Name
        </span>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          Last Name
        </span>
      ),
    },
  ];
  return (
    <div className='network'>
      <div className='network-header'>
        <div className='connections'>
          1,000 Connections
        </div>
        <div className='recently'>
          <span className="sort">
            Sort By 
          </span>
          <Dropdown
             menu={{
               items,
             }}
          >
            <div class="dropdown-text">
              Recently Follow
            </div>
          </Dropdown>
         
        </div>
      </div>
      <div className='network-main'>
        <div className='network-main_search'>
          <Input size="large" placeholder="Search by Name" bordered={false}  prefix={<img src={search} />} />
        </div>
        {[1,2,3].map(item=><FollowCard key={item} />)}
      </div>  
    </div>
  )
}