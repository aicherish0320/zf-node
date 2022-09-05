const Koa = require('./koa')
// 创建一个 web 应用
const app = new Koa()

app.use(async (req, res) => {
  // 用户请求发送的时候 会执行此回调方法
  // ctx.body = 'ok'
  res.end('ok')
})

app.listen(3331, () => console.log('3331 port'))

// koa 默认就是对我们的 node 原生的 http 服务进行了封装
// 源码：application.js 整个应用 context.js 代表的是上下文
// request.js koa 封装的req 用于扩展请求的 response.js 用于扩展响应的
