import React ,{ useState,useEffect } from 'react'
import './index.less';
import {
  ContentFocus,
  ProfileOwnedByMe,
  supportsSelfFundedFallback,
  useCreatePost,
  useSelfFundedFallback,
} from '@lens-protocol/react-web';
import store from '../../redux/store'
import {upload,uploadImage} from '../../utils/upload.ts'
import {Avatar,Button,Input} from 'antd'
import { UserOutlined } from '@ant-design/icons';
import vector from '../../assets/images/selffeeds/vector.svg'
import image from '../../assets/images/home/image.svg'
import gif from '../../assets/images/home/gif.svg'
import emote from '../../assets/images/home/emote.svg'
import send from '../../assets/images/home/send.svg'
import data from '../../assets/images/selffeeds/data.svg'
import calendar from '../../assets/images/selffeeds/calendar.svg'
import { useFileSelect } from '../../hooks/useFileSelect.ts';
import { ImageType,useActiveProfile } from '@lens-protocol/react-web';
import Web3 from 'web3'
import {ethers} from 'ethersweb'
export default function SelfFeeds() {
  const [imageFile, setImageFile] = useState();
  const [gifFile, setGifFile] = useState();
  const [accept,setAccept] = useState()
  const [content,setContent] = useState()
  const {data:publisher, error} = useActiveProfile()
  const { execute: post, error: postError, isPending: isPosting} = useCreatePost({ publisher, upload });
  // 上传图片
  const openFileSelectorImg = useFileSelect({
    onSelect: async(fileList) => { 
      const media = []
      console.log(fileList,'-----34图片信息')
      for(var i=0;i<fileList.length;i++){
        media.push({
          url :await uploadImage(fileList.item(0)),
          mimeType:fileList[i].type
        })
      }
      console.log(media)
      if(media.length>=0){
        const from = {
          content:content || '',
          media:media,
          contentFocus: ContentFocus.IMAGE,
          locale: 'en',
        }
        handelPost(from)
      }
    },
    accept: [ImageType.JPEG, ImageType.PNG, ImageType.WEBP,ImageType.GIF],
    multiple: true,
  });
  // --废弃
  // const openFileSelectorGif = useFileSelect({
  //   onSelect: async (fileList) => {
  //     console.log(fileList,'-----56图片信息')
  //     const media = []
  //     for(var i=0;i<fileList.length;i++){
  //       media.push({
  //         url :await uploadImage(fileList.item(0)),
  //         mimeType:fileList[i].type
  //       })
  //     }
  //     if(media.length>=0){
  //       const from = {
  //         content:content,
  //         media:media,
  //         contentFocus: ContentFocus.IMAGE,
  //         locale: 'en',
  //       }
  //       console.log(from)
  //       // handelPost(from)
  //     }   
  //   },
  //   accept: [ImageType.GIF],
  //   multiple: true,
  // });
  // 发送图片
  const handleImage = async ()=>{
    openFileSelectorImg();
  }
  // 发送动图 -- 废弃
  // const handleGif = ()=>{
  //   openFileSelectorGif();
  // }
  // 发送文本消息
  const handleText =()=>{
    const from = {
      content:content,
      contentFocus: ContentFocus.TEXT_ONLY,
      locale: 'en',
    }
    handelPost(from)
  }
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
    // var address = store.getState().UserReducer.user.ownedBy
    // console.log(store.getState().UserReducer.user)
    // const web3 = new Web3(window.ethereum);
    // const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    // provider.getCode(address).then(res=>{
    //   console.log(res)
    // })
    // return 
    from.tags = ['medoxie']
    // console.log(from)
    try{
      const subsidizedAttempt = await post(from);
      console.log(subsidizedAttempt)
    }
    catch(e){
      console.log(e)
    }
    
  }
  return (
    <div className='selffeeds'>
      <div className='selffeeds-avatar'>
        <Avatar src={publisher?.picture?.original?.url} size={{xs: 48, sm: 48,md: 36, lg: 36,xl:48,xxl:48}} icon={<UserOutlined />} />
      </div>
      <div className='selffeeds-info'>
        <div className='name'>
          <Input value={content} onChange={(e)=>setContent(e.target.value)} bordered={false} placeholder="What's up today?"  />
        </div>
        <div className='des'>
          <img src={vector} />
          <span>Everyone can reply</span>
        </div>
        <div className='more'>
          <div className='more-left'>
            <img src={image} onClick={()=>handleImage()} />
            {/* <img src={gif} onClick={()=>handleGif()} /> */}
            <img src={data} className="forbidden" />
            <img src={emote} className="forbidden"/>
            <img src={calendar} className="forbidden"/>
          </div>
          <div className='more-right'>
            <Button type="primary" shape="round" disabled={!content} loading={isPosting} onClick={()=>handleText()}>Post</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
