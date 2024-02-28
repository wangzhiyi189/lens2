import React,{useState} from 'react'
import './index.less';
import { Tabs } from 'antd';
import {useProfileFollowers,useProfileFollowing } from '@lens-protocol/react-web';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll.ts';
import FollowCard from '../../../components/FollowCard';
export default function FollowAll(props) {
  const items = [
    {
      key: 'followers',
      label: `Followers`,
      children: <Followers id={props.match.params.profileId} />,
    },
    {
      key: 'following',
      label: `Following`,
      children: <Following address={props.match.params.address}/>,
    },
  ];
  const [type,setType] = useState(props.match.params.type)
  // setType(props.match.params.type)
  const onChange = (e)=>{
    // props.history.replace(`/profile/${props.match.params.id}/followall/${e}/${props.match.params.address}/${props.match.params.profileId}`)
  }
  return (
    <div className='followall'>
      {/* <div className='followall-header'>
        <div className='followall-tab' onClick={()=>props.history.replace(`/profile/${props.match.params.id}/followall/followers/${props.match.params.address}/${props.match.params.profileId}`)}>Followers</div>
        <div className='followall-tab' onClick={()=>props.history.replace(`/profile/${props.match.params.id}/followall/following/${props.match.params.address}/${props.match.params.profileId}`)}>Following</div>
        <div style={{left:(props.match.params.type == 'following')?"50%":"0"}} className={'followall-header_bar'}></div>
      </div> */}
      <Tabs defaultActiveKey={props.match.params.type} items={items} onChange={onChange} />
      {/* {props.match.params.type == 'followers'?<Followers id={props.match.params.profileId} />:<Following address={props.match.params.address}/>}  */}
    </div>
  )
}

function Followers(props){
  console.log(props.id)
  const { data: followers, error,loading,hasMore,observeRef} = useInfiniteScroll(useProfileFollowers({
    profileId: props.id,
  }));
  console.log(followers)
  return (
    <>
    {followers&&followers.map(item=><FollowCard {...item.wallet.defaultProfile} key={item.wallet.id} />)}
    {hasMore && <p ref={observeRef}>Loading more...</p>}
    </>
  )
}

function Following(props){
  const { data: following, error,loading,hasMore,observeRef,} = useInfiniteScroll(useProfileFollowing({
    walletAddress: props.address,
  }));
  console.log(following)
  return (
    <>
    {following&&following.map(item=><FollowCard {...item.profile} key={item.profile.id} />)}
    {hasMore && <p ref={observeRef}>Loading more...</p>}
    </>
  )
}
