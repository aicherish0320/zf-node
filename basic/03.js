// 默认情况下在文件中可以直接使用 module exports require __dirname __filename 都可以直接使用

// process nextTick cwd env argv
// current working directory
//  cwd 活的，当前执行命令的路径（命令行的绝对路径）
// __dirname，死的， 当前文件所在的文件夹// console.log('process >>> ', process.cwd())
// env 环境变量 全局环境变量（一般情况下不会使用全局） 临时环境变量（开发的时候会针对不同的环境去打包）
// cross-env 第三方的，帮我们做了兼容处理，因为 window(SET a = 100) mac(export a = 100) 下定义临时变量不同
// 根据环境变量的设置去判断不同的环境
// vue 中用的环境变量就是把 .env 文件读取出来 放到 process.env 上
// console.log('env >>> ', process.env)
// argv,node 1.js --target lib -> --target lib
// 在开发的时候 想获取用户的参数，是通过一些第三方包来使用的 Commander yargs
// console.log('argv >>> ', process.argv, process.argv.slice(2))

// const { program } = require('commander')
// 解析用户执行时携带的参数
// program.parse(process.argv)
// console.log('options >>> ', program.opts())

// setImmediate
// node 中的事件环，浏览器的事件环，一个宏任务队列，每次执行的时候还会产生一个微任务队列。执行的过程
// 中就是每次执行清空所有的微任务，执行一个宏任务

// 1. 默认第一个宏任务执行完毕后会调用 nextTick 中的所有方法
// 2. 当执行下一个宏任务之前会清空微任务队列
// 3. 依次取出队列中的宏任务执行，如果队列为空会进入到 node 事件环的下一个队列
process.nextTick(() => {
  console.log('nextTick >>> ')
})
setImmediate(() => {
  console.log('setImmediate >>> ')
})
// Buffer
