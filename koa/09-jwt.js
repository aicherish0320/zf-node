const Koa = require('koa')
const Router = require('@koa/router')
const body = require('koa-bodyparser')
// jsonwebtoken 开始时使用 功能比较强大
const jwt = require('jwt-simple')

const app = new Koa()

app.use(body())
const router = new Router()

app.use(router.routes())

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  if (username === password) {
    ctx.body = {
      err: 0,
      data: '登录成功',
      token: jwt.encode({ username }, 'aicherish')
    }
  } else {
    ctx.body = {
      err: 1,
      data: '登录错误'
    }
  }
})

router.get('/validate', async (ctx, next) => {
  let token = ctx.get('authorization')
  token && (token = token.split(' ')[1])

  try {
    const r = jwt.decode(token, 'aicherish')
    console.log('r >>> ', r)
    ctx.body = {
      data: r.username
    }
  } catch (error) {
    console.log('error >>> ', error)
    ctx.body = {
      data: '令牌不正确'
    }
  }
})

app.listen(3001, () => {
  console.log('3001 port')
})
