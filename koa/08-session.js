const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()
const uuid = require('uuid')

app.keys = ['aicherish']

app.use(router.routes())

const cardName = 'wash'
// 服务端 session，采用 redis 存储 session
// session 需要持久化存储，否则丢失后就没有了。如果我期望把当前的用户的信息进行共享
const session = {}

router.get('/wash', async (ctx, next) => {
  const cardId = ctx.cookies.get(cardName)
  if (cardId && session[cardId]) {
    session[cardId].money -= 10
    ctx.body = `您还剩余 ${session[cardId].money}钱`
  } else {
    const cardId = uuid.v4()
    session[cardId] = { money: 100 }
    ctx.cookies.set(cardName, cardId, { httpOnly: true, signed: true })
    ctx.body = `您充值了 100 元`
  }
})

app.listen(3000, () => {
  console.log('3000 port')
})
