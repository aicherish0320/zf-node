const querystring = require('querystring')
const fs = require('fs')
const path = require('path')

Buffer.prototype.split = function (sep) {
  const arr = []

  const len = Buffer.from(sep).length

  let offset = 0
  let current = 0

  while (-1 !== (current = this.indexOf(sep, offset))) {
    arr.push(this.slice(offset, current))
    offset = current + len
  }
  arr.push(this.slice(offset))

  return arr
}

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
          const boundary = '--' + ctx.get('content-type').split('=')[1]
          let r = {}
          const lines = body.split(boundary).slice(1, -1)
          lines.forEach((line) => {
            let [head, body] = line.split('\r\n\r\n')
            head = head.toString()
            const key = head.match(/name="(.+?)"/)[1]
            if (head.includes('filename')) {
              console.log('head >>> ', head)

              const filename = head.match(/filename="(.+?)"/)[1]
              const uploadDir = path.resolve(__dirname, '../upload', filename)
              fs.writeFileSync(uploadDir, line.slice(head.length + 4, -2))
              r[key] = {
                filename,
                // type: head.match(/Content-Type: (.+?)/)[1],
                uploadDir,
                size: line.slice(head.length + 4, -2).length
              }
            } else {
              const value = body.toString().slice(0, -2)
              r[key] = value
            }
          })
          ctx.request.body = r
        }
        resolve()
      })
    })
    await next()
  }
}

// 所有的插件都编写成一个函数导出，最后返回一个中间件
