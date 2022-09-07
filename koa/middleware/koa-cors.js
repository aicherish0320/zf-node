module.exports = () => {
  // cors 跨域 允许浏览器跨域访问
  return async (ctx, next) => {
    // ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Origin', ctx.headers.origin) // 等价于 *
    // 运行浏览器设置自定义的 header
    ctx.set('Access-Control-Allow-Headers', 'Content-Type')
    // 10s 内不在发送预检请求
    ctx.set('Access-Control-Allow-Max-Age', 10)
    //
    ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,GET,OPTIONS,GET,POST')
    // 一般跨域不携带 cookie，如果允许携带 cookie 就不能配置 *
    ctx.set('Access-Control-Allow-Credentials', true)
    if (ctx.method === 'OPTIONS') {
      return (ctx.body = '')
    }

    return next()
  }
}
