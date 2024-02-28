const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app){
  app.use(
    '/ajax',
    createProxyMiddleware({
      target:'http://192.168.2.128:3000/',
      changeOrigin:true
    })
  )
}