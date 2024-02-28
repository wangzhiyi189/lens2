// 1.引入redux
// 2. createStore(reducer)
import {createStore,combineReducers,applyMiddleware,compose } from 'redux'
import UserReducer from './reducers/UserReducer'

import reduxThunk from 'redux-thunk'
import reduxPromise from 'redux-promise'
const reducer = combineReducers({
  UserReducer
})
const composeEnhancers = compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(reduxThunk,reduxPromise)))

export default store


