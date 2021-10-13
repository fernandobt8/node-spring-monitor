const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('x-forwarded-proto', req.protocol)
        proxyReq.setHeader('x-forwarded-host', req.headers.host)
      },
    })
  )
}
