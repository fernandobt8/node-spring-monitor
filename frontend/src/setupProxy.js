const { createProxyMiddleware } = require('http-proxy-middleware')

const proxy = createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  xfwd: true,
})

module.exports = function (app) {
  app.use(['/instances', '/api'], proxy)
}
