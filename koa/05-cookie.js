const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()

app.use(router.routes())

router.get('/write', async (ctx, next) => {
  ctx.res.setHeader('Set-Cookie', 'a=1')
  ctx.body = 'write ok'
})

app.listen(3331, () => {
  console.log('3331 port')
})
