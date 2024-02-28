import React,{useState,useEffect, Component,useRef} from 'react'
// import { MediaSet, NftImage, Publication } from '@lenster/lens';
import Card from '../../components/Card'
import './index.less'
import { Spin,Tabs,Affix } from 'antd';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll.ts';
import {useExplorePublications,useSearchPublications,useFeed,useRecentPosts } from '@lens-protocol/react-web';
import axios from 'axios'
import store from '../../redux/store'
import SelfFeeds from '../../components/SelfFeeds'
import {Prompt} from 'react-router-dom';
import generateRandomNumbers from '@/utils/random'
const items = [
  {
    key: 'Explore',
    label: 'Explore',
  },
  {
    key: 'Following',
    label: 'Following',
  },
];
export default function Home(){
  const [info,setInfo] = useState(store.getState().UserReducer.user?.attributes?.medoxie)
  const [active,setActive] = useState(localStorage.getItem('home-active')||'Explore')
  const homeRef = useRef()
  const [top,setTop] = useState(77)
  useEffect(() => {
    setActive(localStorage.getItem('home-active')||'Explore')
    homeRef.current.scrollTop = localStorage.getItem('scrollTop') || 0
    setInfo(store.getState().UserReducer.user?.attributes?.medoxie)
    var unsubscribe = store.subscribe(()=>{
      setInfo(store.getState().UserReducer.user?.attributes?.medoxie)
      var width = store.getState().UserReducer.width
      if(width>1024){
        setTop(77)
      }else if(width<=1024&&width>=768){
        setTop(67)
      }else if(width<768){
        setTop(58)
      }
    })
    return ()=>{
      unsubscribe()
    }
  }, [])
  const onChange = (e)=>{
    setActive(e)
  }
  // 离开前记录位置
  const handleleave = ()=>{
    const scrollTop = homeRef.current.scrollTop
    localStorage.setItem('scrollTop',scrollTop)
    localStorage.setItem('home-active',active)
  }
  return (
    <div className='home' ref={homeRef}>
      <Prompt
        when={true}
        message={() =>handleleave()}
      />
      {info == 'HCP'&&<SelfFeeds />}
      <Affix offsetTop={top}>
        {info!=undefined&&<Tabs activeKey={active} items={items} onChange={onChange} />}
      </Affix>
      {info!=undefined?active=='Explore'?<Explore />:<Following />:<Explore />}
    </div>
  )
}

// 探索
function Explore(){
  useEffect(()=>{

  },[])
  var recentPosts = useRecentPosts();
  for(var i=0;i<recentPosts.length;i++){
    recentPosts[i].metadata = {
      content:recentPosts[i]?.content||recentPosts[i]?.metadata?.content,
      media:recentPosts[i]?.media||recentPosts[i]?.metadata?.media,
      mainContentFocus:recentPosts[i]?.mainContentFocus || recentPosts[i]?.metadata?.mainContentFocus,
      locale:recentPosts[i]?.locale||recentPosts[i]?.metadata?.locale,
    }
  }
  // console.log(recentPosts)
  const {
    data: publications,
    error,
    loading,
    hasMore,
    observeRef,
  } = useInfiniteScroll(
    useSearchPublications({
      // query: 'lens',
      query: 'medoxie',
      // sortCriteria: PublicationSortCriteria.TopCommented,
      // publicationTypes: [PublicationTypes.Comment, PublicationTypes.Post],
    }),
  );
  console.log(publications)
  return (
    <>
      {recentPosts.map((item,i)=><Card data={item} key={item.id+i} />)}
      {publications?publications.map((item,i)=><Card data={item} key={item.id+i} />):<div className="example"><Spin /></div>}

      {hasMore && <p ref={observeRef}>Loading more...</p>}
    </>
  )
}

// 关注的发布
function Following(){
  const {
    data: publications,
    error,
    loading,
    hasMore,
    observeRef,
  } = useInfiniteScroll(useFeed({ profileId: store.getState().UserReducer.user?.id}));
  // console.log(publications)
  return (
    <>
      {publications?publications.map((item,i)=><Card data={item.root} key={item.root.id+i} />):<div className="example"><Spin /></div>}
      {hasMore && <p ref={observeRef}>Loading more...</p>}
    </>
  )
}
// export default class Home extends Component{
//   state = {
//     list :[],
//     limit:10,
//   }
//   componentDidMount(){
//     const { data, loading } = useExploreProfiles({
//       limit:this.limit,
//     });
//     console.log(data)
//   }
//   render() {
//     return (
//       <div className='home'>
//         {[1,2].map(item=><Card key={item} />)}
//       </div>
//     )
//   }
// }

