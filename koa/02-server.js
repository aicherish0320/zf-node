const Koa = require('./koa')

const app = new Koa()

// 1. 每个应用创建的时候，使用的上下文应该是不同的
// 2. 每次请求的上下文应该是一个独立的上下文
// 默认情况下 node 原生的 req 和 res 功能弱，我们核心目的就是为了扩展原生的 req 和 res

app.use((ctx) => {
  // ctx 是 koa 自己封装的一个对象 内部包含了 node 中 http 模块中的原生 req 和 res
  console.log(ctx.req.url)
  // request 和 response 是 koa 中新封装的
  console.log(ctx.request.req.url)
  // 通过自己封装的 request 对象可以拿到原生的 req 对象
  console.log(ctx.request.query)
  // 默认我们访问 ctx.path 属性，会被代理到 ctx.request.path
  console.log(ctx.path)

  // 这个方法可以多次执行
  ctx.body = 'okk'
  ctx.body = 'Hello'
  ctx.response.body = 'World'
})

app.listen(3331, () => {
  console.log('3331 port')
})

// const app2 = new Koa()
// app2.use((ctx) => {
//   console.log('ctx2 >>> ', ctx.__proto__.__proto__)
// })
// app2.listen(3333, () => {
//   console.log('3333 port')
// })
