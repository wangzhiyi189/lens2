import React, { useEffect, useState } from 'react'
import {useHistory} from 'react-router-dom'
import './index.less'
import store from '../../redux/store'
import {LoginAction} from '../../redux/actionCreator/loginAction'
import { UserOutlined } from '@ant-design/icons';
import { ContentFocus, CollectPolicyType, useCollect, useCreateComment,PublicationId,useBookmarkToggle,ImageType  } from '@lens-protocol/react-web'
import { upload,uploadImage } from '../../utils/upload.ts'
import {shiftTime} from '../../utils/shifttime'
import more from '../../assets/images/home/more.svg'
import comments from '../../assets/images/home/comments.svg'
import repost from '../../assets/images/home/repost.svg'
import likes from '../../assets/images/home/likes.svg'
import statistics from '../../assets/images/home/statistics.svg'
import repost1 from '../../assets/images/home/repost2.svg'
import image from '../../assets/images/home/image.svg'
import gif from '../../assets/images/home/gif.svg'
import emote from '../../assets/images/home/emote.svg'
import send from '../../assets/images/home/send.svg'
import {Avatar,Image,Input,message } from 'antd'
import axios from 'axios'
import { useFileSelect } from '../../hooks/useFileSelect.ts';
// 解密
import {decrypt} from '../../utils/crypto.js'
import badgeSvg from '@/assets/images/profile/badge.svg'
const { TextArea } = Input;
export default function Card({data,props}) {
  const [messageApi, contextHolder] = message.useMessage();
  const history = useHistory()
  const [reviewShow,setReviewShow] = useState(false)
  const [des,setDes] = useState('')
  const [user,setUser] = useState(store.getState().UserReducer.user);
  useEffect(()=>{
    if(data?.metadata?.description!=null&&data?.metadata!=''){
      if(data.metadata.description.slice(0,8) == 'https://'){
        axios({
          url:`https://oembed.lenster.xyz/?url=${data.metadata.description}`
        }).then(res=>{
          setDes(res.data.oembed)
        })
      }
    }
    return()=>{

    }
  },[])
  // 个人资料
  const handlePush = (e)=>{
    history.push(
      `/profile/${e}`
    )
  }
  const gasless = useCollect({
    collector: store.getState().UserReducer.user,
    publication: data
  });
  const handleLikes = async ()=>{
    if(store.getState().UserReducer.user.length == 0)return store.dispatch(LoginAction(true))
    try{
      const gaslessResult = await gasless.execute()
      if(gaslessResult.error.name == "BroadcastingError"){
        messageApi.open({
          type: 'warning',
          content: gaslessResult.error.message,
        });
      }
    }catch(e){
      console.log(e)
      messageApi.open({
        type: 'error',
        content: 'This function is currently not supported',
      });
    }
  }
  const headleStatistics = () => {
    // messageApi.open({
    //   type: 'error',
    //   content: 'This is an error message',
    // });
  };
  // 打开评论
  const handleComments = () =>{
    if(store.getState().UserReducer.user?.attributes?.medoxie == 'HCP'){
      setReviewShow(!reviewShow)
    }else{
      if(store.getState().UserReducer.user.length == 0){
        store.dispatch(LoginAction(true))
      }else{
        console.log('没有权限')
      }
    } 
              
  }
  return (
    <div>
      {contextHolder}
      <div className='card-box'>
        <div className='card-avatar'>
          {/* data.picture?.original.url */}
          <Avatar src={data.profile.picture?.original.url} size={{ xs: 48, sm: 48,md: 36, lg: 36,xl:48,xxl:48}} icon={<UserOutlined />} />
        </div>
        <div className="card-info">
          <div className='card-info_header' onClick={()=>handlePush(data.profile.handle)}>
            <div className="info">
              <span className="name">
                {data.profile?.attributes?.First?.attribute?.value}&nbsp;
                {data.profile?.attributes?.middle?.attribute?.value}&nbsp;
                {data.profile.name||data.profile?.handle?.split('.')[0]}
              </span>
              {data?.profile.attributes?.medoxie?.attribute?.value == 'HCP'&&<div className='badge'>
                  <img src={badgeSvg}></img>
                </div>}
              <span className='time'><span>@{data.profile.handle} · </span>{data?.createdAt?shiftTime(data.createdAt):'刚刚' }</span>
            </div>
            <div className='more'>
              <img src={more}/>
            </div>
          </div>
          <div className="card-info_text" dangerouslySetInnerHTML={{__html: data?.metadata?data?.metadata?.content:data?.mirrorOf.metadata.content}}></div>
          {/* <div className="card-info_text">
            {data.metadata?.content}
          </div> */}
          <div>
            {data?.metadata?.mainContentFocus=='IMAGE'?<Description list={data?.metadata.media} />:''}
          </div>
          <div className='card-info_feature'>
            <div className='comments' onClick={()=>handleComments()}>
              <img src={comments} />
              <span>{data.profile.stats.commentsCount}</span>
              {/* <span>{data.stats.totalComments}</span> */}
            </div>
            <div className='repost'>
              <img src={repost} />
            </div>
            
            <div className='likes' onClick={()=>handleLikes()}>
              {!data.hasCollectedByMe?<img src={likes} />:'已收藏'}
              <span>{data.profile.stats.totalCollects}</span>
              {/* <span>{data.stats.totalCollects}</span> */}
            </div>
            <div className='statistics' onClick={headleStatistics}>
              <img src={statistics} />
              {/* <span>3</span> */}
            </div>
            <div className='repost1'>
              <img src={repost1} />
            </div>
          </div>
        </div>
      </div>
      {reviewShow&&<Review {...data} />}
      {/* <Review style={{height:'auto'}} /> */}
    </div>
  )
}

