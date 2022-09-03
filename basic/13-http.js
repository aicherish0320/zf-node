const http = require('http')
const url = require('url')

// node 的服务默认都是单线程，如果当前请求时间过长，后面的请求需要等待这个请求处理完毕

const server = http.createServer((req, res) => {
  // 请求到来时会执行此回调
  // 请求行
  // 解析请求行的内容
  // 方法的类型是大写
  const method = req.method
  const { pathname, query } = url.parse(req.url, true)
  // console.log('url.parse(req.url) >>> ', url.parse(req.url, true))
  // const urlObj = new URL('http://localhost:3001/a/b?c=1')
  // console.log('urlObj >>> ', urlObj)
  // console.log('method >>> ', method)
  // console.log('req.httpVersion >>> ', req.httpVersion)
  // console.log('pathname >>> ', pathname)
  // console.log('query >>> ', query)

  // 请求头
  // console.log('header >>> ', req.headers)

  // 请求体 传输靠的是 tcp
  let arr = []
  req.on('data', (chunk) => {
    console.log('chunk >>> ', chunk)

    arr.push(chunk)
  })
  req.on('end', () => {
    console.log('end >>> ')

    // 将数据转换成字符串
    console.log(Buffer.concat(arr).toString())
  })

  // 响应行
  res.statusCode = 200
  // res.statusMessage = 'Hello'
  // 响应头
  // http1.0 中为了实现传递不同的数据，就增加了头的概念
  res.setHeader('Content-Type', 'text/plain;charset=utf8')
  // 可写流，需要调用 end 方法
  res.end('爱鹊絮')

  // if (req.url === '/sum') {
  //   // node 不适合做 CPU 密集，计算
  //   let sum = 0
  //   for (let i = 0; i < 1000 * 10000; i++) {
  //     sum += i
  //   }
  //   res.end(sum + '')
  // } else {
  //   res.end('other')
  // }
})

let port = 3001
// 内部 http 的实现是基于 net 模块，会将 socket 解析后生成 req 和 res
server.listen(port, () => {
  console.log(port + ' port')
})

server.on('error', (err) => {
  // 端口重了
  if (err && err.errno === -4091) {
    server.listen(++port)
  }
})
