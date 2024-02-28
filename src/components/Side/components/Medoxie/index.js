import React,{useEffect,useState} from 'react'
import './index.less'
import axios from 'axios'
import { Image } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
export default function Medoxie(props) {
  const [list,setList] = useState([
    // {
    //   author: "Amanda Musa",
    //   content: "The dangerous effects of high blood pressure are highlighted in a new report by the World Health Organization that identifies the condition as one of the worlds leading risk factorsfor death and disa… [+3508 chars]",
    //   description: "The dangerous effects of high blood pressure are highlighted in a new report by the World Health Organization that identifies the condition as one of the world’s leading risk factors for death and disability.",
    //   publishedAt: "2023-09-19T07:01:00Z",
    //   source: {id: "cnn", name: "CNN"},
    //   title: "Proper treatment for hypertension could avert 76 million deaths globally by 2050, WHO says - CNN",
    //   url: "https://www.cnn.com/2023/09/19/health/high-blood-pressure-who-report/index.html",
    //   urlToImage: "https://media.cnn.com/api/v1/images/stellar/prod/210824203413-blood-pressure-cuff-stock.jpg?q=x_0,y_103,h_1406,w_2500,c_crop/w_800"
    // },
    // {
    //   author: "Amanda Musa",
    //   content: "The dangerous effects of high blood pressure are highlighted in a new report by the World Health Organization that identifies the condition as one of the worlds leading risk factorsfor death and disa… [+3508 chars]",
    //   description: "The dangerous effects of high blood pressure are highlighted in a new report by the World Health Organization that identifies the condition as one of the world’s leading risk factors for death and disability.",
    //   publishedAt: "2023-09-19T07:01:00Z",
    //   source: {id: "cnn", name: "CNN"},
    //   title: "Proper treatment for hypertension could avert 76 million deaths globally by 2050, WHO says - CNN",
    //   url: "https://www.cnn.com/2023/09/19/health/high-blood-pressure-who-report/index.html",
    //   urlToImage: "https://media.cnn.com/api/v1/images/stellar/prod/210824203413-blood-pressure-cuff-stock.jpg?q=x_0,y_103,h_1406,w_2500,c_crop/w_800"
    // },
    // {
    //   author: "Amanda Musa",
    //   content: "The dangerous effects of high blood pressure are highlighted in a new report by the World Health Organization that identifies the condition as one of the worlds leading risk factorsfor death and disa… [+3508 chars]",
    //   description: "The dangerous effects of high blood pressure are highlighted in a new report by the World Health Organization that identifies the condition as one of the world’s leading risk factors for death and disability.",
    //   publishedAt: "2023-09-19T07:01:00Z",
    //   source: {id: "cnn", name: "CNN"},
    //   title: "Proper treatment for hypertension could avert 76 million deaths globally by 2050, WHO says - CNN",
    //   url: "https://www.cnn.com/2023/09/19/health/high-blood-pressure-who-report/index.html",
    //   urlToImage: "https://media.cnn.com/api/v1/images/stellar/prod/210824203413-blood-pressure-cuff-stock.jpg?q=x_0,y_103,h_1406,w_2500,c_crop/w_800"
    // },
    // {
    //   author: "Amanda Musa",
    //   content: "The dangerous effects of high blood pressure are highlighted in a new report by the World Health Organization that identifies the condition as one of the worlds leading risk factorsfor death and disa… [+3508 chars]",
    //   description: "The dangerous effects of high blood pressure are highlighted in a new report by the World Health Organization that identifies the condition as one of the world’s leading risk factors for death and disability.",
    //   publishedAt: "2023-09-19T07:01:00Z",
    //   source: {id: "cnn", name: "CNN"},
    //   title: "Proper treatment for hypertension could avert 76 million deaths globally by 2050, WHO says - CNN",
    //   url: "https://www.cnn.com/2023/09/19/health/high-blood-pressure-who-report/index.html",
    //   urlToImage: "https://media.cnn.com/api/v1/images/stellar/prod/210824203413-blood-pressure-cuff-stock.jpg?q=x_0,y_103,h_1406,w_2500,c_crop/w_800"
    // },
    // {
    //   author: "Amanda Musa",
    //   content: "The dangerous effects of high blood pressure are highlighted in a new report by the World Health Organization that identifies the condition as one of the worlds leading risk factorsfor death and disa… [+3508 chars]",
    //   description: "The dangerous effects of high blood pressure are highlighted in a new report by the World Health Organization that identifies the condition as one of the world’s leading risk factors for death and disability.",
    //   publishedAt: "2023-09-19T07:01:00Z",
    //   source: {id: "cnn", name: "CNN"},
    //   title: "Proper treatment for hypertension could avert 76 million deaths globally by 2050, WHO says - CNN",
    //   url: "https://www.cnn.com/2023/09/19/health/high-blood-pressure-who-report/index.html",
    //   urlToImage: "https://media.cnn.com/api/v1/images/stellar/prod/210824203413-blood-pressure-cuff-stock.jpg?q=x_0,y_103,h_1406,w_2500,c_crop/w_800"
    // },
  ])
  var key = '5f9b79ddb8d447699a37ce7945d67f21'
  var lists = [];
  useEffect(()=>{
    axios({
      url:`https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=${key}`,
    }).then(res=>{
      props.handleTop()
      console.log(res.data.articles)
      setList(res.data.articles)
    })
  },[])
  
  return (
    <div className="medoxie">
      <div className='title'>
        Medoxie News
      </div>
      {list.slice(0,5).map(item=><Card {...item} key={item.author} />)}
      <div className='text'>Show More</div>
    </div>
  )
}

function Card(props){
  const headleDatail = (e)=>{
    window.open(e);
  }
  const myFuncton = (date_time)=>{
    //去掉日期数据中的T 和Z
    //by XiaoMa
    // var date=new Date(+new Date(date_time)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
    // return date
    var date = new Date(date_time)
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
    var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
    var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes());
    var s = ':' +date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
    return Y+M+D+h+m;
  }
  return (
    <div className='card'>
      <div className="card-info" onClick={()=>headleDatail(props.url)}>
        <div className='card-des'>
          {props.title}
        </div>
        <div className='card-text'>
          {props.content}
        </div>
        <div className='card-des'>
          {/* 16.9K Likes */}
          {myFuncton(props.publishedAt)}
        </div>
      </div>
      <div className='card-img'>
        <Image width={{md: 51, lg: 51,xl:68,xxl:68}}
          src={props.urlToImage}
          fallback={<CloseCircleOutlined />}
        />
      </div>
    </div>
  )
}
