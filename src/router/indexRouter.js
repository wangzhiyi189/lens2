import React, { Component } from 'react'
// hash路由 HashRouter BrowserRouter
import { HashRouter as Router,Route,Redirect,Switch } from 'react-router-dom'
import Home from '../views/Home'
import Profile from '../views/Profile'
import Network from '../views/Network'
import Schedule from '../views/Schedule'
import Vault from '../views/Vault'
import store from '../redux/store'
// import {CacheRoute,CacheSwitch} from 'react-router-cache-route'
export default class indexRouter extends Component {
  
  render() {
    return (
      <Router>
        {/* 顶部 */}
        {this.props.children[0]}
        <div className="main">
          {/* 侧边导航 */}
          {this.props.children[1]}
          {/* 内容 */}
          <div className='content'>
            {/* {this.props.children[1]} */}
            <Switch>
              <Route path="/home" component={Home}/>
              <Route path="/profile/:id" component={Profile}/>
              <Route path="/network" component={Network}/>
              <Route path="/schedule" component={Schedule}/>
              <Route path="/vault" component={Vault}/>
              <Redirect from="/" to="/home" exact />
            </Switch>
          </div>
          {/* 右侧内容 */}
          {this.props.children[3]}
        </div>
      </Router>
    )
  }
}
