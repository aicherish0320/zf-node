const { createReadStream } = require('fs')
const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs').promises

const server = http.createServer(async (req, res) => {
  // a 服务器提供了一张图片，不能在 a 不授权的情况下 在 b 访问
  const { pathname } = url.parse(req.url)
  if (pathname === '/favicon.ico') {
    return res.end('sb')
  }
  const absPath = path.join(__dirname, pathname)
  try {
    const statObj = await fs.stat(absPath)
    if (statObj.isFile()) {
      if (absPath.includes('jpg')) {
        // referer 这个字段被谁引用就指向谁
        let referer = req.headers['referer'] || req.headers['referrer']

        //  直接打开图片不存在防盗链的问题
        if (referer) {
          const hostname = req.headers.host
          referer = url.parse(referer).host
          console.log('referer >>> ', referer, hostname)
          if (hostname !== referer) {
            return createReadStream(path.resolve(__dirname, 'lisa6.jpg')).pipe(
              res
            )
          }
        }
      }
      createReadStream(absPath).pipe(res)
    } else {
      throw Error('not File')
    }
  } catch (error) {
    res.statusCode = 404
    res.end('Error')
  }
})

server.listen('3301', () => {
  console.log('3301 port')
})
