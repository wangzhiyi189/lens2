let elliptic = require('elliptic');
let sha3 = require('js-sha3');
let ec = new elliptic.ec('secp256k1');
let ethUtil = require('ethereumjs-util');
const ecies = require('standard-ecies');
var Wallet = require('ethereumjs-wallet');
var EthUtil = require('ethereumjs-util');
// 私钥转公钥
export default function private_public_key(key,secret_key){
  const privatekeyBuffer = EthUtil.toBuffer("0x"+secret_key)
  const wallet = Wallet.default.fromPrivateKey(privatekeyBuffer);
  // Get public key
  const publicKey = wallet.getPublicKey();

  let pubkey = publicKey
  console.log(`pubkey!!!!!!!: ${pubkey.toString('hex')}`);

  var buffer = new Buffer(key); // 加密的个人资料

  let address = "0x"+ethUtil.pubToAddress(pubkey).toString('hex')
  console.log(`Address!!!!!!!: ${address}`);

  var encryptedText = ecies.encrypt(ethUtil.toBuffer("0x04"+pubkey.toString('hex')), buffer);
  console.log(`encryptedText!!!!!!!: ${encryptedText.toString('hex')}`);
  return encryptedText.toString('hex')
}