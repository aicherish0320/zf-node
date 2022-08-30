// 在浏览器中全局对象是 window，在 node 中全局对象是 global
// console.log('this >>> ', this)
// console.dir(global, { showHidden: true })
// console.log('global >>> ', eval)

// node 中有五个属性可以直接访问，但是不是 global 上的属性
console.log(required)
console.log(module)
console.log(exports)
console.log(__dirname) // 表示当前文件所在的文件夹 是一个绝对路径
console.log(__filename) // 表示当前文件的路径 是一个绝对路径

// 这5个属性，都是通过函数参数传进来的
// commonjs 模块的定义 模块化
// 在没有 es6 模块，如何实现模块化呢？模块化解决了什么问题？
// 模块的特点，互不影响 还能互相调用（高内聚、低耦合）
// 解决命名冲突，创造 IIFE 来实现，解决命名冲突问题
// 一个文件一个模块
// 1. 别人想用我这个模块，就需要通过 require 语法
// 2. 我要给别人使用就将模块导出 module.exports
// 3. 每一个文件都是一个模块
