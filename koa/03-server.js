const Koa = require('koa')

const app = new Koa()

// koa 默认是洋葱模式 调用上一个 next，会走下一个中间件函数
// koa 中所有的异步操作都要基于 promise
// koa 内部会将所有的中间件进行组合操作 组合成了一个大的 promise 只要从开头走到了结束，就算完成了
// await 和 return 都会等待 promise 执行完成，return 后面的代码不会执行
// koa 中的中间件必须增加 await next() 或者 return next()，否则异步逻辑可能会出错

function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('sleep >>> ')
      resolve()
    }, 2000)
  })
}
// 1 3 sleep 5 6 4 2
app.use(async (ctx, next) => {
  console.log('1 >>> ')
  ctx.body = 1
  // next 表示执行下一个中间件
  await next()
  console.log(2)
  ctx.body = 2
})
app.use(async (ctx, next) => {
  console.log('3 >>> ')
  ctx.body = 3
  await sleep()
  next()
  console.log(4)
  ctx.body = 4
})
app.use((ctx, next) => {
  console.log('5 >>> ')
  ctx.body = 5
  next()
  console.log(6)
  ctx.body = 6
})

app.listen('3000', () => {
  console.log('3000 port')
})
