const querystring = require('querystring')

module.exports = () => {
  return async (ctx, next) => {
    await new Promise((resolve) => {
      const arr = []
      ctx.req.on('data', function (chunk) {
        arr.push(chunk)
      })
      ctx.req.on('end', function () {
        // 浏览器在发送请求的时候 会自动带上请求格式
        if (ctx.request.type === 'application/json') {
          const body = Buffer.concat(arr).toString()
          ctx.request.body = JSON.parse(body)
        } else if (ctx.request.type === 'application/x-www-form-urlencoded') {
          const body = Buffer.concat(arr).toString()
          ctx.request.body = querystring.parse(body, '&', '=')
        } else if (ctx.request.type === 'multipart/form-data') {
          const body = Buffer.concat(arr)
          console.log(body.toString())
        }
        resolve()
      })
    })
    await next()
  }
}

// 所有的插件都编写成一个函数导出，最后返回一个中间件
