const chalk = require('chalk')
const mime = require('mime')
const ejs = require('ejs')
const http = require('http')
const path = require('path')
const os = require('os')
const url = require('url')
const fs = require('fs').promises
const zlib = require('zlib')
const crypto = require('crypto')
const { createReadStream, readFileSync } = require('fs')

const template = readFileSync(path.resolve(__dirname, 'template.html'), 'utf-8')

let interfaces = os.networkInterfaces()
interfaces = Object.values(interfaces)
  .flat()
  .filter((item) => item.family === 'IPv4')

class Server {
  constructor(opts) {
    this.port = opts.port
    this.directory = opts.directory
    this.template = template
  }
  handleRequest = async (req, res) => {
    // 当请求到来时 我需要判断 你的访问路径 是文件则显示文件的内容 如果是文件夹 则显示文件中的列表
    const { pathname } = url.parse(req.url)
    // 根据用户访问的路径 生成一个绝对路径
    const absPath = path.join(this.directory, pathname)
    try {
      const statObj = await fs.stat(absPath)

      if (statObj.isFile()) {
        // 将文件直接读取出来返回即可
        this.sendFile(absPath, req, res, statObj)
      } else {
        // 我们需要用目录的信息去渲染模板 返回给用户
        const dirs = await fs.readdir(absPath)
        const ret = ejs.render(this.template, {
          dirs: dirs.map((dir) => {
            return {
              dir,
              href: path.join(pathname, dir)
            }
          })
        })
        res.setHeader('Content-Type', 'text/html;charset=utf8')
        res.end(ret)
      }
    } catch (error) {
      console.log('error >>> ', error)
      this.sendError(absPath, req, res)
    }
  }
  sendError(absPath, req, res, statObj) {
    res.statusCode = 404
    res.end('Not Found')
  }
  sendFile(absPath, req, res, statObj) {
    console.log('sendFile >>> ', absPath)

    // 在发送文件之前 我们可以给文件设置一个缓存时间，如果没有超过缓存时间，那就直接用缓存就好了
    // 不用每次都访问服务器
    // 强制缓存，让浏览器让某个时间内，不在请求服务器
    // http1.0 中 expires，这种方式可以让引用的资源在某一段时间内不在发送请求
    // 强制缓存不能让首次访问的内容缓存，首次访问的页面不能走强制缓存
    // expires 判断是否过期，如果用户更改了本地时间可能会导致缓存失效，因为这个东西存到了浏览器
    // 上，拿自己家里的日期和服务器 的日期做对比
    // res.setHeader('expires', new Date(Date.now() + 5 * 1000).toGMTString())
    // http1.1 max-age
    // res.setHeader('Cache-Control', '  max-age=5')
    // no-cache（有缓存只是不走而已） no-store（压根没缓存） 客户端无缓存区
    // res.setHeader('Cache-Control', 'no-cache')
    // res.setHeader('Last-Modified', statObj.ctime.toGMTString())

    // let isModifiedSince = req.headers['if-modified-since']
    // let lastModified = statObj.ctime.toGMTString()

    // if (isModifiedSince === lastModified) {
    //   // 直接告诉浏览器 找缓存去
    //   res.statusCode = 304
    //   return res.end()
    // }

    // let ETag = crypto
    //   .createHash('md5')
    //   .update(readFileSync(absPath))
    //   .digest('base64')
    // let ifNoneMatch = req.headers['if-none-match']
    // if (ETag === ifNoneMatch) {
    //   res.statusCode = 304
    //   return res.end()
    // }
    // res.setHeader('ETag', ETag)

    if (this.cache(absPath, req, res, statObj)) {
      res.statusCode = 304
      res.end()
      return
    }

    // 压缩，我们不希望把文件整个发送给客户端
    // 服务端开启 gzip 压缩 可以降低文件传输大小
    // gzip 对重复性较高的内容，进行替换

    res.setHeader('Content-Type', `${mime.getType(absPath)};charset=utf-8`)
    let createGzip = null
    if ((createGzip = this.gzip(absPath, req, res, statObj))) {
      return createReadStream(absPath).pipe(createGzip).pipe(res)
    } else {
      return createReadStream(absPath).pipe(res)
    }

    // 第一次访问服务器我们可以采用强制缓存（浏览器不要再找我了） 5s + 最后修改时间
    // 5s 内再次访问，就不会发起请求了
    // 超过5s后会再次向服务器发送请求（携带最后的修改时间），但是此时服务器会做对比缓存（那服务器的文件和携带过来的内容作比较）
    // 如果时间一致 认为这个文件没有修改 返回 304
    // 浏览器会根据状态码，走自己的缓存，过一会又超过了5s了，再走第二步
    // 如果在强制缓存的5s内访问资源，不会返回新的

    // last-modified 不够准确，
    // 1. 因为时间是精确到s，而我可以在1s内修改100次
    // 2. 有可能最后修改时间变化了，但是内容没发生变化，也出现缓存失效的问题
    // 为了保证靠谱，我们可以直接对比文件的内容（性能问题）

    // 强制缓存和协商缓存（对比缓存）
  }
  gzip(absPath, req, res, statObj) {
    const encoding = req.headers['accept-encoding']
    if (encoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip')
      return zlib.createGzip(absPath)
    }
  }
  cache(absPath, req, res, statObj) {
    // 强制缓存
    res.setHeader('Expires', new Date(Date.now() + 5 * 1000).toGMTString())
    res.setHeader('Cache-Control', 'max-age=5')

    //
    let lastModified = statObj.ctime.toGMTString()
    let eTag =
      new Date(lastModified).getTime().toString(16) +
      '-' +
      statObj.size.toString(16)

    res.setHeader('Last-modified', lastModified)
    res.setHeader('ETag', eTag)

    const ifNoneMatch = req.headers['if-none-match']
    const ifModifiedSince = req.headers['if-modified-since']

    if (lastModified !== ifModifiedSince) {
      return false
    }

    if (ifNoneMatch !== eTag) {
      return false
    }

    return true
  }
  start() {
    const server = http.createServer(this.handleRequest)
    server.listen(this.port, () => {
      console.log(
        chalk.yellow(
          `Starting up ac-http-server, serving ${chalk.green(
            path.relative(process.cwd(), this.directory) || './'
          )}\r\nAvailable on:\r\n`
        )
      )
      interfaces.forEach((item) => {
        console.log(`  http://${item.address}:${chalk.green(this.port)}`)
      })
      console.log('Hit CTRL-C to stop the server')
    })
  }
}

module.exports = Server
