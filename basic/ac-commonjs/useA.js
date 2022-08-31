// const a = require('./a') // 尝试添加 .js .json

// console.log('a >>> ', a)

// 1. 内部先将 a 这个路径转换成绝对路径，并且尝试添加 .js .json ，如果文件无法找到则报错
// 2. 查看这个文件是否被缓存过
// 3. 创建这样的一个模块{id: 绝对路径,exports: {}} exports 对象中存着对象最终导出的结果
// 4. 将模块缓存起来 主要缓存的就是 exports 对象
// 5. 最终返回 module.exports 对象

// 1. 有了模块后 会进行模块的加载
// 2. 可以直接读取文件，读取到文件后，会包装成一个函数
// 3. 让函数执行，让用户把结果放到了 module.exports 上
// const b = require('./b')
const { dirxml } = require('console')
const fs = require('fs')
const path = require('path')
const vm = require('vm')

function Module(id) {
  this.id = id
  this.exports = {}
}

Module.cache = {}

Module.prototype.load = function (id) {
  // 找到文件的后缀名
  const ext = path.extname(id)
  // 根据后缀名进行加载
  Module._extensions[ext](this)
}

// 前端实现模块化 需要通过 script 标签加载内容

Module._wrapper = [
  '(function(exports, module, require, __dirname, __filename){',
  '})'
]

Module._extensions = {
  '.js'(module) {
    let script = fs.readFileSync(module.id, 'utf-8')
    script = Module._wrapper[0] + script + Module._wrapper[1]
    const fn = vm.runInThisContext(script)
    let exports = module.exports
    let dirname = path.dirname(module.id)
    // module.exports 赋值，这回是用户主动赋值
    fn.call(exports, exports, module, req, dirname, module.id)
  },
  '.json'(module) {
    const jsonString = fs.readFileSync(module.id, 'utf-8')
    // 内部会将 json 赋予到 module.exports
    module.exports = JSON.parse(jsonString)
  }
}
Module._resolveFilename = function (id) {
  const filePath = path.resolve(__dirname, id)
  // 查看路径是否存在
  const exists = fs.existsSync(filePath)
  if (exists) {
    return filePath
  }
  // 需要尝试给路径添加后缀，策略模式，不同的后缀加载策略是不同的
  const extensions = Object.keys(Module._extensions)
  for (let i = 0; i < extensions.length; i++) {
    const extension = extensions[i]
    let newPath = filePath + extension
    if (fs.existsSync(newPath)) {
      return newPath
    }
  }
  throw new Error('module not found')
}

function req(id) {
  // 根据用户传入的 id，生成一个模块路径用于缓存
  const modulePath = Module._resolveFilename(id)

  let existsModule = Module._cache[modulePath]
  if (existsModule) {
    return existsModule.exports
  }

  let module = new Module(modulePath)
  // 缓存
  Module._cache[modulePath] = module
  //  用户会给 module.exports 赋予结果
  module.load(modulePath)
  // 最终就是返回 module.exports 对象
  return module.exports
}

const b = req('./a')
console.log('b >>> ', b)
