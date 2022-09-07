const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const body = require('./middleware/koa-bodyparser')
const cors = require('./middleware/koa-cors')

const app = new Koa()

app.use(cors())
app.use(body())

app.use(async (ctx, next) => {
  const { path: reqPath, method } = ctx
  if (reqPath === '/login' && method === 'GET') {
    ctx.type = 'text/html;charset=utf-8'

    // 默认返回二进制流（content-type: application/octet-stream） koa 中会认为你需要做下载操作
    ctx.body = fs.createReadStream(path.resolve(__dirname, 'login.html'))
  } else {
    await next()
  }
})
// 1. 使用 Koa 必须每个 next 前面增加 await ，防止后续有异步逻辑
// 2. 我们每个中间件中的逻辑，如果是异步 需要等待异步成功后再执行（把所有的异步方法变成 Promise）
// 3. 中间件的执行顺序，永远都是从第一个开始执行，依次向下执行
app.use(async (ctx, next) => {
  const { path: reqPath, method } = ctx
  if (reqPath === '/login' && method === 'POST') {
    // ctx.type = 'text/html;charset=utf-8'
    ctx.body = ctx.request.body
  }
})

app.listen(3000, () => {
  console.log('3000 port')
})
