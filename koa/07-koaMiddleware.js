const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const body = require('./middleware/koa-bodyparser')
const cors = require('./middleware/koa-cors')

const app = new Koa()

app.use(cors())
app.use(body())
app.use(async (ctx, next) => {})

app.use(async (ctx, next) => {
  const { path: reqPath, method } = ctx
  if (reqPath === '/login' && method === 'POST') {
    ctx.body = ctx.request.body
  }
})

app.listen(3000, () => {
  console.log('3000 port')
})
