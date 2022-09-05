const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

// 1. 每个应用创建的时候，使用的上下文应该是不同的
// 2. 每次请求的上下文应该是独立的上下文

class Application {
  constructor() {
    // this.context__proto__ = context
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
  }
  use(fn) {
    this.fn = fn
  }
  createContext(req, res) {
    const ctx = Object.create(this.context)

    const request = Object.create(this.request)
    const response = Object.create(this.response)

    ctx.request = request
    ctx.request.req = ctx.req = req

    ctx.response = response
    ctx.response.res = ctx.res = res

    return ctx
  }
  handleRequest = (req, res) => {
    const ctx = this.createContext(req, res)
    res.statusCode = 404
    this.fn(ctx)
    // 返回最终的结果响应给用户
    const body = ctx.body
    if (body) {
      return res.end(body)
    } else {
      res.end('Not Found')
    }
  }
  listen() {
    const server = http.createServer(this.handleRequest)
    server.listen(...arguments)
  }
}

module.exports = Application
