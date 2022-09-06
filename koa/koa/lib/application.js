const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const { EventEmitter } = require('events')

// 1. 每个应用创建的时候，使用的上下文应该是不同的
// 2. 每次请求的上下文应该是独立的上下文

// 所有的异步逻辑都要编程 promise 的形式

class Application extends EventEmitter {
  constructor() {
    super()
    // this.context__proto__ = context
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)

    this.middlewares = []
  }
  use(fn) {
    // this.fn = fn
    this.middlewares.push(fn)
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
  compose(ctx) {
    let index = -1

    const dispatch = (i) => {
      if (index <= i) {
        return Promise.reject('next() call multiples times')
      }
      index = i

      if (this.middlewares.length === i) {
        return Promise.resolve()
      }
      const middleware = this.middlewares[i]
      try {
        return Promise.resolve(
          middleware(ctx, () => {
            // next 函数 () => {}
            dispatch(i + 1)
          })
        )
      } catch (error) {
        return Promise.reject(error)
      }
    }
    // 我要执行第一个中间件
    return dispatch(0)
  }
  handleRequest = (req, res) => {
    const ctx = this.createContext(req, res)
    res.statusCode = 404
    // this.fn(ctx)
    this.compose(ctx)
      .then(() => {
        // 返回最终的结果响应给用户
        const body = ctx.body
        if (body) {
          return res.end(body)
        } else {
          res.end('Not Found')
        }
      })
      .catch((e) => {
        this.emit('error', e)
      })
  }
  listen() {
    const server = http.createServer(this.handleRequest)
    server.listen(...arguments)
  }
}

module.exports = Application
