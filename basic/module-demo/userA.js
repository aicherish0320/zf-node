// 内部会自动添加后缀来查找 .js，如果没有会加 .json
const r = require('./a')

console.log('r >>> ', r)

// 在 require 的时候就会读取文件，将文件包裹成一个函数，并返回 module.exports 结果
// const r = (function (module, exports, require, __dirname, __filename) {
//   const a = 100
//   module.exports = a

//   return module.exports
// })(module, exports, require, __dirname, __filename)