// 评论
function Review(props){
  // 自己的资料
  const [publisher] = useState(store.getState().UserReducer.user)
  const [value,setValue] = useState('')
  const {execute: comment, error, isPending } = useCreateComment({ publisher,upload});
  // 上传图片
  const openFileSelectorImg = useFileSelect({
    onSelect: async(fileList) => { 
      const media = []
      for(var i=0;i<fileList.length;i++){
        media.push({
          url :await uploadImage(fileList.item(0)),
          mimeType:fileList[i].type
        })
      }
      if(media.length>=0){
        const from = {
          publicationId: props.id, // 要评论的出版物id
          media:media,
          contentFocus: ContentFocus.IMAGE,
          locale: 'en',
        }
        handelPost(from)
      }
    },
    accept: [ImageType.JPEG, ImageType.PNG, ImageType.WEBP],
    multiple: false,
  });
  const openFileSelectorGif = useFileSelect({
    onSelect: async (fileList) => {
      const media = []
      for(var i=0;i<fileList.length;i++){
        media.push({
          url :await uploadImage(fileList.item(0)),
          mimeType:fileList[i].type
        })
      }
      if(media.length>=0){
        const from = {
          publicationId: props.id, // 要评论的出版物id
          media:media,
          contentFocus: ContentFocus.IMAGE,
          locale: 'en',
        }
        handelPost(from)
      }   
    },
    accept: [ImageType.GIF],
    multiple: false,
  });
  // 发送图片
  const headleImage = async ()=>{
    openFileSelectorImg();
  }
  // 动图消息
  const headleGif = ()=>{
    openFileSelectorGif();
  }
  // 文本消息
  const handleText = (async ()=>{
    if(isPending)return 
    const from = {
      publicationId: props.id, // 要评论的出版物id
      content:value, // 评论内容
      contentFocus: ContentFocus.TEXT_ONLY,
      locale: 'en',
      collect: {
        type: CollectPolicyType.NO_COLLECT,
      }
    }
    handelPost(from)
    
  })
  // 发送消息
  const handelPost = async(from)=>{
    // ARTICLE: "Article"
    // AUDIO: "Audio"
    // EMBED: "Embed"
    // IMAGE: "Image"
    // LINK: "Link"
    // TEXT: "TextOnly"
    // TEXT_ONLY: "TextOnly"
    // VIDEO: "Video"
    // return 
    try{
      let result = await comment(from);
    }
    catch(err){
      console.log(err)
    }
  }
  
  return (
    <div className="review">
      <div className='review-box'>
        <div className="review-avatar">
          <Avatar size={{md: 36, lg: 36,xl:48,xxl:48}} src={publisher?.picture?.original.url} icon={<UserOutlined />} />
        </div>
        <div className="review-input">
          <TextArea value={value} placeholder="Write a comment" autoSize={{
          minRows: 1}} onChange={(e)=>{
            setValue(e.target.value)
          }}/>
          <div className="feature">
            <div className="feature-btn">
              <img src={image} onClick={()=>headleImage()} />
              <img src={gif} onClick={()=>headleGif()}/>
              <img src={emote} />
            </div>
            <div className='feature-send' onClick={()=>handleText()}>
              <img src={send} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Description({props,list}){
  return (
    <>
      {list&&list.map(item=><Image style={{height:'283px'}} key={item?.original?.url||item?.url} src={item?.original?.url||item?.url}/>)}
    </>
  )
}
