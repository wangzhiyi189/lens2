import React,{useState,useEffect, Component} from 'react'
import { useSearchPublications,useRecentPosts } from '@lens-protocol/react-web';
import './index.less'
import { Spin,Tabs } from 'antd';
import SelfFeeds from '@/components/SelfFeeds'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll.ts';
import store from '@/redux/store'
import Card from '@/components/Card'
export default function Feeds() {
  const [info,setInfo] = useState()
  var recentPosts = useRecentPosts();
  for(var i=0;i<recentPosts.length;i++){
    recentPosts[i].metadata = {
      content:recentPosts[i]?.content||recentPosts[i]?.metadata?.content,
      media:recentPosts[i]?.media||recentPosts[i]?.metadata?.media,
      mainContentFocus:recentPosts[i]?.mainContentFocus || recentPosts[i]?.metadata?.mainContentFocus,
      locale:recentPosts[i]?.locale||recentPosts[i]?.metadata?.locale,
    }
  }
  const {
    data: publications,
    error,
    loading,
    hasMore,
    observeRef,
  } = useInfiniteScroll(
    useSearchPublications({
      query: 'medoxie',
    }),
  );
  useEffect(() => {
    setInfo(store.getState().UserReducer.user?.attributes?.medoxie)
    var unsubscribe = store.subscribe(()=>{
      setInfo(store.getState().UserReducer.user?.attributes?.medoxie)
    })
    return ()=>{
      unsubscribe()
    }
  }, [])
  return (
    <div className='feeds'>
      {info == 'HCP'&&<SelfFeeds />}
      {recentPosts.map((item,i)=><Card data={item} key={item.id+i} />)}
      {publications?publications.map((item,i)=><Card data={item} key={item.id+i} />):<div className="example"><Spin /></div>}
      {hasMore && <p ref={observeRef}>Loading more...</p>}
    </div>
  )
}
