const AES = require('crypto-js');
const SecrekKey = localStorage.getItem('key');// 32位
const iv = '4387438hfdhfdjhg';// 16位
// 加密
export function encrypt(word,key) {
  var bool = key||localStorage.getItem('key')
  if(bool == null || !bool || bool == undefined)return word
  return AES.AES.encrypt(word, AES.enc.Utf8.parse(bool), {
    iv: AES.enc.Utf8.parse(iv),
    mode: AES.mode.CBC,
    padding: AES.pad.Pkcs7
  }).toString()
};

// 解密
export function decrypt(word,key) {
  var bool = key|| localStorage.getItem('key')
  if(bool == null || !bool || bool == undefined)return word
  let decrypted = AES.AES.decrypt(word, AES.enc.Utf8.parse(bool), {
    iv: AES.enc.Utf8.parse(iv),
    mode: AES.mode.CBC,
    padding: AES.pad.Pkcs7
  });
  return decrypted.toString(AES.enc.Utf8)
}