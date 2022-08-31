const fs = require('fs')
const path = require('path')
const vm = require('vm')

// 如何让一个字符串执行
// eval
// new Function
// node 自己弄了一个模块可以运行字符串
// vm.runInNewContext('console.log(a)', {
//   a: 1
// })

// 什么时候使用同步方法？什么时候使用异步？
// 默认在程序运行之前都可以采用同步，如果运行起来了，我们不希望阻塞主线程就用异步

// 相对路径，是指代码的运行路径
// const exists = fs.existsSync('./01.js')
// console.log(path.join('a', 'b', '../', 'c')) // 把路径拼接即可
// console.log(path.resolve('a', 'b', '../', 'c')) // 解析出一个绝对路径

// const exists = fs.existsSync(path.resolve(__dirname, '01.js'))
// console.log('exists >>> ', exists)

// const ret = fs.readFileSync('./README.md', 'utf-8')
// console.log('ret >>> ', ret)

// console.log(__dirname)
