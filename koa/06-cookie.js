const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()

app.keys = ['aicherish']

const router = new Router()
app.use(router.routes())

router.get('/write', async (ctx, next) => {
  ctx.cookies.set('a', '1', { maxAge: 5, httpOnly: true })
  ctx.cookies.set('b', 2, { domain: '.ac.com', signed: true })
  ctx.body = 'write ok'
})

router.get('/read', async (ctx, next) => {
  ctx.body =
    ctx.cookies.get('b', {
      signed: true
    }) || 'empty'
})

router.get('/visit', async (ctx, next) => {
  let visit =
    (ctx.cookies.get('visit', {
      signed: true
    }) || 0) - 0
  visit += 1
  ctx.cookies.set('visit', visit, {
    signed: true
  })
  ctx.body = `你是第 ${visit} 次来访问我`
})

app.listen(3331, () => {
  console.log('3331 port')
})
