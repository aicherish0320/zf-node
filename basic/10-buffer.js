// global 上的重要属性-Buffer，Buffer 代表的是内存
// 计算机存储数据 二进制来存储的 01 来表示
// 早期 JS 没有读取数据的能力（文件读写），fs 模块可以进行文件的读写
// Node 为了能展现文件的内容，就采用了 Buffer 这种格式，展现形式是 16 进制，可以和字符串相互转化

// 掌握基本的进制转化，如何实现一个 base32 数据格式

// 二进制 0b 八进制0o 十进制 十六进制0x

// 如何将十进制转化成其他进制
// 50 -> 八进制 我们要对 8 取余数 （针对于整数来说的）
// 0.1 + 0.2 为什么不等于 0.3？
// 我们计算机计算的时候要将十进制转换成二进制
// 0.5 -> 转换成二进制 0.1，按照 *2 取整法来计算
// 000110001100011...
// 0.1 * 2 => 0.2 => 0
// 0.2 * 2 => 0.4 => 0
// 0.4 * 2 => 0.8 => 0
// 0.8 * 2 => 0.6 => 1
// 0.6 * 2 => 0.2 => 1
// 0.2 * 2 => 0.4 => 0

// 如何把其他进制转换成十进制
// 二进制数据 单位最小的叫 bit 位（二进制位），字节 1 字节=8位，k,kb
// 当前位上的值 * (当前进制 ^(所在的位数)) 累加
// JS 中的方法
// console.log(parseInt('100', 2))
// '100'.toString(16)

// base64 编码 ->
// base64 是用来干嘛的，传递有价值，我们的数据不能用中文来进行传递（乱码）
// base64 可以用在所有的连接处，减少请求
// 是否都要把图片转化成 base64 呢？把内容转化成 base64 之后，数据会比之前大1/3

// 含义是转化出字节的大小 不能超过 64，一个字节8个位，不超过 64 的8个位最大是多少？
// 128 64 32 16 8 4 2 1 -> 最大是 1 1 1 1 1 1
let str = '爱鹊絮'
// node 默认支持 utf-8 格式，一个汉字是三个字节，三个字节是 3 * 8 = 24 个位
// 需要把汉字没 6个位进行分割

console.log(Buffer.from('鹊'))

console.log((0xe9).toString(2))
console.log((0xb9).toString(2))
console.log((0x8a).toString(2))

// 111010 011011 100110 001010
console.log(parseInt('111010', 2)) // 58
console.log(parseInt('011011', 2)) // 27
console.log(parseInt('100110', 2)) // 38
console.log(parseInt('001010', 2)) // 10

let str2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
str2 += str2.toLocaleLowerCase()
str2 += '0123456789+/'

console.log(str2[58] + str2[27] + str2[38] + str2[10])
