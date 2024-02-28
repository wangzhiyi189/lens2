import React, { Component } from 'react'
import Mrouter from './router/indexRouter'
import Header from './components/Header'
import Menu from './components/Menu'
import Side from './components/Side'
import Search from './components/Search'
import './index.less';
import store from './redux/store'
import {WidthAction} from './redux/actionCreator/WidthAction'
import Tabbar from './components/Tabbar'
export default class App extends Component {
  state = {
    isShow:store.getState().UserReducer.sideshow,
    width:store.getState().UserReducer.width
  }
  componentDidMount(){
    const resizeUpdate = (e) => {
      // 通过事件对象获取浏览器窗口的高度
      store.dispatch(WidthAction(e.target.innerWidth))
      this.setState({
        width:e.target.innerWidth
      })
    };
    window.addEventListener('resize', resizeUpdate);
    store.subscribe(()=>{
      if(this.state.isShow != store.getState().UserReducer.sideshow){
        this.setState({
          isShow:store.getState().UserReducer.sideshow
        })
      }
    })
    // 监听小狐狸切换账号
    if(window.ethereum){
      window.ethereum.on('accountsChanged', function (accounts) {
        localStorage.setItem('address',accounts[0])
      })
    }
    
    // ethereum.on('accountsChanged', function (accounts) {
    //   console.log(accounts)
    // })
  }
  // store.subsribe 订阅
  render() {
    return (
      <div>
        <Mrouter>
          <Header></Header>
          {this.state.width>767?<Menu />:<Tabbar/>}
          {this.state.width>767&&<Search />}
          {this.state.isShow&&this.state.width>767&&<Side></Side>}
        </Mrouter>
      </div>
    )
  }
}


