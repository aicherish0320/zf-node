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
    res.setHeader('Content-Type', `${mime.getType(absPath)};charset=utf-8`)
    return createReadStream(absPath).pipe(res)
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
