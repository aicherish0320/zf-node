const a = require('./a') // 尝试添加 .js .json

console.log(a)

// 1. 内部先将 a 这个路径转换成绝对路径，并且尝试添加 .js .json ，如果文件无法找到则报错
// 2. 查看这个文件是否呗缓存过
// 3. 创建这样的一个模块{id: 绝对路径,exports: {}} exports 对象中存着对象最终导出的结果
// 4. 将模块缓存起来 主要缓存的就是 exports 对象
// 5. 最终返回 module.exports 对象
