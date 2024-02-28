//点击同意的时候加密之前的key用的
import Web3 from 'web3'
let elliptic = require('elliptic');
let sha3 = require('js-sha3');
let ec = new elliptic.ec('secp256k1');
let ethUtil = require('ethereumjs-util');
const ecies = require('standard-ecies');

// let msg = 'My name is Chaim!'; //Authorize+时间戳
// let sign = '0xbe5f614e12201b96c3020a1fcdcf998215efb4861cc66b0163b8c295890c46a074eda3dc68bc06a1eca7bc3cf2461b8a1c5cfd9ca9f4a1ef8b84d574eebe3d091c'//列表里返回的签名

// let text = "Hello World" //加密个人资料的key
// var buffer = new Buffer(text);

// let msgHash = sha3.keccak256(msg);
// let msgHashPre = ethUtil.hashPersonalMessage(ethUtil.toBuffer("0x"+msgHash))
// console.log(`Msg: ${msg}`);


// let rsv = ethUtil.fromRpcSig(sign)
// let pubkey = ethUtil.ecrecover(ethUtil.toBuffer(msgHashPre),rsv.v,rsv.r,rsv.s)
// console.log(`pubkey!!!!!!!: ${pubkey.toString('hex')}`);

// let address = "0x"+ethUtil.pubToAddress(pubkey).toString('hex')
// console.log(`Address!!!!!!!: ${address}`);

// var encryptedText = ecies.encrypt(ethUtil.toBuffer("0x04"+pubkey.toString('hex')), buffer);
// console.log(`encryptedText!!!!!!!: ${encryptedText.toString('hex')}`);
//encryptedText.toString('hex')代替之前的加密个人资料的key发给后端进行授权

/**
 * @key 私钥 
 * @sign 签名
 */

export default function Public_Key_Encrypto(key,sign,msg){
  const rightnow = (Date.now() / 1000).toFixed(0)
  const sortanow = rightnow - (rightnow % 600)
  // var msg = "Authorize "+sortanow
  // console.log(msg)
  // var msg = 'My name is Chaim!'
  // var sign = '0xbe5f614e12201b96c3020a1fcdcf998215efb4861cc66b0163b8c295890c46a074eda3dc68bc06a1eca7bc3cf2461b8a1c5cfd9ca9f4a1ef8b84d574eebe3d091c'//列表里返回的签名
  // var sign = '0xc6624fd6588117eac8f33a71903e0471691daba2bea64cfa9032f3b33a7ef7273b1b65855d8b56cda09628885fac3d389538148fee4a55c5b1fae2504ff281231c'
  // var key = "Hello World"
  var buffer = new Buffer(key);
  // const web3 = new Web3(window.ethereum);
  // var address2 = web3.eth.accounts.recover(msg,sign)
  // console.log(address2,'---web3解出的地址')

  // console.log(key,buffer)
  let msgHash = sha3.keccak256(msg);
  console.log(sign,'--签名消息')

  // let msgHashPre = ethUtil.hashPersonalMessage(ethUtil.toBuffer("0x"+msgHash))
  let msgHashPre = ethUtil.hashPersonalMessage(ethUtil.toBuffer("0x"+Buffer.from(msg, 'utf8').toString('hex')))
  // console.log(msgHashPre)
  console.log(`Msg: ${msg}`);

  let rsv = ethUtil.fromRpcSig(sign)
  let pubkey = ethUtil.ecrecover(ethUtil.toBuffer(msgHashPre),rsv.v,rsv.r,rsv.s)
  // let pubkey = ethUtil.ecrecover(ethUtil.toBuffer(),rsv.v,rsv.r,rsv.s)
  // console.log(pubkey)

  let address = "0x"+ethUtil.pubToAddress(pubkey).toString('hex')
  console.log(`Address!!!!!!!: ${address}`);

  var encryptedText = ecies.encrypt(ethUtil.toBuffer("0x04"+pubkey.toString('hex')), buffer);
  console.log(`encryptedText!!!!!!!: ${encryptedText.toString('hex')}`);
  return encryptedText.toString('hex')
  
}