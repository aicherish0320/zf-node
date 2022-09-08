const Koa = require('koa')
const Router = require('@koa/router')
const querystring = require('querystring')
const crypto = require('crypto')

const app = new Koa()
const router = new Router()

const sign = (context) => {
  // 盐值，同样的盐值摘要出来的结果是一样的
  return crypto
    .createHmac('sha256', 'aicherish')
    .update(context)
    .digest('base64')
    .replace(/\+/g, '')
    .replace(/\=/g, '')
    .replace(/\//g, '')
}

// 1. 中间件可以决定是否向下执行
// 2. 可以实现权限检验
// 3. 可以扩展公共方法
app.use(async (ctx, next) => {
  const cookies = []
  ctx.setCookie = function (key, value, options = {}) {
    const args = []
    if (options.maxAge) {
      args.push(`max-age=${options.maxAge}`)
    }
    if (options.httpOnly) {
      args.push(`httpOnly=${options.httpOnly}`)
    }
    if (options.domain) {
      args.push(`domain=${options.domain}`)
    }
    // 如果有这个字段，我需要增加一个签名
    if (options.signed) {
      cookies.push(`${key}.sign=${sign(`${key}=${value}`)}`)
    }
    cookies.push(`${key}=${value};${args.join('; ')}`)
    ctx.res.setHeader('Set-Cookie', cookies)
  }
  ctx.getCookie = function (key, options) {
    const cookieObj = querystring.parse(ctx.req.headers.cookie, '; ')

    if (options.signed) {
      const oldSign = cookieObj[key + '.sign']
      console.log('old >>> ', oldSign)

      const value = cookieObj[key]

      if (sign(`${key}=${value}`) === oldSign) {
        return value
      } else {
        return undefined
      }
    }

    return cookieObj[key]
  }
  return await next()
})

app.use(router.routes())

router.get('/write', async (ctx, next) => {
  // name value 表示 cookie 的 key 和 value
  // domain 这个表示 cookie 在哪个域名下可以使用，
  // 默认以当前域名作为值，可以设置两个子域可以相互访问
  // path 指代的是哪个路径下可以使用这个 cookie ，一般不采用
  // expires 过期时间 max-age（相对时间）
  // httpOnly 这个 cookie 能否让浏览器通过代码的形式拿到
  // 只是防止别人去恶意盗取你的cookie，cookie内容自己是可以看到和修改的，不能放置一些敏感信息
  // ctx.res.setHeader('Set-Cookie', [
  //   'a=1;domain=ac.com;max-age=5;httpOnly=true',
  //   'b=2'
  // ])
  ctx.setCookie('a', '1', { maxAge: 5, httpOnly: true })
  ctx.setCookie('b', 2, { domain: '.ac.com', signed: true })
  ctx.body = 'write ok'
})

router.get('/read', async (ctx, next) => {
  // ctx.body = ctx.req.headers.cookie || 'empty'
  ctx.body =
    ctx.getCookie('b', {
      signed: true
    }) || 'empty'
})

router.get('/visit', async (ctx, next) => {
  let visit =
    (ctx.getCookie('visit', {
      signed: true
    }) || 0) - 0
  visit += 1
  ctx.setCookie('visit', visit, {
    signed: true
  })
  ctx.body = `你是第 ${visit} 次来访问我`
})

app.listen(3331, () => {
  console.log('3331 port')
})
