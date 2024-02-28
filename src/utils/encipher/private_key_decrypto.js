//获取之加密的key之后进行解密key之后再进行之后的操作，读取个人资料
import Web3, { ContractMissingDeployDataError } from 'web3'
const ecies = require('standard-ecies');
let ethUtil = require('ethereumjs-util');
const crypto = require('crypto');

var ecdh = crypto.createECDH('secp256k1');

let privateKey = "eb4e675d4adee4fa60cf82a681a7d192d7bd3ece7938e7e63ea06a5259eb0d0c"//钱包私钥

//后端返回的加过的key
let encryptedText = "04da10fd3889f8e5ca8b317b1b564782dab59b44c7aa8786cdcf179d81d4212685c7d197603eab72da2538f75280425c40a71bb280236167ec8f35c0b38f750fd7e88dc52ddf34911e932d85841f1db4c2b5a0894a35d327a3e3932c22182c2578d7618b5ca1113d5e3d9624bd10694e1c"
ecdh.setPrivateKey(ethUtil.toBuffer("0x"+privateKey))
var decryptedText = new Buffer(ecies.decrypt(ecdh,ethUtil.toBuffer("0x"+encryptedText) ));
// console.log(`encryptedText!!!!!!!: ${decryptedText.toString()}`);
//decryptedText.toString()解密过后的key，可以用于解密个人资料

export default async function private_key_decrypto(key,privateKey){
  if(privateKey == null)return 404
  const request = (window.ethereum).request;
  // 获取私钥
  const web3 = new Web3(window.ethereum);
  var ecdh = crypto.createECDH('secp256k1');
  // 我自己的私钥
  // var privateKey = "f2232373a1599d88ef238e2eb153bb00d1a9f6301043ddea4c52858eca180e5b"//钱包私钥
  // let privateKey = "07484a76764469d02f94dbad4afff984d2a4e0cfa14bc8da29c4a32482d81df3"
  ecdh.setPrivateKey(ethUtil.toBuffer("0x"+privateKey))
  // var key = "04da10fd3889f8e5ca8b317b1b564782dab59b44c7aa8786cdcf179d81d4212685c7d197603eab72da2538f75280425c40a71bb280236167ec8f35c0b38f750fd7e88dc52ddf34911e932d85841f1db4c2b5a0894a35d327a3e3932c22182c2578d7618b5ca1113d5e3d9624bd10694e1c"
  try{
    var decryptedText = new Buffer(ecies.decrypt(ecdh,ethUtil.toBuffer("0x"+key) ));   
    console.log(`encryptedText!!!!!!!: ${decryptedText.toString()}`);
    return decryptedText.toString()
  }
  catch(e){
    console.log(e)
    return 404
  }
  // return decryptedText.toString()
}