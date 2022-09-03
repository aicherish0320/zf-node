// buffer 表示内存的，编码格式是 16 进制的（短小），一个字节二进制是8个位，最大一个字节是255
// 用 16进制来表示 ff

// buffer 声明的方式，buffer 的特点是一旦声明不能修改大小，在声明 buffer 时需要传递大小

// 在node 中最小标识 单位是字节
// const buffer = Buffer.alloc(5)
// 在 node 中编码采用的是 utf-8,1个汉字是三个字节
// const buffer = Buffer.from('爱鹊絮')
// console.log('buffer >>> ', buffer)
// buffer 可以和字符串进行相互转化
// console.log(buffer.toString())

// 默认我们读取文件的时候读取到的结果都是 Buffer 类型

// 我们客户端会给服务端发送数据（传输数据都是分片传输）
// 将多个 buffer 拼接起来
// console.log('buffer >>> ', Buffer.from('爱鹊'))

// const buff1 = Buffer.from('爱')
// const buff2 = Buffer.from('鹊')
const buff1 = Buffer.from([0xe7, 0x88])
const buff2 = Buffer.from([0xb1, 0xe9, 0xb9, 0x8a])

// 将 buffer 拼接起来在进行 toString()
Buffer.prototype.copy = function (
  targetBuffer,
  targetStart,
  sourceStart = 0,
  sourceEnd = this.length
) {
  // buffer 很像数组
  for (let i = 0; i < sourceEnd - sourceStart; i++) {
    targetBuffer[targetStart + i] = this[sourceStart + i]
  }
}

// 这样直接拼接会出现乱码的问题
// console.log(buff1 + buff2)
// const bigBuffer = Buffer.alloc(6)
// buff1.copy(bigBuffer, 0, 0, 2)
// buff2.copy(bigBuffer, 2, 0, 4)
// console.log(bigBuffer.toString())

Buffer.concat = function (
  list,
  length = list.reduce((a, b) => a + b.length, 0)
) {
  const bigBuffer = Buffer.alloc(length)
  let offset = 0
  list.forEach((buf) => {
    buf.copy(bigBuffer, offset)
    offset += buf.length
  })
  return bigBuffer
}
// concat 拼接出来的是 buffer，因为数据可能是图片
// console.log(Buffer.concat([buff1, buff2]).toString())

// buffer 表示的是内存 可以截取
const buff4 = Buffer.from('爱鹊絮')
// 单位是字节索引，不是字符串索引
// console.log(buff4.slice(0, 6).toString())

// 判断一个数据是不是buffer，统一在操作数据的时候全部转成 buffer 来操作
// console.log(Buffer.isBuffer(buff4))

// 行读取器 遇到回车 换行就打印出来，分割数据

// form-data，这种格式需要我们手动的将数据进行拆分，拆分后来使用
Buffer.prototype.split = function (sep) {
  sep = Buffer.isBuffer(sep) ? sep : Buffer.from(sep)
  // 统一按照 Buffer 长度来计算
  const sepLength = sep.length
  let offset = 0 // 从哪里开始查找
  let index = 0 // 找到 - 的位置
  const arr = []
  while (-1 !== (index = this.indexOf(sep, offset))) {
    arr.push(this.slice(offset, index).toString())
    offset = index + sepLength
  }
  arr.push(this.slice(offset).toString())
  return arr
}

const buff5 = Buffer.from('爱鹊絮-爱鹊絮-爱鹊絮')

// console.log(buff5.split('-'))
console.log(buff5.indexOf('-'))
