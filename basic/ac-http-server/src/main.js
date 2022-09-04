const chalk = require('chalk')
const mime = require('mime')
const ejs = require('ejs')
const http = require('http')
const path = require('path')
const os = require('os')
const url = require('url')
const fs = require('fs').promises
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
    res.setHeader('Cache-Control', 'no-cache')
    // res.setHeader('Last-Modified', statObj.ctime.toGMTString())

    let isModifiedSince = req.headers['if-modified-since']
    let lastModified = statObj.ctime.toGMTString()

    if (isModifiedSince === lastModified) {
      // 直接告诉浏览器 找缓存去
      res.statusCode = 304
      return res.end()
    }

    res.setHeader('Content-Type', `${mime.getType(absPath)};charset=utf-8`)
    return createReadStream(absPath).pipe(res)

    // 第一次访问服务器我们可以采用强制缓存（浏览器不要再找我了） 5s + 最后修改时间
    // 5s 内再次访问，就不会发起请求了
    // 超过5s后会再次向服务器发送请求（携带最后的修改时间），但是此时服务器会做对比缓存（那服务器的文件和携带过来的内容作比较）
    // 如果时间一致 认为这个文件没有修改 返回 304
    // 浏览器会根据状态码，走自己的缓存，过一会又超过了5s了，再走第二步
    // 如果在强制缓存的5s内访问资源，不会返回新的

    // 强制缓存和协商缓存（对比缓存）
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
