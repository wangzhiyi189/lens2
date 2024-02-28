// 处理要上传的个人信息

// 加密
import {encrypt,decrypt} from '@/utils/crypto.js'
import store from '@/redux/store'
/**
 * 
 * @param {要处理的数据} values 
 * @param {判断是医生还是病人} medoxie 
 */
export default function profileUtils(values,medoxie){
  const private_key = store.getState().UserReducer.key
  let newObj = values;
  if(medoxie == 'Patient'){
    for (let str in newObj) {
      if(newObj[str] == null) newObj[str] = ''
      if(typeof newObj[str] == 'string'){
        if(newObj[str] == ''){
          newObj[str] = ''
        }else{
          newObj[str] = encrypt(newObj[str],private_key);
        }
      }
    }
    for (let key in newObj.attributes) {
      if (newObj?.attributes?.hasOwnProperty(key)=='' && newObj?.attributes[key] === undefined) {
        newObj.attributes[key] = '';
      }else if(newObj?.attributes[key]?.constructor == Array){
        newObj.attributes[key] = encrypt(JSON.stringify(newObj.attributes[key]),private_key);
        // newObj.attributes[key] = JSON.stringify( newObj.attributes[key] );
      }else{
        if(newObj.attributes[key] == ''||newObj.attributes[key] == undefined){
          newObj.attributes[key] = ''
        }else{
          // if(newObj.attributes[key] == 'middle')
          newObj.attributes[key] = encrypt(newObj.attributes[key],private_key);
          // newObj.attributes[key] = newObj.attributes[key];
        }
      }
    }
  }else{
    for (let str in newObj) {
      if(newObj[str] == null) newObj[str] = ''
      if(typeof newObj[str] == 'string'){
        if(newObj[str] == ''){
          newObj[str] = ''
        }else{
          newObj[str] = newObj[str];
        }
      }
    }
    for (let key in newObj.attributes) {
      if (newObj?.attributes?.hasOwnProperty(key)=='' && newObj?.attributes[key] === undefined) {
        newObj.attributes[key] = '';
      }else if(newObj?.attributes[key]?.constructor == Array){
        // console.log(newObj.attributes[key].constructor)
        try{
          newObj.attributes[key] = JSON.stringify(newObj.attributes[key]);
        }catch{

        }
        
        // newObj.attributes[key] = JSON.stringify( newObj.attributes[key] );
      }else{
        if(newObj.attributes[key] == ''||newObj.attributes[key] == undefined){
          newObj.attributes[key] = ''
        }else{
          // if(newObj.attributes[key] == 'middle')
          newObj.attributes[key] = newObj.attributes[key];
          // newObj.attributes[key] = newObj.attributes[key];
        }
      }
    }
  }
  return newObj
  console.log(newObj)
}