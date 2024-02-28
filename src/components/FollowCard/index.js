import React from 'react'
import './index.less'
import {Avatar,Dropdown,Button } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import message from '../../assets/images/profile/message.svg'
import more from '../../assets/images/home/more.svg'

export default function FollowCard(props) {
  return (
    <div className='followcard'>
      <div className="card-info">
        <Avatar src={props?.picture?.original.url} size={{md: 49, lg: 49,xl:72,xxl:72}} icon={<UserOutlined />} />
        <div className="card-info_name" >
          <div className='name'>{props?.name||props?.handle?.split('.')[0]}</div>
          <div className='des'>@{props?.handle}</div>
        </div>
      </div>
      <div className="card-btn">
        <Button>
          <img src={message} />
          Message
        </Button>
        <Dropdown
        placement="bottom"
        dropdownRender={(menu) => (
          <div className="dropdown card-btn_more">
            <div>
              <img src={more} />
              <span>Patient Referral</span>
            </div>
            <div>
              <img src={more} />
              <span>Remove Connection</span>
            </div>
          </div>
        )}
      >
        <img src={more} />
      </Dropdown>
      </div>
    </div>
  )
}
