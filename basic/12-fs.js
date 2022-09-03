const fs = require('fs')
const path = require('path')

// 如果文件很大，而且我们希望做拷贝的逻辑
// fs.readFile(path.resolve(__dirname, './package.json'), (err, data) => {
//   console.log(data)
//   fs.writeFile(path.resolve(__dirname, 'a.json'), data, () => {
//     console.log('ok')
//   })
// })
// readFile 适合读取一些小的文件 js css html
// 视频 音频 就比较大（如果采用这种方式，会淹没可用内存）

// 边读边写，读一点 写一点 我们可以控制读写的速率（流）

// fs.open() fs.read() fs.open() fs.write() fs.close()
// flags 标识为 我打开文件要做什么事 r w a
// 如果在 r 的时候读取的文件不存在 则会报错
// 读取其实就是写入，将文件中的内容写入到内存中；写入其实是读取，需要将文件读取出来才能写入
// node 中默认 64k 就需要分片读取
// let buf = Buffer.alloc(1)
// fs.open(path.resolve(__dirname, 'test.js'), 'r', (err, rfd) => {
//   // 需要将数据读取 写入到 Buffer 中
//   fs.read(rfd, buf, 0, 1, 0, function (err, bytesRead) {
//     // chomd -R 777
//     // 0o666：读取+写入+执行
//     fs.open(path.resolve(__dirname, 'newTest.js'), 'w', 0o666, (err, wfd) => {
//       // 向文件中写入 buffer
//       fs.write(wfd, buf, 0, 1, 0, (err, written) => {
//         console.log('ok')
//       })
//     })
//   })
// })

function copy(source, target, cb) {
  const BUFFER_SIZE = 3
  let buffer = Buffer.alloc(BUFFER_SIZE)
  let readOffset = 0
  let writeOffset = 0
  fs.open(source, 'r', (err, rfd) => {
    if (err) return cb(err)
    fs.open(target, 'w', (err, wfd) => {
      if (err) return cb(err)

      function next() {
        fs.read(rfd, buffer, 0, BUFFER_SIZE, readOffset, (err, bytesRead) => {
          if (err) return cb(err)
          if (!bytesRead) {
            let index = 0
            const done = () => {
              if (++index === 2) {
                cb()
              }
            }
            fs.close(rfd, done)
            fs.close(wfd, done)
            return
          }
          fs.write(
            wfd,
            buffer,
            0,
            bytesRead,
            writeOffset,
            (err, bytesWritten) => {
              if (err) return cb(err)
              readOffset += bytesRead
              writeOffset += bytesWritten
              next()
            }
          )
        })
      }
      next()
    })
  })
}
copy('./test.js', 'newTest.js', function (err) {
  if (err) {
    console.error(err)
  } else {
    console.log('success')
  }
})
