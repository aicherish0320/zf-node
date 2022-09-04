const zlib = require('zlib')
const path = require('path')
const fs = require('fs')

console.log('__dirname >>> ', __dirname)

// zlib.gzip(fs.readFileSync(path.resolve(__dirname, '1.txt')), (error, data) => {
//   console.log(data.length)
//   fs.writeFileSync('./1.gz', data)
// })

// 解压
zlib.unzip(fs.readFileSync(path.resolve(__dirname, '1.gz')), (err, data) => {
  console.log(data.length)
})
