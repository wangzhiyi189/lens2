import React, { useEffect,useState } from 'react'
import {Button,Avatar,message} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useExploreProfiles,useFollow,useUnfollow } from '@lens-protocol/react-web';
// import { useProfile } from '@lens-protocol/react-web';
import store from '../../../../redux/store'
import {LoginAction} from '../../../../redux/actionCreator/loginAction'
import './index.less';
import followsvg from '../../../../assets/images/profile/follow.svg'
import unfollowsvg from '../../../../assets/images/profile/unfollow.svg'
export default function Recommended(props) {
  const { data, error, loading } = useExploreProfiles({ limit: 10 });
  useEffect(()=>{
    if(data) props.handleTop()
  },[data])
  // 使用探索配置文件
  return (
    <div className='recommended'>
      <div className='title'>
        Recommended Profiles
      </div>
      {data&&data.slice(0,3).map(item=><Card key={item.id} {...item} />)}
      <div className='text'>
        Show More
      </div>
    </div>
  )
}

function Card(props){
  const handleFollow = ()=>{
    console.log(props)
  }
  return (
    <div className='card'>
      <div className='card-info'>
        <div className='card-logo'>
          <Avatar src={props.picture?.original.url} size={{md: 36, lg: 36,xl:48,xxl:48}} icon={<UserOutlined />} />
        </div>
        <div className='card-text'>
          <div className="name">{props.name||props.handle.split('.')[0]}</div>
          <div className="des">{props.handle}</div>
        </div>
      </div>
      <div className='card-button'>
        {!props?.isFollowedByMe?<Follow profile={props} wallet={store.getState().UserReducer.user}/>:<Unfollow profile={props} wallet={store.getState().UserReducer.user}/>}
        {/* <Button onClick={()=>handleFollow()}>Follow</Button> */}
      </div>
    </div>
  )
}

// 关注
function Follow({wallet,profile}){
  const [messageApi, contextHolder] = message.useMessage();
  const gasless = useFollow({
    followee: profile,
    follower: wallet,
  });
  const handleFollow = async ()=>{
    if(store.getState().UserReducer.user.length <0)return store.dispatch(LoginAction(true))
    try{
      const gaslessResult = await gasless.execute()
      console.log(gaslessResult)
    }catch(e){
      if(String(e) == "InvariantError: You're already following this profile. Check the `followee.followStatus.canFollow` to determine if you can call `useFollow`.") return messageApi.open({
        type: 'warning',
        content: '正在关注',
      });
      console.log(String(e))
    }
  }
  // console.log(error)
  return (
    <>
      {contextHolder}
      <Button  loading={gasless.isPending} onClick={()=>handleFollow()}>
        Follow
      </Button>
    </>
  )
}
// 取消关注
function Unfollow({profile,wallet}){
  const gasless = useUnfollow({
    followee: profile,
    follower: wallet,
  });
  const handleUnfollow = async ()=>{
    try{
      const gaslessResult = await gasless.execute()
      console.log(gaslessResult)
    }catch(e){
      console.log(String(e))
    }
  }
  return (
    //  icon={<img src={unfollowsvg} />}
    <Button onClick={()=>handleUnfollow()} loading={gasless.isPending}>
      UnFollow
    </Button>
  )
}
