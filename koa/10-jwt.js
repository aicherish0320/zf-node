const Koa = require('koa')
const Router = require('@koa/router')
const body = require('koa-bodyparser')
// jsonwebtoken 开始时使用 功能比较强大
// const jwt = require('jwt-simple')
const jwt = {
  sign(content, secret) {
    return this.toBase64URL(
      require('crypto')
        .createHmac('sha256', secret)
        .update(content)
        .digest('base64')
    )
  },
  toBase64URL(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  },
  base64UrlUnescape(str) {
    str += new Array(5 - (str.length % 4)).join('=')
    return str.replace(/-/g, '+').replace(/_/g, '/')
  },
  toBase64(content) {
    if (typeof content === 'object') {
      content = JSON.stringify(content)
    }
    // base64 +(-) /(_) =(空)  会出现 bug
    return this.toBase64URL(Buffer.from(content).toString('base64'))
  },
  encode: function (data, secret) {
    const part1 = this.toBase64({ typ: 'JWT', alg: 'HS256' })
    const part2 = this.toBase64(data)
    const part3 = this.sign(part1 + '.' + part2, secret)

    return part1 + '.' + part2 + '.' + part3
  },
  decode: function (data, secret) {
    const [part1, part2, part3] = data.split('.')
    const newSign = this.sign(part1 + '.' + part2, secret)
    if (newSign === part3) {
      return JSON.parse(
        Buffer.from(this.base64UrlUnescape(part2), 'base64').toString()
      )
    } else {
      throw new Error('令牌有篡改')
    }
  }
}

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

app.listen(3301, () => {
  console.log('3301 port')
})
