const { createProxyMiddleware } = require('http-proxy-middleware')

const proxy = createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('x-forwarded-proto', req.protocol)
    proxyReq.setHeader('x-forwarded-host', req.headers.host)
  },
})

module.exports = function (app) {
  app.use('/api', proxy)
  app.use('/instances', proxy)
}